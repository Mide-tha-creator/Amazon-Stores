import { amazonApexConfig } from "@/config/stores/amazon-apex";
import { amazonChokebodyConfig } from "@/config/stores/amazon-chokebody";
import { amazonNovaConfig } from "@/config/stores/amazon-nova";
import { getFullHistoryDashboardDateRange } from "@/lib/store/rolling-dashboard-range";
import type { DateRange } from "@/types/common";
import type { StoreConfig, StoreId } from "@/config/stores/types";

export { getStorePath } from "@/lib/navigation/routes";

const STORE_MAP: Record<StoreId, StoreConfig> = {
  "amazon-chokebody": amazonChokebodyConfig,
  "amazon-apex": amazonApexConfig,
  "amazon-nova": amazonNovaConfig,
};

export const STORE_IDS = Object.keys(STORE_MAP) as StoreId[];

export const ALL_STORES: StoreConfig[] = STORE_IDS.map((id) => STORE_MAP[id]);

export function isValidStoreId(id: string): id is StoreId {
  return id in STORE_MAP;
}

export function getStoreConfig(storeId: string): StoreConfig {
  if (!isValidStoreId(storeId)) {
    throw new Error(`Unknown store: ${storeId}`);
  }
  return STORE_MAP[storeId];
}

/** Full history through today for dashboard charts and KPIs (start from store config). */
export function getStoreDefaultDateRange(storeId: StoreId): DateRange {
  const { defaultDateRange } = getStoreConfig(storeId);
  return getFullHistoryDashboardDateRange(defaultDateRange.start);
}
