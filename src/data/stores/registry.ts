import { buildAmazonBundle } from "@/data/stores/build-amazon-bundle";
import { amazonApexDataConfig } from "@/data/stores/amazon-apex/dashboard";
import { amazonChokebodyDataConfig } from "@/data/stores/amazon-chokebody/dashboard";
import { amazonNovaDataConfig } from "@/data/stores/amazon-nova/dashboard";
import { getTodayIso } from "@/lib/store/rolling-dashboard-range";
import type { StoreId } from "@/config/stores/types";
import type { AmazonStoreDataBundle } from "@/types/store-data";

const AMAZON_CONFIGS = {
  "amazon-chokebody": amazonChokebodyDataConfig,
  "amazon-apex": amazonApexDataConfig,
  "amazon-nova": amazonNovaDataConfig,
} as const;

export function getAmazonBundle(storeId: StoreId): AmazonStoreDataBundle {
  const config = AMAZON_CONFIGS[storeId as keyof typeof AMAZON_CONFIGS];
  if (!config) {
    throw new Error(`${storeId} is not an Amazon store`);
  }
  return buildAmazonBundle({
    ...config,
    seriesEnd: getTodayIso(),
  });
}
