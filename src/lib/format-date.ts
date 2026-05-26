import { format, parseISO } from "date-fns";

export function formatDisplayDate(iso: string): string {
  return format(parseISO(iso), "M/d/yyyy");
}

export function formatChartDate(iso: string): string {
  return format(parseISO(iso), "MMM ''yy");
}

export function formatTimestamp(iso: string): string {
  return format(parseISO(iso), "M/d/yyyy, h:mm:ss a 'PDT'");
}

export function formatLongDateRange(start: string, end: string): string {
  return `${format(parseISO(start), "MMM d, yyyy")} - ${format(parseISO(end), "MMM d, yyyy")}`;
}
