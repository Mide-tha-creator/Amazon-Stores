import type { StoreConfig } from "@/config/stores/types";

export const walmartMainConfig: StoreConfig = {
  id: "walmart-main",
  name: "Walmart Seller Center",
  marketplace: "walmart",
  template: "walmart-insights",
  description:
    "Account sales summary with GMV, units, orders, AUR trends, and daily performance tables.",
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
  defaultDateRange: { start: "2024-01-01", end: "2026-05-14" },
  regionLabel: "United States",
  routes: { home: "/store/walmart-main/analytics/sales-insights" },
};
