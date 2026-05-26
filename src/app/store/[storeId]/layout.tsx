import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STORE_IDS, isValidStoreId } from "@/config/stores/registry";
import { StoreProvider } from "@/lib/store/store-context";
import { StoreShell } from "@/components/engine/store-shell";
import type { StoreId } from "@/config/stores/types";
import { getStoreConfig } from "@/config/stores/registry";
import { getStoreTabTitle } from "@/lib/metadata/store-tab-title";

export function generateStaticParams() {
  return STORE_IDS.map((storeId) => ({ storeId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}): Promise<Metadata> {
  const { storeId } = await params;
  if (!isValidStoreId(storeId)) {
    return { title: "Seller Center" };
  }

  const config = getStoreConfig(storeId);
  return { title: getStoreTabTitle(config.marketplace) };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  if (!isValidStoreId(storeId)) {
    notFound();
  }

  return (
    <StoreProvider storeId={storeId as StoreId}>
      <StoreShell>{children}</StoreShell>
    </StoreProvider>
  );
}
