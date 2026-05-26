import { generateAmazonTimeSeries } from "@/mock-data/generators/time-series";
import type { AmazonStoreDataBundle, AmazonStoreDataConfig } from "@/types/store-data";

export function buildAmazonBundle(config: AmazonStoreDataConfig): AmazonStoreDataBundle {
  const fullTimeSeries = generateAmazonTimeSeries({
    startDate: config.seriesStart,
    endDate: config.seriesEnd,
    seed: config.timeSeriesSeed,
    fulfillmentMultiplier: config.timeSeriesMultiplier,
    targetUnits: config.defaultAggregate?.unitsOrdered,
    targetSales: config.defaultAggregate?.orderedProductSales,
    timeSeriesProfile: config.timeSeriesProfile ?? "enterprise-decline",
  });

  return { config, fullTimeSeries };
}
