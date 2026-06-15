import type {
  AsinAlert,
  BusinessInsight,
  CompareSalesAggregate,
  SalesSnapshot,
  SalesTimeSeriesPoint,
} from "@/types/amazon";
import type { RecentAnalyticsOverrides } from "@/types/recent-analytics";

export interface AmazonAdsMetrics {
  spend: number;
  roas: number;
  acos: number;
}

export interface AmazonConversionMetrics {
  rate: number;
  sessions: number;
}

export type AmazonTimeSeriesProfile =
  | "enterprise-decline"
  | "midmarket-growth"
  | "enterprise-twin-peak"
  | "midmarket-spike-decline";

export interface AmazonStoreDataConfig {
  timeSeriesSeed: number;
  timeSeriesMultiplier: number;
  timeSeriesProfile?: AmazonTimeSeriesProfile;
  seriesStart: string;
  seriesEnd: string;
  insights: BusinessInsight;
  asinAlerts: AsinAlert[];
  ads: AmazonAdsMetrics;
  conversion: AmazonConversionMetrics;
  defaultAggregate?: CompareSalesAggregateDefaults;
}

export interface AmazonStoreDataBundle {
  config: AmazonStoreDataConfig;
  fullTimeSeries: SalesTimeSeriesPoint[];
}

export interface CompareSalesAggregateDefaults {
  label: string;
  totalOrderItems: number;
  unitsOrdered: number;
  orderedProductSales: number;
  avgUnitsPerOrderItem: number;
  avgSalesPerOrderItem: number;
}

export interface StoreOverrides {
  recentAnalytics?: RecentAnalyticsOverrides;
  meta?: {
    displayName?: string;
  };
  amazon?: {
    snapshot?: Partial<SalesSnapshot>;
    aggregate?: Partial<CompareSalesAggregate>;
    timeSeries?: SalesTimeSeriesPoint[];
    insights?: BusinessInsight;
    asinAlerts?: AsinAlert[];
    ads?: Partial<AmazonAdsMetrics>;
    conversion?: Partial<AmazonConversionMetrics>;
    /** Subtitle under “Deep dive into your sales” on Sales Dashboard. */
    asinComparisonLabel?: string;
  };
}
