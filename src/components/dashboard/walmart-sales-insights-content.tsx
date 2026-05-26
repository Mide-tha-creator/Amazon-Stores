"use client";

import Link from "next/link";
import { WalmartAccountSalesReport } from "@/components/walmart/walmart-account-sales-report";
import { DEFAULT_WALMART_DATE_RANGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "account", label: "ACCOUNT SALES REPORT", href: "/walmart/analytics/sales-insights" },
  { id: "item", label: "ITEM SALES REPORT", href: "/walmart/analytics/sales-insights/item" },
  { id: "department", label: "SALES BY DEPARTMENT", href: "/walmart/analytics/sales-insights/department" },
] as const;

interface WalmartSalesInsightsContentProps {
  activeTab: "account" | "item" | "department";
}

export function WalmartSalesInsightsContent({
  activeTab,
}: WalmartSalesInsightsContentProps) {
  return (
    <div className="mx-auto w-full max-w-none">
      <h1 className="mb-2 text-[20px] font-bold leading-tight text-[#111827]">
        Sales Insights
      </h1>

      <div className="mb-4 flex gap-4 border-b border-[#e5e7eb]">
        {TABS.map((tab) => (
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
          storeId="walmart-main"
          defaultDateRange={DEFAULT_WALMART_DATE_RANGE}
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
