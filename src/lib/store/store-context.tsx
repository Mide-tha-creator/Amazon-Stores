"use client";

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { getStoreConfig } from "@/config/stores/registry";
import type { StoreConfig, StoreId } from "@/config/stores/types";

interface StoreContextValue {
  storeId: StoreId;
  config: StoreConfig;
  brandingStyle: CSSProperties;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function brandingToCssVars(
  branding: StoreConfig["branding"]
): CSSProperties {
  return {
    ["--primary" as string]: branding.primary,
    ["--amazon-action" as string]: branding.primary,
    ["--primary-foreground" as string]: "#ffffff",
    ["--ring" as string]: branding.primary,
    ["--accent" as string]:
      branding.primary === "#0071ce" ? "#e8f1fb" : "#e7f4f5",
    ["--accent-foreground" as string]: branding.primary,
    ["--topnav-bg" as string]: branding.topnavBg ?? "#002f36",
    ["--amazon-topnav-bg" as string]: branding.topnavBg ?? "#002f36",
    ["--amazon-topnav-sub" as string]: "#013a47",
    ["--page-bg" as string]: branding.pageBg ?? "#f3f3f3",
    ["--sidebar-bg" as string]: branding.sidebarBg ?? "#f7f8f8",
    ["--chart-accent" as string]: branding.chartAccent ?? branding.primary,
  };
}

export function StoreProvider({
  storeId,
  children,
}: {
  storeId: StoreId;
  children: ReactNode;
}) {
  const config = getStoreConfig(storeId);
  const value = useMemo(
    () => ({
      storeId,
      config,
      brandingStyle: brandingToCssVars(config.branding),
    }),
    [storeId, config]
  );

  return (
    <StoreContext.Provider value={value}>
      <div
        data-marketplace={config.marketplace}
        data-store={storeId}
        style={value.brandingStyle}
        className="contents"
      >
        {children}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useStoreConfig() {
  return useStore().config;
}
