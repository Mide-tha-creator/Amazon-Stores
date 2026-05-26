"use client";

import { cn } from "@/lib/utils";

interface AmazonDashboardOverlayProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AmazonDashboardOverlay({
  show,
  children,
  className,
}: AmazonDashboardOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {show && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-white/95"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#d5d9d9] border-t-[#008296]"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}
    </div>
  );
}
