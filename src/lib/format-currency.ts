export function formatCurrency(
  value: number,
  options?: { compact?: boolean; minimumFractionDigits?: number }
): string {
  const { compact = false, minimumFractionDigits = 2 } = options ?? {};
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
}
