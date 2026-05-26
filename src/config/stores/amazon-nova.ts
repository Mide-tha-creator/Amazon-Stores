import type { StoreConfig } from "@/config/stores/types";

export const amazonNovaConfig: StoreConfig = {
  id: "amazon-nova",
  name: "Kursat",
  marketplace: "amazon",
  template: "amazon-sales",
  description:
    "Kursat catalog with Seller Central sales dashboard, ASIN performance insights, and market comparisons.",
  logo: {
    src: "/brands/amazon-seller-central.png",
    alt: "Amazon Seller Central",
  },
  branding: {
    primary: "#008296",
    primaryHover: "#006b7a",
    topnavBg: "#002f36",
    pageBg: "#f0f8f9",
    sidebarBg: "#f0f2f2",
    chartAccent: "#008296",
  },
  defaultDateRange: { start: "2024-08-14", end: "2026-05-15" },
  regionLabel: "United States",
  routes: { home: "/store/amazon-nova/dashboard/sales" },
  dashboard: {
    asinTitle: "Deep dive your ASIN performance",
    asinComparisonLabel:
      "Comparing Monday-Sunday ending May 10, 2026 to similar ASINs",
    defaultAsinCategory: "below_market_average",
    asinLayout: "horizontal",
  },
};
