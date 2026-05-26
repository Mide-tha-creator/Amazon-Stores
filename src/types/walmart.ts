export type WalmartMetricKey = "gmv" | "unitsSold" | "orders" | "aur";

export interface AccountSalesSummary {
  gmv: number;
  unitsSold: number;
  orders: number;
  aur: number;
}

export interface DailySalesRow {
  date: string;
  gmv: number;
  gmvChangePercent: number;
  gmvNetCommission: number;
  unitsSold: number;
  orders: number;
  aur: number;
  authSales: number;
  cancelledSales: number;
  refundSales: number;
}

export interface WalmartSalesInsightsResponse {
  summary: AccountSalesSummary;
  timeSeries: Record<WalmartMetricKey, { date: string; value: number }[]>;
  tableRows: DailySalesRow[];
}
