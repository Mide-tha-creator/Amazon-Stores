import type { ChartPoint } from "@/lib/charts/downsample-series";

const DEFAULT_GMV_MIN = -400;
const DEFAULT_GMV_MAX = 1000;
const MIDMARKET_GMV_MIN = -500;
const MIDMARKET_GMV_MAX = 1500;
const TICK_STEP = 200;

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

function roundDown(value: number, step: number): number {
  return Math.floor(value / step) * step;
}

/** Walmart GMV Y-axis: ~-$400–$1,000 for typical daily GMV; expands for larger ranges */
export function computeWalmartGmvYDomain(
  points: ChartPoint[]
): [number, number] {
  if (!points.length) {
    return [DEFAULT_GMV_MIN, DEFAULT_GMV_MAX];
  }

  const values = points.map((p) => p.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  if (dataMax <= 1600) {
    return [MIDMARKET_GMV_MIN, MIDMARKET_GMV_MAX];
  }

  if (dataMax <= 1200) {
    return [DEFAULT_GMV_MIN, DEFAULT_GMV_MAX];
  }

  const min = roundDown(Math.min(dataMin, 0) - TICK_STEP, TICK_STEP);
  const max = roundUp(dataMax + TICK_STEP, dataMax > 3000 ? 500 : TICK_STEP);

  return [min, max];
}
