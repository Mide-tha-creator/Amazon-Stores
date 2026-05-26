import type { StoreConfig } from "@/config/stores/types";

export const walmartSecondConfig: StoreConfig = {
  id: "walmart-second",
  name: "Second Walmart Store",
  marketplace: "walmart",
  template: "walmart-insights",
  description:
    "Account sales summary with GMV, units, orders, and AUR aligned to the May 2024–May 2026 reporting window.",
  logo: { src: "/brands/walmart-seller-center.svg", alt: "Walmart Seller Center" },
  branding: {
    primary: "#0071ce",
    primaryHover: "#004f9a",
    topnavBg: "#ffffff",
    pageBg: "#f4f7f9",
    sidebarBg: "#ffffff",
    chartAccent: "#7d5ab5",
    chartPurple: "#7659b6",
  },
  defaultDateRange: { start: "2024-05-01", end: "2026-05-14" },
  regionLabel: "United States",
  routes: { home: "/store/walmart-second/analytics/sales-insights" },
  topNav: {
    searchPlaceholder: "Try searching for Order",
    messageBadge: 2,
    notificationBadge: 36,
  },
};
