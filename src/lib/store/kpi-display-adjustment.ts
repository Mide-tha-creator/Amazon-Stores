import type { StoreId } from "@/config/stores/types";
import type { CompareSalesAggregate, SalesTimeSeriesPoint } from "@/types/amazon";

/** Default headline KPI uplift applied to snapshot cards and chart series. */
export const STORE_KPI_DISPLAY_MULTIPLIER = 1.148870923;

/** Pin ordered product sales to an exact KPI total for a store. */
const AMAZON_KPI_SALES_TARGETS: Partial<Record<StoreId, number>> = {
  "amazon-chokebody": 1_887_977.75,
};

export function getAmazonKpiDisplayMultiplier(
  storeId: StoreId,
  aggregate: CompareSalesAggregate
): number {
  const salesTarget = AMAZON_KPI_SALES_TARGETS[storeId];
  if (salesTarget && aggregate.orderedProductSales > 0) {
    return salesTarget / aggregate.orderedProductSales;
  }
  return STORE_KPI_DISPLAY_MULTIPLIER;
}

function scaleAmazonAggregate(
  aggregate: CompareSalesAggregate,
  multiplier: number,
  salesTarget?: number
): CompareSalesAggregate {
  const totalOrderItems = Math.round(aggregate.totalOrderItems * multiplier);
  const unitsOrdered = Math.round(aggregate.unitsOrdered * multiplier);
  const orderedProductSales =
    salesTarget ??
    Math.round(aggregate.orderedProductSales * multiplier * 100) / 100;
  const avgUnitsPerOrderItem =
    totalOrderItems > 0
      ? Math.round((unitsOrdered / totalOrderItems) * 100) / 100
      : 0;
  const avgSalesPerOrderItem =
    totalOrderItems > 0
      ? Math.round((orderedProductSales / totalOrderItems) * 100) / 100
      : 0;

  return {
    ...aggregate,
    totalOrderItems,
    unitsOrdered,
    orderedProductSales,
    avgUnitsPerOrderItem,
    avgSalesPerOrderItem,
  };
}

/** Scale chart series by the same multiplier used for KPI display. */
export function scaleAmazonTimeSeriesForDisplay(
  series: SalesTimeSeriesPoint[],
  multiplier: number
): SalesTimeSeriesPoint[] {
  if (multiplier === 1 || series.length === 0) return series;

  const scaled = series.map((p) => ({
    ...p,
    unitsOrdered: Math.round(p.unitsOrdered * multiplier),
    orderedProductSales:
      Math.round(p.orderedProductSales * multiplier * 100) / 100,
  }));

  const targetSales = series.reduce((s, p) => s + p.orderedProductSales, 0) * multiplier;
  const scaledSales = scaled.reduce((s, p) => s + p.orderedProductSales, 0);
  const drift = Math.round((targetSales - scaledSales) * 100) / 100;
  if (drift !== 0) {
    const last = scaled.length - 1;
    scaled[last] = {
      ...scaled[last],
      orderedProductSales:
        Math.round((scaled[last].orderedProductSales + drift) * 100) / 100,
    };
  }

  return scaled;
}

export function applyAmazonKpiDisplayAdjustment(
  storeId: StoreId,
  aggregate: CompareSalesAggregate
): CompareSalesAggregate {
  const salesTarget = AMAZON_KPI_SALES_TARGETS[storeId];
  const multiplier = getAmazonKpiDisplayMultiplier(storeId, aggregate);
  if (salesTarget && aggregate.orderedProductSales > 0) {
    return scaleAmazonAggregate(aggregate, multiplier, salesTarget);
  }

  return scaleAmazonAggregate(aggregate, multiplier);
}
