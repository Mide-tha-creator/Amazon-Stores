import type { AsinAlertCategory } from "@/types/amazon";

export interface StoreDashboardUi {
  asinTitle?: string;
  asinComparisonLabel?: string;
  defaultAsinCategory?: AsinAlertCategory;
  asinLayout?: "carousel" | "horizontal";
}

export interface StoreBranding {
  primary: string;
  primaryHover?: string;
  topnavBg?: string;
  pageBg?: string;
  sidebarBg?: string;
  chartAccent?: string;
  chartPurple?: string;
}

export interface StoreTopNavUi {
  searchPlaceholder?: string;
  messageBadge?: number;
  notificationBadge?: number;
}

export interface StoreConfig {
  id: string;
  name: string;
  marketplace: "amazon";
  template: "amazon-sales";
  description: string;
  logo: { src: string; alt: string };
  branding: StoreBranding;
  defaultDateRange: { start: string; end: string };
  regionLabel: string;
  routes: {
    home: string;
  };
  dashboard?: StoreDashboardUi;
  topNav?: StoreTopNavUi;
}

export type StoreId = "amazon-chokebody" | "amazon-apex" | "amazon-nova";
