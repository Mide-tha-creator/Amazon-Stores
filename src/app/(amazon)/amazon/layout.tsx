import type { Metadata } from "next";
import { AMAZON_TAB_TITLE } from "@/lib/metadata/store-tab-title";

export const metadata: Metadata = { title: AMAZON_TAB_TITLE };

export default function AmazonLegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
