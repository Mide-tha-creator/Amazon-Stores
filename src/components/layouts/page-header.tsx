"use client";

import { Bell, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  learnMoreHref?: string;
  onRefresh?: () => void;
  showActions?: boolean;
  variant?: "default" | "amazon";
}

export function PageHeader({
  title,
  learnMoreHref = "#",
  onRefresh,
  showActions = true,
  variant = "amazon",
}: PageHeaderProps) {
  const isAmazon = variant === "amazon";

  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-[#d5d9d9] px-4 py-3 md:px-5",
        isAmazon ? "bg-white" : "mb-4 border-border bg-card md:px-6"
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <h1
          className={cn(
            "font-bold leading-tight text-[#111111]",
            isAmazon ? "text-[24px]" : "text-2xl md:text-[28px]"
          )}
        >
          {title}
        </h1>
        <a
          href={learnMoreHref}
          className="text-[12px] text-[#007185] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Learn more
        </a>
      </div>
      {showActions && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              isAmazon &&
                "h-[30px] rounded-sm border-[#007185] bg-white px-3 text-[12px] font-normal text-[#007185] hover:bg-[#e7f4f5]"
            )}
            onClick={() => onRefresh?.()}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Refresh
          </Button>
          <Button
            size="sm"
            className={cn(
              isAmazon &&
                "h-[30px] rounded-sm bg-[#008296] px-3 text-[12px] font-bold hover:bg-[#006b7a]"
            )}
          >
            <Download className="mr-1 h-3 w-3" />
            Download
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              isAmazon && "h-[30px] w-[30px] rounded-sm border-[#007185] text-[#007185]"
            )}
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
