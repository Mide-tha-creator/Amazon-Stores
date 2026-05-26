import type { Metadata } from "next";
import { WALMART_TAB_TITLE } from "@/lib/metadata/store-tab-title";

export const metadata: Metadata = { title: WALMART_TAB_TITLE };

export default function WalmartLegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
