"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WalmartAccountSalesReport } from "@/components/walmart/walmart-account-sales-report";
import { getStorePath } from "@/config/stores/registry";
import { useStore } from "@/lib/store/store-context";
import { cn } from "@/lib/utils";

interface WalmartInsightsPageProps {
  activeTab: "account" | "item" | "department";
}

export function WalmartInsightsPage({ activeTab }: WalmartInsightsPageProps) {
  const router = useRouter();
  const { storeId, config } = useStore();

  const tabs = [
    {
      id: "account" as const,
      label: "ACCOUNT SALES REPORT",
      href: getStorePath(storeId, "/analytics/sales-insights"),
    },
    {
      id: "item" as const,
      label: "ITEM SALES REPORT",
      href: getStorePath(storeId, "/analytics/sales-insights/item"),
    },
    {
      id: "department" as const,
      label: "SALES BY DEPARTMENT",
      href: getStorePath(storeId, "/analytics/sales-insights/department"),
    },
  ];

  useEffect(() => {
    if (config.template !== "walmart-insights") {
      router.replace(config.routes.home);
    }
  }, [config.template, config.routes.home, router]);

  if (config.template !== "walmart-insights") {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-none">
      <h1 className="mb-2 text-[20px] font-bold leading-tight text-[#111827]">
        Sales Insights
      </h1>

      <div className="mb-4 flex gap-4 border-b border-[#e5e7eb]">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "pb-2 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-[#1a73e8] text-[#111827]"
                : "text-[#6b7280] hover:text-[#111827]"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "account" && (
        <WalmartAccountSalesReport
          storeId={storeId}
          defaultDateRange={config.defaultDateRange}
        />
      )}

      {activeTab !== "account" && (
        <div className="rounded-[6px] border border-[#e5e7eb] bg-white px-4 py-8 text-center text-[13px] text-[#6b7280]">
          <p>
            {activeTab === "item" ? "Item Sales Report" : "Sales by Department"}{" "}
            is not available for this view.
          </p>
        </div>
      )}
    </div>
  );
}
