export type ChartPoint = { date: string; value: number };

function toMs(date: string): number {
  return new Date(date).getTime();
}

/** Largest-Triangle-Three-Buckets style downsampling for line/area charts */
export function downsampleSeries(
  points: ChartPoint[],
  targetCount: number
): ChartPoint[] {
  if (points.length <= targetCount || targetCount < 3) return points;

  const sorted = [...points].sort((a, b) => toMs(a.date) - toMs(b.date));
  const bucketSize = (sorted.length - 2) / (targetCount - 2);
  const sampled: ChartPoint[] = [sorted[0]];

  for (let i = 0; i < targetCount - 2; i++) {
    const start = Math.floor((i + 0) * bucketSize) + 1;
    const end = Math.floor((i + 1) * bucketSize) + 1;
    const nextEnd = Math.floor((i + 2) * bucketSize) + 1;

    let maxArea = -1;
    let maxIdx = start;
    const avgX =
      sorted
        .slice(start, end)
        .reduce((s, p) => s + toMs(p.date), 0) / Math.max(1, end - start);
    const avgY =
      sorted.slice(start, end).reduce((s, p) => s + p.value, 0) /
      Math.max(1, end - start);

    const anchorA = sorted[Math.min(sorted.length - 1, nextEnd)];

    for (let j = start; j < end; j++) {
      const p = sorted[j];
      const area = Math.abs(
        (toMs(p.date) - avgX) * (anchorA.value - p.value) -
          (toMs(anchorA.date) - avgX) * (avgY - p.value)
      );
      if (area > maxArea) {
        maxArea = area;
        maxIdx = j;
      }
    }
    sampled.push(sorted[maxIdx]);
  }

  sampled.push(sorted[sorted.length - 1]);
  return sampled;
}

export function prepareChartPoints(
  points: ChartPoint[],
  maxPoints = 1200
): ChartPoint[] {
  if (points.length <= maxPoints) return points;
  return downsampleSeries(points, maxPoints);
}
