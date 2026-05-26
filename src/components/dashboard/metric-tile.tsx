import { cn } from "@/lib/utils";

interface MetricTileProps {
  label: string;
  value: string;
  variant?: "default" | "amazon";
}

export function MetricTile({ label, value, variant = "default" }: MetricTileProps) {
  const isAmazon = variant === "amazon";

  return (
    <div className="min-w-0">
      <p className="mb-0.5 text-[12px] text-[#565959]">{label}</p>
      <p
        className={cn(
          "text-[20px] leading-tight tracking-tight text-[#111111]",
          isAmazon ? "font-semibold" : "font-normal"
        )}
      >
        {value}
      </p>
    </div>
  );
}
