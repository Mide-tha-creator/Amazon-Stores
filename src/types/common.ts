export type FulfillmentChannel = "both" | "amazon" | "seller";

export type SalesBreakdown = "marketplace_total" | "fba_only" | "seller_only";

export type DatePreset = "today" | "7d" | "30d" | "90d" | "ytd" | "custom";

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportFilters {
  preset: DatePreset;
  range: DateRange;
  fulfillment: FulfillmentChannel;
  salesBreakdown: SalesBreakdown;
}
