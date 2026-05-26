import { amazonApexConfig } from "@/config/stores/amazon-apex";
import { amazonChokebodyConfig } from "@/config/stores/amazon-chokebody";
import { amazonNovaConfig } from "@/config/stores/amazon-nova";
import { walmartMainConfig } from "@/config/stores/walmart-main";
import { walmartSecondConfig } from "@/config/stores/walmart-second";
import type { StoreConfig, StoreId } from "@/config/stores/types";

const STORE_MAP: Record<StoreId, StoreConfig> = {
  "amazon-chokebody": amazonChokebodyConfig,
  "amazon-apex": amazonApexConfig,
  "amazon-nova": amazonNovaConfig,
  "walmart-main": walmartMainConfig,
  "walmart-second": walmartSecondConfig,
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

export function getStorePath(storeId: StoreId, path: string): string {
  return `/store/${storeId}${path}`;
}
