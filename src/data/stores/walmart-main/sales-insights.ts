import { generateWalmartTimeSeries } from "@/mock-data/generators/time-series";
import type {
  AccountSalesSummary,
  DailySalesRow,
  WalmartMetricKey,
} from "@/types/walmart";
import type { WalmartStoreDataBundle, WalmartStoreDataConfig } from "@/types/store-data";

export const walmartMainDataConfig: WalmartStoreDataConfig = {
  timeSeriesSeed: 99,
  timeSeriesProfile: "spike-collapse",
  rangeStart: "2024-01-01",
  rangeEnd: "2026-05-14",
  defaultSummary: {
    gmv: 313149.91,
    unitsSold: 15031,
    orders: 14472,
    aur: 20.83,
  },
};

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

function buildWalmartBundle(): WalmartStoreDataBundle {
  const points = generateWalmartTimeSeries({
    startDate: walmartMainDataConfig.rangeStart,
    endDate: walmartMainDataConfig.rangeEnd,
    seed: walmartMainDataConfig.timeSeriesSeed,
    walmartTimeSeriesProfile: walmartMainDataConfig.timeSeriesProfile,
    targetSales: walmartMainDataConfig.defaultSummary?.gmv,
  });

  const tableRows = buildTableRows(points).reverse();
  const summary: AccountSalesSummary =
    walmartMainDataConfig.defaultSummary ?? {
      gmv: 0,
      unitsSold: 0,
      orders: 0,
      aur: 0,
    };

  const timeSeries: Record<WalmartMetricKey, { date: string; value: number }[]> = {
    gmv: points.map((p) => ({ date: p.date, value: p.gmv })),
    unitsSold: points.map((p) => ({ date: p.date, value: p.unitsSold })),
    orders: points.map((p) => ({ date: p.date, value: p.orders })),
    aur: points.map((p) => ({ date: p.date, value: p.aur })),
  };

  return {
    config: walmartMainDataConfig,
    summary,
    timeSeries,
    tableRows,
  };
}

export const walmartMainBundle = buildWalmartBundle();
