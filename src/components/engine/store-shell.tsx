"use client";

import { useStoreConfig } from "@/lib/store/store-context";
import { AmazonShellLayout } from "@/components/layouts/amazon-shell-layout";
import { WalmartShellLayout } from "@/components/layouts/walmart-shell-layout";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const config = useStoreConfig();

  if (config.template === "walmart-insights") {
    return <WalmartShellLayout>{children}</WalmartShellLayout>;
  }

  return <AmazonShellLayout>{children}</AmazonShellLayout>;
}
