import {
  DEFAULT_AMAZON_ACCOUNT,
  getAccountSlug,
  type AccountSlug,
} from "@/lib/navigation/account-registry";
import type { StoreId } from "@/config/stores/types";

export const AMAZON_REF_ENTRY_PATH =
  "/business-reports/ref=xx_sitemetric_dnav_xx" as const;

export function getAmazonSalesDashboardPath(
  storeId: StoreId,
  account: AccountSlug = getAccountSlug(storeId)
): string {
  return `/business-reports/accounts/${account}/sales-dashboard`;
}

export function getAmazonReportPath(
  storeId: StoreId,
  reportSlug: string,
  account: AccountSlug = getAccountSlug(storeId)
): string {
  return `/business-reports/accounts/${account}/reports/${reportSlug}`;
}

export function getDefaultAmazonHomePath(): string {
  return `/business-reports/accounts/${DEFAULT_AMAZON_ACCOUNT}/sales-dashboard`;
}

/** Maps legacy in-app path suffixes to enterprise URLs. */
export function getStorePath(storeId: StoreId, path: string): string {
  if (path === "/dashboard/sales") {
    return getAmazonSalesDashboardPath(storeId);
  }

  if (path.startsWith("/reports/")) {
    const reportSlug = path.slice("/reports/".length);
    return getAmazonReportPath(storeId, reportSlug);
  }

  return path;
}
