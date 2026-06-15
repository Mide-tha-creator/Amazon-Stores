import { MOCK_API_DELAY_MS } from "@/lib/constants";
import { isValidStoreId } from "@/config/stores/registry";
import type { StoreId } from "@/config/stores/types";
import {
  applyIncrementToAmazonAggregate,
  computeRecentAnalyticsKpiIncrement,
} from "@/lib/store/recent-analytics-kpi-increment";
import { applyAmazonKpiDisplayAdjustment } from "@/lib/store/kpi-display-adjustment";
import {
  getResolvedAmazonBundle,
  loadStoreOverrides,
} from "@/lib/store/resolve-store-data";
import type { ReportFilters } from "@/types/common";
import type {
  CompareSalesAggregate,
  SalesDashboardResponse,
  SalesSnapshot,
  SalesTimeSeriesPoint,
} from "@/types/amazon";

const fulfillmentMultipliers: Record<ReportFilters["fulfillment"], number> = {
  both: 1,
  amazon: 0.72,
  seller: 0.35,
};

const salesBreakdownMultipliers: Record<
  ReportFilters["salesBreakdown"],
  number
> = {
  marketplace_total: 1,
  fba_only: 0.68,
  seller_only: 0.38,
};

function applySalesBreakdownToSeries(
  series: SalesTimeSeriesPoint[],
  salesBreakdown: ReportFilters["salesBreakdown"]
): SalesTimeSeriesPoint[] {
  const mult = salesBreakdownMultipliers[salesBreakdown];
  if (mult === 1) return series;
  return series.map((p) => ({
    ...p,
    unitsOrdered: Math.round(p.unitsOrdered * mult),
    orderedProductSales: Math.round(p.orderedProductSales * mult * 100) / 100,
  }));
}

function delay(ms: number = MOCK_API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterSeries(
  series: SalesTimeSeriesPoint[],
  range: ReportFilters["range"]
): SalesTimeSeriesPoint[] {
  return series.filter((p) => p.date >= range.start && p.date <= range.end);
}

function applyFulfillmentToSeries(
  series: SalesTimeSeriesPoint[],
  fulfillment: ReportFilters["fulfillment"]
): SalesTimeSeriesPoint[] {
  const mult = fulfillmentMultipliers[fulfillment];
  if (mult === 1) return series;
  return series.map((p) => ({
    ...p,
    unitsOrdered: Math.round(p.unitsOrdered * mult),
    orderedProductSales: Math.round(p.orderedProductSales * mult * 100) / 100,
  }));
}

function aggregateFromSeries(series: SalesTimeSeriesPoint[]): CompareSalesAggregate {
  const totalOrderItems = series.reduce(
    (sum, p) => sum + Math.round(p.unitsOrdered / 1.24),
    0
  );
  const unitsOrdered = series.reduce((sum, p) => sum + p.unitsOrdered, 0);
  const orderedProductSales = series.reduce(
    (sum, p) => sum + p.orderedProductSales,
    0
  );
  const avgUnitsPerOrderItem =
    totalOrderItems > 0
      ? Math.round((unitsOrdered / totalOrderItems) * 100) / 100
      : 0;
  const avgSalesPerOrderItem =
    totalOrderItems > 0
      ? Math.round((orderedProductSales / totalOrderItems) * 100) / 100
      : 0;

  return {
    label: "Selected date range",
    totalOrderItems,
    unitsOrdered,
    orderedProductSales: Math.round(orderedProductSales * 100) / 100,
    avgUnitsPerOrderItem,
    avgSalesPerOrderItem,
  };
}

function buildSnapshot(
  aggregate: CompareSalesAggregate,
  override?: Partial<SalesSnapshot>
): SalesSnapshot {
  const base: SalesSnapshot = {
    totalOrderItems: aggregate.totalOrderItems,
    unitsOrdered: aggregate.unitsOrdered,
    orderedProductSales: aggregate.orderedProductSales,
    avgUnitsPerOrderItem: aggregate.avgUnitsPerOrderItem,
    avgSalesPerOrderItem: aggregate.avgSalesPerOrderItem,
    generatedAt: new Date().toISOString(),
  };
  if (!override) return base;
  return {
    ...base,
    ...override,
    generatedAt: override.generatedAt ?? base.generatedAt,
  };
}

export async function getAmazonDashboard(
  storeId: string,
  filters: ReportFilters
): Promise<SalesDashboardResponse> {
  await delay();
  if (!isValidStoreId(storeId)) throw new Error(`Unknown store: ${storeId}`);

  const bundle = getResolvedAmazonBundle(storeId as StoreId);
  const allOverrides = loadStoreOverrides(storeId);
  const overrides = allOverrides?.amazon;

  let fullSeries = bundle.fullTimeSeries;
  fullSeries = applyFulfillmentToSeries(fullSeries, filters.fulfillment);
  fullSeries = applySalesBreakdownToSeries(fullSeries, filters.salesBreakdown);
  const timeSeries = filterSeries(fullSeries, filters.range);

  const computedAggregate = aggregateFromSeries(timeSeries);

  let baseAggregate = computedAggregate;

  const kpiIncrement = computeRecentAnalyticsKpiIncrement(
    storeId as StoreId,
    allOverrides,
    filters.range
  );
  if (
    kpiIncrement.totalSales !== 0 ||
    kpiIncrement.unitsSold !== 0 ||
    kpiIncrement.orders !== 0
  ) {
    baseAggregate = applyIncrementToAmazonAggregate(baseAggregate, kpiIncrement);
  }

  baseAggregate = applyAmazonKpiDisplayAdjustment(storeId as StoreId, baseAggregate);

  const aggregate = overrides?.aggregate
    ? { ...baseAggregate, ...overrides.aggregate }
    : baseAggregate;

  const snapshot = buildSnapshot(aggregate, {
    ...overrides?.snapshot,
    generatedAt: new Date().toISOString(),
  });

  return {
    snapshot,
    timeSeries,
    aggregate,
    insights: bundle.config.insights,
    asinAlerts: bundle.config.asinAlerts,
  };
}
