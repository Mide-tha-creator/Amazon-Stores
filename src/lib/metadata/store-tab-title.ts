import type { Marketplace } from "@/config/stores/types";

export const AMAZON_TAB_TITLE = "Business Reports | Amazon Seller Central";
export const WALMART_TAB_TITLE = "Account sales | Walmart Seller Center";

export function getStoreTabTitle(marketplace: Marketplace): string {
  return marketplace === "amazon" ? AMAZON_TAB_TITLE : WALMART_TAB_TITLE;
}

