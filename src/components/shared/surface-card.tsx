import { cn } from "@/lib/utils";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function SurfaceCard({
  children,
  className,
  noPadding = false,
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card",
        !noPadding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
