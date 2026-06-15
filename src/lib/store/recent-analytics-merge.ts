import { getAmazonBundle } from "@/data/stores/registry";
import type { StoreId } from "@/config/stores/types";
import {
  filterRecordsToWindow,
  getRecentAnalyticsWindow,
  getStoreAnalyticsAnchorEnd,
  isDateInRecentWindow,
} from "@/lib/store/recent-analytics-window";
import { normalizeAnalyticsDate } from "@/lib/store/normalize-analytics-date";
import type { SalesTimeSeriesPoint } from "@/types/amazon";
import type { AmazonStoreDataBundle, StoreOverrides } from "@/types/store-data";
import type { RecentAnalyticsRecord } from "@/types/recent-analytics";

export function recordToAmazonPoint(
  record: RecentAnalyticsRecord
): SalesTimeSeriesPoint {
  return {
    date: normalizeAnalyticsDate(record.date),
    orderedProductSales: record.totalSales,
    unitsOrdered: record.unitsSold,
  };
}

export function amazonSeriesToRecords(
  series: SalesTimeSeriesPoint[],
  windowStart: string
): RecentAnalyticsRecord[] {
  return series
    .filter((p) => p.date >= windowStart)
    .map((p) => ({
      date: p.date,
      totalSales: p.orderedProductSales,
      unitsSold: p.unitsOrdered,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function mergeSeriesByDate(
  base: SalesTimeSeriesPoint[],
  patches: Map<string, SalesTimeSeriesPoint>
): SalesTimeSeriesPoint[] {
  const byDate = new Map(
    base.map((p) => [normalizeAnalyticsDate(p.date), p])
  );
  for (const [date, point] of patches) {
    byDate.set(date, point);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function mergeRecentAnalyticsIntoAmazonBundle(
  base: AmazonStoreDataBundle,
  overrides: StoreOverrides | null
): SalesTimeSeriesPoint[] {
  const anchorEnd = getStoreAnalyticsAnchorEnd(base.config);
  const window = getRecentAnalyticsWindow(anchorEnd);

  let series = [...base.fullTimeSeries];

  if (overrides?.amazon?.timeSeries) {
    const legacy = overrides.amazon.timeSeries;
    const legacyMap = new Map(legacy.map((p) => [p.date, p]));
    series = series.map((p) => {
      if (isDateInRecentWindow(p.date, window) && overrides.recentAnalytics?.records) {
        return p;
      }
      return legacyMap.get(p.date) ?? p;
    });
    if (!overrides.recentAnalytics?.records?.length) {
      series.sort((a, b) => a.date.localeCompare(b.date));
      return series;
    }
  }

  const records = overrides?.recentAnalytics?.records ?? [];
  const filtered = filterRecordsToWindow(records, window);
  if (filtered.length === 0) return series;

  const patchMap = new Map(
    filtered.map((r) => [normalizeAnalyticsDate(r.date), recordToAmazonPoint(r)])
  );
  return mergeSeriesByDate(series, patchMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export function loadRecentAnalyticsRecordsForStore(
  storeId: StoreId,
  overrides: StoreOverrides | null
): RecentAnalyticsRecord[] {
  const anchorEnd = getStoreAnalyticsAnchorEnd(getAmazonBundle(storeId).config);
  const window = getRecentAnalyticsWindow(anchorEnd);

  if (overrides?.recentAnalytics?.records?.length) {
    return filterRecordsToWindow(overrides.recentAnalytics.records, window).sort(
      (a, b) => b.date.localeCompare(a.date)
    );
  }

  let series = getAmazonBundle(storeId).fullTimeSeries;
  if (overrides?.amazon?.timeSeries) {
    series = overrides.amazon.timeSeries;
  }
  return amazonSeriesToRecords(series, window.start);
}

export function buildOverridesFromRecentRecords(
  storeId: StoreId,
  records: RecentAnalyticsRecord[],
  existing: StoreOverrides | null
): StoreOverrides {
  const anchorEnd = getStoreAnalyticsAnchorEnd(getAmazonBundle(storeId).config);
  const window = getRecentAnalyticsWindow(anchorEnd);
  const inWindow = filterRecordsToWindow(records, window);

  const next: StoreOverrides = {
    ...existing,
    recentAnalytics: {
      records: inWindow.sort((a, b) => a.date.localeCompare(b.date)),
      windowEnd: anchorEnd,
    },
  };

  const base = getAmazonBundle(storeId);
  const merged = mergeRecentAnalyticsIntoAmazonBundle(base, {
    ...next,
    recentAnalytics: next.recentAnalytics,
  });
  const windowOnly = merged.filter((p) => isDateInRecentWindow(p.date, window));
  next.amazon = {
    ...existing?.amazon,
    timeSeries: windowOnly,
  };

  return next;
}
