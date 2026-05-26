import type { StoreConfig } from "@/config/stores/types";

export const amazonApexConfig: StoreConfig = {
  id: "amazon-apex",
  name: "Sanabul",
  marketplace: "amazon",
  template: "amazon-sales",
  description:
    "Boxing & martial arts equipment with Sanabul-branded sales analytics and performance insights.",
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
  defaultDateRange: { start: "2024-05-15", end: "2026-05-14" },
  regionLabel: "United States",
  routes: { home: "/store/amazon-apex/dashboard/sales" },
  dashboard: {
    asinTitle: "Deep dive into your sales",
    defaultAsinCategory: "growth_opportunities",
    asinLayout: "carousel",
  },
};
