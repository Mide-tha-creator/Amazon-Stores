"use client";

import { useSyncExternalStore } from "react";
import { getStoreConfig } from "@/config/stores/registry";
import type { StoreConfig, StoreId } from "@/config/stores/types";
import { loadStoreOverrides } from "@/lib/store/resolve-store-data";
import { getStoreOverridesKey } from "@/lib/store/storage-keys";

function getDisplayName(storeId: StoreId): string {
  const base = getStoreConfig(storeId);
  const overrides = loadStoreOverrides(storeId);
  return overrides?.meta?.displayName?.trim() || base.name;
}

function subscribe(storeId: StoreId, onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === getStoreOverridesKey(storeId) || e.key === null) {
      onStoreChange();
    }
  };
  const onCustom = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener("store-overrides-updated", onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("store-overrides-updated", onCustom);
  };
}

export function useDisplayStoreConfig(storeId: StoreId): StoreConfig & {
  displayName: string;
} {
  const config = getStoreConfig(storeId);

  const displayName = useSyncExternalStore(
    (onStoreChange) => subscribe(storeId, onStoreChange),
    () => getDisplayName(storeId),
    () => config.name
  );

  return {
    ...config,
    name: displayName,
    displayName,
  };
}

export function notifyStoreOverridesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("store-overrides-updated"));
  }
}
