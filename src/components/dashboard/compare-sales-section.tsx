"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle } from "@/components/dashboard/view-toggle";
import { AmazonCompareCharts } from "@/components/charts/amazon-compare-charts";
import { AnalyticsSummaryTable } from "@/components/tables/analytics-summary-table";
import { formatCurrency } from "@/lib/format-currency";
import type {
  CompareSalesAggregate,
  CompareViewMode,
  SalesTimeSeriesPoint,
} from "@/types/amazon";

interface CompareSalesSectionProps {
  timeSeries?: SalesTimeSeriesPoint[];
  aggregate?: CompareSalesAggregate | null;
  isLoading?: boolean;
  unitsYDomain?: [number, number];
  salesYDomain?: [number, number];
}

export function CompareSalesSection({
  timeSeries = [],
  aggregate,
  isLoading,
  unitsYDomain,
  salesYDomain,
}: CompareSalesSectionProps) {
  const [view, setView] = useState<CompareViewMode>("graph");
  const [legendChecked, setLegendChecked] = useState(true);

  return (
    <section className="border-b border-[#d5d9d9] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#e7f4f5] px-4 py-2.5 md:px-5">
        <h2 className="text-[15px] font-bold text-[#007185]">Compare Sales</h2>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <div className="px-4 py-3 md:px-5">
        {isLoading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : view === "graph" ? (
          <AmazonCompareCharts
            data={timeSeries}
            unitsYDomain={unitsYDomain}
            salesYDomain={salesYDomain}
          />
        ) : (
          aggregate && <AnalyticsSummaryTable aggregate={aggregate} />
        )}
      </div>

      {aggregate && !isLoading && (
        <div className="flex flex-wrap items-start gap-5 bg-[#e7f4f5] px-4 py-3 text-[12px] md:px-5">
          <div>
            <p className="font-bold text-[#111111]">Compare</p>
            <button type="button" className="text-[#007185] hover:underline">
              What&apos;s this
            </button>
          </div>
          <label className="flex cursor-pointer items-start gap-2">
            <Checkbox
              checked={legendChecked}
              onCheckedChange={(c) => setLegendChecked(c === true)}
              className="mt-0.5 border-[#008296] data-[state=checked]:bg-[#008296] data-[state=checked]:text-white"
            />
            <span className="text-[#007185]">Selected date range</span>
          </label>
          {legendChecked && (
            <div className="text-[#111111]">
              <p className="font-bold">
                {aggregate.unitsOrdered.toLocaleString()} Units
              </p>
              <p className="font-bold">
                {formatCurrency(aggregate.orderedProductSales)}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
