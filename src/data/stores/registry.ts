import { amazonApexBundle } from "@/data/stores/amazon-apex/dashboard";
import { amazonChokebodyBundle } from "@/data/stores/amazon-chokebody/dashboard";
import { amazonNovaBundle } from "@/data/stores/amazon-nova/dashboard";
import { walmartMainBundle } from "@/data/stores/walmart-main/sales-insights";
import { walmartSecondBundle } from "@/data/stores/walmart-second/sales-insights";
import type { StoreId } from "@/config/stores/types";
import type { AmazonStoreDataBundle, WalmartStoreDataBundle } from "@/types/store-data";

export function getAmazonBundle(storeId: StoreId): AmazonStoreDataBundle {
  switch (storeId) {
    case "amazon-chokebody":
      return amazonChokebodyBundle;
    case "amazon-apex":
      return amazonApexBundle;
    case "amazon-nova":
      return amazonNovaBundle;
    default:
      throw new Error(`${storeId} is not an Amazon store`);
  }
}

export function getWalmartBundle(storeId: StoreId): WalmartStoreDataBundle {
  switch (storeId) {
    case "walmart-main":
      return walmartMainBundle;
    case "walmart-second":
      return walmartSecondBundle;
    default:
      throw new Error(`${storeId} is not a Walmart store`);
  }
}
