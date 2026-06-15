import type { StoreId } from "@/config/stores/types";
import type { CompareSalesAggregate } from "@/types/amazon";

/** Default headline KPI uplift (charts unchanged). */
export const STORE_KPI_DISPLAY_MULTIPLIER = 1.02;

/** Pin ordered product sales to an exact KPI total for a store. */
const AMAZON_KPI_SALES_TARGETS: Partial<Record<StoreId, number>> = {
  "amazon-chokebody": 1_641_125.53,
};

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

export function applyAmazonKpiDisplayAdjustment(
  storeId: StoreId,
  aggregate: CompareSalesAggregate
): CompareSalesAggregate {
  const salesTarget = AMAZON_KPI_SALES_TARGETS[storeId];
  if (salesTarget && aggregate.orderedProductSales > 0) {
    const multiplier = salesTarget / aggregate.orderedProductSales;
    return scaleAmazonAggregate(aggregate, multiplier, salesTarget);
  }

  return scaleAmazonAggregate(aggregate, STORE_KPI_DISPLAY_MULTIPLIER);
}
