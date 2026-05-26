export interface SalesSnapshot {
  totalOrderItems: number;
  unitsOrdered: number;
  orderedProductSales: number;
  avgUnitsPerOrderItem: number;
  avgSalesPerOrderItem: number;
  generatedAt: string;
}

export interface SalesTimeSeriesPoint {
  date: string;
  unitsOrdered: number;
  orderedProductSales: number;
}

export interface CompareSalesAggregate {
  label: string;
  totalOrderItems: number;
  unitsOrdered: number;
  orderedProductSales: number;
  avgUnitsPerOrderItem: number;
  avgSalesPerOrderItem: number;
}

export interface BusinessInsight {
  id: string;
  paragraphs: string[];
}

export type AsinAlertCategory =
  | "declining_sales"
  | "increasing_sales"
  | "declining_traffic"
  | "increasing_traffic"
  | "growth_opportunities"
  | "below_market_average"
  | "top_sales_products";

export interface AsinAlert {
  asin: string;
  title: string;
  imageUrl: string;
  category: AsinAlertCategory;
  metricLabel: string;
  deltaAmount: number;
}

export interface SalesDashboardResponse {
  snapshot: SalesSnapshot;
  timeSeries: SalesTimeSeriesPoint[];
  aggregate: CompareSalesAggregate;
  insights: BusinessInsight;
  asinAlerts: AsinAlert[];
}

export type CompareViewMode = "graph" | "table";
