import { format } from "date-fns";

export type AxisGranularity = "year" | "month" | "week" | "day";

const MS_PER_DAY = 86400000;

export function getVisibleSpanDays(startMs: number, endMs: number): number {
  return Math.max(1, (endMs - startMs) / MS_PER_DAY);
}

export function resolveAxisGranularity(spanDays: number): AxisGranularity {
  if (spanDays > 730) return "year";
  if (spanDays > 60) return "month";
  if (spanDays > 14) return "week";
  return "day";
}

export function formatAxisTick(value: number, granularity: AxisGranularity): string {
  const date = new Date(value);
  switch (granularity) {
    case "year":
      return format(date, "yyyy");
    case "month":
      return format(date, "MMM");
    case "week":
      return format(date, "MMM d");
    case "day":
      return format(date, "MMM d");
    default:
      return format(date, "MMM d");
  }
}

export function isoFromMs(ms: number): string {
  return format(new Date(ms), "yyyy-MM-dd");
}
