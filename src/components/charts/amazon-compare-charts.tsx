"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { EnterpriseTimeSeriesChart } from "@/components/charts/enterprise-time-series-chart";
import type { SalesTimeSeriesPoint } from "@/types/amazon";

const AMAZON_COMPARE_GROUP = "amazon-compare";

interface AmazonCompareChartsProps {
  data: SalesTimeSeriesPoint[];
  unitsYDomain?: [number, number];
  salesYDomain?: [number, number];
}

export function AmazonCompareCharts({
  data,
  unitsYDomain,
  salesYDomain,
}: AmazonCompareChartsProps) {
  const connectedRef = useRef(false);
  const instancesRef = useRef<echarts.ECharts[]>([]);

  useEffect(() => {
    return () => {
      connectedRef.current = false;
      instancesRef.current = [];
    };
  }, []);

  const handleChartReady = (instance: echarts.ECharts) => {
    (instance as echarts.ECharts & { group?: string }).group = AMAZON_COMPARE_GROUP;
    if (!instancesRef.current.includes(instance)) {
      instancesRef.current.push(instance);
    }
    if (instancesRef.current.length >= 2 && !connectedRef.current) {
      echarts.connect(AMAZON_COMPARE_GROUP);
      connectedRef.current = true;
    }
  };

  const unitsData = data.map((d) => ({
    date: d.date,
    value: d.unitsOrdered,
  }));

  const salesData = data.map((d) => ({
    date: d.date,
    value: d.orderedProductSales,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[#d5d9d9]">
      <div className="lg:pr-4">
        <h3 className="mb-2 text-[13px] font-semibold text-[#111111]">
          Units ordered
        </h3>
        <EnterpriseTimeSeriesChart
          data={unitsData}
          variant="amazon-line"
          seriesName="Units ordered"
          height={272}
          yAxisFormat="compact"
          yDomain={unitsYDomain ?? "auto"}
          ySplitNumber={unitsYDomain ? 5 : undefined}
          groupId={AMAZON_COMPARE_GROUP}
          showSlider={false}
          showToolbox={false}
          onChartReady={handleChartReady}
        />
      </div>
      <div className="lg:pl-4">
        <h3 className="mb-2 text-[13px] font-semibold text-[#111111]">
          Ordered product sales
        </h3>
        <EnterpriseTimeSeriesChart
          data={salesData}
          variant="amazon-line"
          seriesName="Ordered product sales"
          height={272}
          yAxisFormat="currency"
          yDomain={salesYDomain ?? "auto"}
          ySplitNumber={salesYDomain ? 3 : undefined}
          groupId={AMAZON_COMPARE_GROUP}
          showSlider={false}
          showToolbox={false}
          onChartReady={handleChartReady}
        />
      </div>
    </div>
  );
}
