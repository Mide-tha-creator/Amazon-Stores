import { MOCK_API_DELAY_MS } from "@/lib/constants";
import { generateWalmartTimeSeries } from "@/mock-data/generators/time-series";
import type { ReportFilters } from "@/types/common";
import type {
  AccountSalesSummary,
  DailySalesRow,
  WalmartMetricKey,
  WalmartSalesInsightsResponse,
} from "@/types/walmart";

function delay(ms: number = MOCK_API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTableRows(
  points: ReturnType<typeof generateWalmartTimeSeries>
): DailySalesRow[] {
  return points.map((p, i) => {
    const prev = points[i - 1];
    const gmvChangePercent =
      prev && prev.gmv > 0
        ? Math.round(((p.gmv - prev.gmv) / prev.gmv) * 10000) / 100
        : 0;
    const commission = Math.round(p.gmv * 0.15 * 100) / 100;

    return {
      date: p.date,
      gmv: p.gmv,
      gmvChangePercent,
      gmvNetCommission: Math.round((p.gmv - commission) * 100) / 100,
      unitsSold: p.unitsSold,
      orders: p.orders,
      aur: p.aur,
      authSales: Math.round(p.gmv * 0.92 * 100) / 100,
      cancelledSales: Math.round(p.gmv * 0.03 * 100) / 100,
      refundSales: Math.round(p.gmv * 0.02 * 100) / 100,
    };
  });
}

export async function getWalmartSalesInsights(
  filters: ReportFilters
): Promise<WalmartSalesInsightsResponse> {
  await delay();

  const points = generateWalmartTimeSeries({
    startDate: filters.range.start,
    endDate: filters.range.end,
    seed: 99,
  });

  const tableRows = buildTableRows(points).reverse();

  const summary: AccountSalesSummary = {
    gmv: Math.round(tableRows.reduce((s, r) => s + r.gmv, 0) * 100) / 100,
    unitsSold: tableRows.reduce((s, r) => s + r.unitsSold, 0),
    orders: tableRows.reduce((s, r) => s + r.orders, 0),
    aur: 0,
  };
  summary.aur =
    summary.unitsSold > 0
      ? Math.round((summary.gmv / summary.unitsSold) * 100) / 100
      : 0;

  const timeSeries: WalmartSalesInsightsResponse["timeSeries"] = {
    gmv: points.map((p) => ({ date: p.date, value: p.gmv })),
    unitsSold: points.map((p) => ({ date: p.date, value: p.unitsSold })),
    orders: points.map((p) => ({ date: p.date, value: p.orders })),
    aur: points.map((p) => ({ date: p.date, value: p.aur })),
  };

  return { summary, timeSeries, tableRows };
}

export function getMetricLabel(key: WalmartMetricKey): string {
  const labels: Record<WalmartMetricKey, string> = {
    gmv: "GMV",
    unitsSold: "Units Sold",
    orders: "Orders",
    aur: "AUR",
  };
  return labels[key];
}
