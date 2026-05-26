"use client";

import { formatCurrency } from "@/lib/format-currency";
import { formatTimestamp } from "@/lib/format-date";
import { MetricTile } from "@/components/dashboard/metric-tile";
import { Skeleton } from "@/components/ui/skeleton";
import type { SalesSnapshot } from "@/types/amazon";

interface SalesSnapshotSectionProps {
  snapshot?: SalesSnapshot | null;
  isLoading?: boolean;
}

export function SalesSnapshotSection({
  snapshot,
  isLoading,
}: SalesSnapshotSectionProps) {
  if (isLoading || !snapshot) {
    return (
      <section className="border-b border-[#d5d9d9] bg-white px-3 py-3 md:pl-4 md:pr-5">
        <Skeleton className="mb-3 h-5 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[#d5d9d9] bg-white px-3 py-3 md:pl-4 md:pr-5">
      <div className="flex flex-wrap items-baseline gap-2 border-b border-[#d5d9d9] pb-2">
        <h2 className="text-[16px] font-bold text-[#111111]">Sales Snapshot</h2>
        <p className="text-[11px] text-[#565959]">
          taken at {formatTimestamp(snapshot.generatedAt)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-3 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-8">
        <MetricTile
          label="Total order items"
          value={snapshot.totalOrderItems.toLocaleString()}
          variant="amazon"
        />
        <MetricTile
          label="Units ordered"
          value={snapshot.unitsOrdered.toLocaleString()}
          variant="amazon"
        />
        <MetricTile
          label="Ordered product sales"
          value={formatCurrency(snapshot.orderedProductSales)}
          variant="amazon"
        />
        <MetricTile
          label="Avg. units/order item"
          value={snapshot.avgUnitsPerOrderItem.toFixed(2)}
          variant="amazon"
        />
        <MetricTile
          label="Avg. sales/order item"
          value={formatCurrency(snapshot.avgSalesPerOrderItem)}
          variant="amazon"
        />
      </div>
    </section>
  );
}
