import type { Metadata } from "next";
import type { StoreConfig } from "@/config/stores/types";

export const PLATFORM_TITLE = "Seller Analytics Platform";
export const AMAZON_TAB_TITLE = "Business Reports";

export const PLATFORM_DESCRIPTION =
  "Business reports, sales performance, and marketplace analytics for seller operations.";

export const AMAZON_DESCRIPTION =
  "Sales dashboard, business reports, and ASIN performance metrics for Amazon Seller Central.";

/** Bump when a favicon asset changes so browsers refetch instead of using a cached icon. */
export const FAVICON_VERSION = "5";

export const AMAZON_FAVICON = `/favicons/amazon.png?v=${FAVICON_VERSION}`;

export function getStoreIconsMetadata(): NonNullable<Metadata["icons"]> {
  return {
    icon: [{ url: AMAZON_FAVICON, type: "image/png", sizes: "32x32" }],
    shortcut: AMAZON_FAVICON,
  };
}

export function getStorePageMetadata(config: StoreConfig): Metadata {
  void config;
  return {
    title: AMAZON_TAB_TITLE,
    description: AMAZON_DESCRIPTION,
    icons: getStoreIconsMetadata(),
    openGraph: {
      title: AMAZON_TAB_TITLE,
      description: AMAZON_DESCRIPTION,
      siteName: "Amazon Seller Central",
    },
  };
}

export const rootPlatformMetadata: Metadata = {
  title: {
    default: PLATFORM_TITLE,
    template: "%s",
  },
  description: PLATFORM_DESCRIPTION,
  applicationName: "Seller Analytics Platform",
  icons: getStoreIconsMetadata(),
  openGraph: {
    title: PLATFORM_TITLE,
    description: PLATFORM_DESCRIPTION,
  },
};
