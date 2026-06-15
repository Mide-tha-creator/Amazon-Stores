import { generateAmazonBehavioralSeries, mulberry32 } from "@/mock-data/generators/amazon-behavioral-series";
import { generateAmazonApexSeries } from "@/mock-data/generators/amazon-apex-series";
import { generateAmazonChokebodySeries } from "@/mock-data/generators/amazon-chokebody-series";
import { generateAmazonNovaSeries } from "@/mock-data/generators/amazon-nova-series";
import { applyAmazonLast90DaysLift } from "@/mock-data/generators/amazon-last-90-days-lift";
import {
  amazonProfileToGrowthProfile,
  applyTrailingFiveDayGrowthAmazon,
} from "@/mock-data/generators/apply-trailing-five-day-growth";
import type { AmazonTimeSeriesProfile } from "@/types/store-data";

export interface GenerateTimeSeriesOptions {
  startDate: string;
  endDate: string;
  seed?: number;
  fulfillmentMultiplier?: number;
  targetUnits?: number;
  targetSales?: number;
  timeSeriesProfile?: AmazonTimeSeriesProfile;
}

function finishAmazonSeries(
  points: { date: string; unitsOrdered: number; orderedProductSales: number }[],
  options: GenerateTimeSeriesOptions
) {
  const seed = options.seed ?? 42;
  const lifted = applyAmazonLast90DaysLift(points, {
    seed,
    preserveTotals: false,
  });
  return applyTrailingFiveDayGrowthAmazon(lifted, {
    seed,
    profile: amazonProfileToGrowthProfile(options.timeSeriesProfile),
  });
}

export function generateAmazonTimeSeries(
  options: GenerateTimeSeriesOptions
): { date: string; unitsOrdered: number; orderedProductSales: number }[] {
  if (options.timeSeriesProfile === "midmarket-growth") {
    return finishAmazonSeries(generateAmazonChokebodySeries(options), options);
  }
  if (options.timeSeriesProfile === "enterprise-twin-peak") {
    return finishAmazonSeries(generateAmazonApexSeries(options), options);
  }
  if (options.timeSeriesProfile === "midmarket-spike-decline") {
    return finishAmazonSeries(generateAmazonNovaSeries(options), options);
  }
  return finishAmazonSeries(generateAmazonBehavioralSeries(options), options);
}

export { mulberry32 };
