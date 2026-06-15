import type { EChartsOption, LineSeriesOption } from "echarts";

export const AMAZON_CYAN = "#007185";
export const AMAZON_CHART_FILL = "rgba(0, 113, 133, 0.12)";
const GRID_COLOR = "#e5e7eb";
const MUTED = "#6b7280";

export type ChartVariant = "amazon-line";

export function buildSeriesConfig(
  _variant: ChartVariant,
  name: string
): LineSeriesOption[] {
  return [
    {
      name,
      type: "line",
      smooth: 0.35,
      symbol: "none",
      lineStyle: { width: 1.5, color: AMAZON_CYAN },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: AMAZON_CHART_FILL },
            { offset: 1, color: "rgba(0, 113, 133, 0)" },
          ],
        },
      },
      emphasis: {
        focus: "series",
        lineStyle: { width: 2 },
      },
    },
  ];
}

export function baseGridOption(options?: {
  compactBottom?: boolean;
}): Pick<
  EChartsOption,
  "grid" | "xAxis" | "yAxis" | "tooltip" | "axisPointer"
> {
  return {
    grid: {
      left: 56,
      right: 16,
      top: 24,
      bottom: options?.compactBottom ? 32 : 72,
      containLabel: false,
    },
    xAxis: {
      type: "time",
      axisLine: { lineStyle: { color: GRID_COLOR } },
      axisTick: { show: false },
      axisLabel: {
        color: MUTED,
        fontSize: 10,
        hideOverlap: true,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: MUTED,
        fontSize: 10,
      },
      splitLine: {
        lineStyle: { color: GRID_COLOR, type: "dashed", opacity: 0.35 },
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: { color: GRID_COLOR },
        lineStyle: { color: AMAZON_CYAN, type: "dashed" },
      },
      backgroundColor: "#ffffff",
      borderColor: GRID_COLOR,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: "#111111", fontSize: 12 },
      extraCssText: "box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 4px;",
    },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
    },
  };
}
