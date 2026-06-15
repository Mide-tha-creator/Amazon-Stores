"use client";

import { AmazonShellLayout } from "@/components/layouts/amazon-shell-layout";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return <AmazonShellLayout>{children}</AmazonShellLayout>;
}
