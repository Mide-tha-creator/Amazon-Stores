import { redirect } from "next/navigation";
import { getStoreConfig, isValidStoreId } from "@/config/stores/registry";

export default async function StoreIndexPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  if (!isValidStoreId(storeId)) {
    redirect("/");
  }
  redirect(getStoreConfig(storeId).routes.home);
}
