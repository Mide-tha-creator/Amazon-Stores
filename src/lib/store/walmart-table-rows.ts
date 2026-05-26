import type { DailySalesRow } from "@/types/walmart";

/** Normalize a date field to YYYY-MM-DD for storage and filtering */
export function normalizeTableRowDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, month, day, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return trimmed;
}

export function recalculateWalmartTableRows(rows: DailySalesRow[]): DailySalesRow[] {
  const ascending = [...rows].sort((a, b) => a.date.localeCompare(b.date));

  const withMetrics = ascending.map((row, index) => {
    const prev = ascending[index - 1];
    const gmvChangePercent =
      prev && prev.gmv > 0
        ? Math.round(((row.gmv - prev.gmv) / prev.gmv) * 10000) / 100
        : 0;
    const commission = Math.round(row.gmv * 0.15 * 100) / 100;

    return {
      ...row,
      date: normalizeTableRowDate(row.date),
      gmvChangePercent,
      gmvNetCommission: Math.round((row.gmv - commission) * 100) / 100,
      aur: row.unitsSold > 0 ? Math.round((row.gmv / row.unitsSold) * 100) / 100 : 0,
      authSales: Math.round(row.gmv * 0.92 * 100) / 100,
      cancelledSales: Math.round(row.gmv * 0.03 * 100) / 100,
      refundSales: Math.round(row.gmv * 0.02 * 100) / 100,
    };
  });

  return withMetrics.reverse();
}
