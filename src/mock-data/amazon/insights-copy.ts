import type { BusinessInsight } from "@/types/amazon";

export const DEFAULT_INSIGHTS: BusinessInsight = {
  id: "insight-default",
  paragraphs: [
    "In April 2026, your ordered product sales reached $93.5K, representing strong momentum heading into Q2. Your average selling price held steady near $40.68 per order item, indicating healthy unit economics across your catalog.",
    "Year-over-year, ordered product sales grew approximately +2,044% compared to the same period last year, driven by expanded catalog depth and improved Buy Box win rates on core ASINs. Peak daily volume occurred in late November 2024 with sustained elevation through spring 2026.",
    "Units ordered trended in parallel with revenue, averaging 1.24 units per order item. Consider reviewing the ASIN performance carousel for products with declining OPS to protect margin during seasonal transitions.",
  ],
};
