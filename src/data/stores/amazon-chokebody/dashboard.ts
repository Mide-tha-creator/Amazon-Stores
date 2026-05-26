import { buildAmazonBundle } from "@/data/stores/build-amazon-bundle";
import type { AmazonStoreDataConfig } from "@/types/store-data";

export const amazonChokebodyDataConfig: AmazonStoreDataConfig = {
  timeSeriesSeed: 42,
  timeSeriesMultiplier: 1,
  timeSeriesProfile: "midmarket-growth",
  seriesStart: "2024-05-16",
  seriesEnd: "2026-05-15",
  defaultAggregate: {
    label: "Selected date range",
    totalOrderItems: 39554,
    unitsOrdered: 48959,
    orderedProductSales: 1608946.6,
    avgUnitsPerOrderItem: 1.24,
    avgSalesPerOrderItem: 40.68,
  },
  insights: {
    id: "chokebody-insights",
    paragraphs: [
      "In April 2026, your ordered product sales reached $93.5K with strong momentum across the catalog. Average selling price held near $40.68 per order item, while units ordered totaled 3,334 for the month with an average price around $28.",
      "Year-over-year ordered product sales grew approximately +2,044% compared to the prior period. Page views reached 1.34M, supporting continued visibility for top ASINs in the performance carousel.",
      "Review ASINs with declining OPS in the performance carousel before Q3 inventory planning—several gum and confection SKUs show measurable week-over-week softness.",
    ],
  },
  asinAlerts: [
    {
      asin: "B07HJF26M5",
      title: "Dubble Bubble Fruit Gumballs 850 Count Refill",
      imageUrl:
        "https://images.unsplash.com/photo-1582053439779-9e1a1c38c32e?w=120&h=120&fit=crop",
      category: "declining_sales",
      metricLabel: "$573.45 decline in OPS",
      deltaAmount: -573.45,
    },
    {
      asin: "B08XYZ1234",
      title: "Chokebody Resistance Bands Set - 5 Levels",
      imageUrl:
        "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=120&h=120&fit=crop",
      category: "declining_sales",
      metricLabel: "$412.20 decline in OPS",
      deltaAmount: -412.2,
    },
    {
      asin: "B09ABC5678",
      title: "Premium Gym Towel 2-Pack Quick Dry",
      imageUrl:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=120&fit=crop",
      category: "declining_sales",
      metricLabel: "$298.15 decline in OPS",
      deltaAmount: -298.15,
    },
    {
      asin: "B07DEF9012",
      title: "Protein Shaker Bottle 28oz BPA-Free",
      imageUrl:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=120&h=120&fit=crop",
      category: "declining_sales",
      metricLabel: "$245.10 decline in OPS",
      deltaAmount: -245.1,
    },
    {
      asin: "B09JKL7890",
      title: "Jump Rope Weighted Speed Cable",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=120&fit=crop",
      category: "increasing_sales",
      metricLabel: "$245.80 increase in OPS",
      deltaAmount: 245.8,
    },
  ],
  ads: { spend: 42850, roas: 3.42, acos: 18.2 },
  conversion: { rate: 12.4, sessions: 284500 },
};

export const amazonChokebodyBundle = buildAmazonBundle(amazonChokebodyDataConfig);
