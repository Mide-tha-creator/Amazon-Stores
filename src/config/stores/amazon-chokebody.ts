import type { StoreConfig } from "@/config/stores/types";

export const amazonChokebodyConfig: StoreConfig = {
  id: "amazon-chokebody",
  name: "Chokebody Enterprise",
  marketplace: "amazon",
  template: "amazon-sales",
  description:
    "Fitness & wellness catalog with full Sales Dashboard, Business Reports, and ASIN performance insights.",
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
  defaultDateRange: { start: "2024-05-16", end: "2026-05-15" },
  regionLabel: "United States",
  routes: { home: "/store/amazon-chokebody/dashboard/sales" },
  dashboard: {
    asinTitle: "Deep dive into your sales",
    asinComparisonLabel: "Compared to prior week (May 4 – May 10, 2024)",
    defaultAsinCategory: "declining_sales",
    asinLayout: "carousel",
  },
};
