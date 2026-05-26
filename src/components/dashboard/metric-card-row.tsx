"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import type { AccountSalesSummary, WalmartMetricKey } from "@/types/walmart";
import { getMetricLabel } from "@/services/store-analytics.service";

interface MetricCardRowProps {
  summary: AccountSalesSummary;
  activeMetric: WalmartMetricKey;
  onSelect: (metric: WalmartMetricKey) => void;
  variant?: "default" | "walmart";
}

function formatMetricValue(key: WalmartMetricKey, summary: AccountSalesSummary): string {
  switch (key) {
    case "gmv":
      return formatCurrency(summary.gmv);
    case "unitsSold":
      return summary.unitsSold.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "orders":
      return summary.orders.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "aur":
      return formatCurrency(summary.aur);
  }
}

const METRICS: WalmartMetricKey[] = ["gmv", "unitsSold", "orders", "aur"];

export function MetricCardRow({
  summary,
  activeMetric,
  onSelect,
  variant = "default",
}: MetricCardRowProps) {
  const isWalmart = variant === "walmart";

  return (
    <div className="grid grid-cols-2 divide-x divide-[#e5e7eb] border border-[#e5e7eb] md:grid-cols-4">
      {METRICS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={cn(
            "relative bg-white text-left transition hover:bg-[#fafafa]",
            isWalmart ? "px-3 py-2.5" : "px-4 py-4",
            activeMetric === key &&
              (isWalmart
                ? "border-t-[3px] border-t-[#a78bc5]"
                : "border-t-[3px] border-t-[#7659b6]")
          )}
        >
          <p
            className={cn(
              "text-[#6b7280]",
              isWalmart ? "text-[11px]" : "text-[12px]"
            )}
          >
            {getMetricLabel(key)}
          </p>
          <p
            className={cn(
              "mt-0.5 font-semibold leading-tight text-[#111827]",
              isWalmart ? "text-[15px]" : "text-[20px] md:text-[22px] font-bold"
            )}
          >
            {formatMetricValue(key, summary)}
          </p>
        </button>
      ))}
    </div>
  );
}
