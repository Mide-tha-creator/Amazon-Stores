"use client";

import { GlobalFilterBar } from "@/components/dashboard/global-filter-bar";
import { SalesSnapshotSection } from "@/components/dashboard/sales-snapshot-section";
import { CompareSalesSection } from "@/components/dashboard/compare-sales-section";
import { BusinessInsightsPanel } from "@/components/dashboard/business-insights-panel";
import { AsinPerformanceSection } from "@/components/dashboard/asin-performance-section";
import { PageHeader } from "@/components/layouts/page-header";
import { ReportPageLayout } from "@/components/layouts/report-page-layout";
import { AmazonDashboardOverlay } from "@/components/amazon/amazon-dashboard-overlay";
import type { StoreDashboardUi } from "@/config/stores/types";
import type { ReportFilters } from "@/types/common";
import type { SalesDashboardResponse } from "@/types/amazon";

interface AmazonDashboardViewProps {
  title: string;
  storeId?: string;
  data: SalesDashboardResponse | null;
  draftFilters: ReportFilters;
  isLoading: boolean;
  isPending: boolean;
  showAsinCarousel?: boolean;
  dashboardUi?: StoreDashboardUi;
  onPresetChange: (preset: ReportFilters["preset"]) => void;
  onRangeChange: (range: ReportFilters["range"]) => void;
  onFulfillmentChange: (channel: ReportFilters["fulfillment"]) => void;
  onSalesBreakdownChange: (channel: ReportFilters["salesBreakdown"]) => void;
  onApply: () => void;
  onRefresh: () => void;
}

export function AmazonDashboardView({
  title,
  storeId,
  data,
  draftFilters,
  isLoading,
  isPending,
  showAsinCarousel = false,
  dashboardUi,
  onPresetChange,
  onRangeChange,
  onFulfillmentChange,
  onSalesBreakdownChange,
  onApply,
  onRefresh,
}: AmazonDashboardViewProps) {
  const showOverlay = isPending || isLoading;

  return (
    <ReportPageLayout>
      <AmazonDashboardOverlay show={showOverlay}>
        <PageHeader title={title} onRefresh={onRefresh} />
        {showAsinCarousel && data && (
          <AsinPerformanceSection
            alerts={data.asinAlerts}
            title={dashboardUi?.asinTitle}
            comparisonLabel={dashboardUi?.asinComparisonLabel}
            defaultAsinCategory={dashboardUi?.defaultAsinCategory}
            layout={dashboardUi?.asinLayout ?? "carousel"}
          />
        )}
        <GlobalFilterBar
          filters={draftFilters}
          onPresetChange={onPresetChange}
          onRangeChange={onRangeChange}
          onFulfillmentChange={onFulfillmentChange}
          onSalesBreakdownChange={onSalesBreakdownChange}
          onApply={onApply}
          isPending={isPending}
        />
        <SalesSnapshotSection snapshot={data?.snapshot} isLoading={isLoading} />
        <CompareSalesSection
          timeSeries={data?.timeSeries}
          aggregate={data?.aggregate}
          isLoading={isLoading}
          unitsYDomain={
            storeId === "amazon-chokebody"
              ? [0, 500]
              : storeId === "amazon-apex"
                ? [0, 4000]
                : storeId === "amazon-nova"
                  ? [0, 400]
                  : undefined
          }
          salesYDomain={
            storeId === "amazon-chokebody"
              ? [0, 15000]
              : storeId === "amazon-apex"
                ? [0, 80000]
                : storeId === "amazon-nova"
                  ? [0, 10000]
                  : undefined
          }
        />
        <BusinessInsightsPanel insights={data?.insights} isLoading={isLoading} />
      </AmazonDashboardOverlay>
    </ReportPageLayout>
  );
}
