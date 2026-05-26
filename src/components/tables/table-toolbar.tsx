"use client";

import { Download, Filter, Search, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TableToolbarProps {
  variant?: "default" | "walmart";
}

export function TableToolbar({ variant = "default" }: TableToolbarProps) {
  const isWalmart = variant === "walmart";
  const controlHeight = isWalmart ? "h-[34px]" : "h-9";
  const radius = isWalmart ? "rounded-[16px]" : "rounded-full";
  const textSize = isWalmart ? "text-[12px]" : "text-[13px]";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        isWalmart ? "mb-3 gap-2" : "mb-4 gap-3"
      )}
    >
      <Select defaultValue="item-name">
        <SelectTrigger
          className={cn(
            controlHeight,
            radius,
            "w-[130px] border-[#e5e7eb] bg-white",
            textSize
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item-name">Item name</SelectItem>
          <SelectItem value="sku">SKU</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
        <Input
          placeholder="Search"
          className={cn(
            controlHeight,
            radius,
            "border-[#e5e7eb] bg-white pl-9",
            textSize
          )}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          controlHeight,
          radius,
          "border-[#e5e7eb] font-normal",
          textSize
        )}
      >
        <Star className="mr-1.5 h-3.5 w-3.5" />
        Customer Favorites
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          controlHeight,
          radius,
          "border-[#e5e7eb] font-normal",
          textSize
        )}
      >
        <Filter className="mr-1.5 h-3.5 w-3.5" />
        Filters
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          controlHeight,
          isWalmart ? "w-[34px]" : "w-9",
          radius,
          "border-[#e5e7eb]"
        )}
        aria-label="Settings"
      >
        <Settings className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          controlHeight,
          isWalmart ? "w-[34px]" : "w-9",
          radius,
          "border-[#e5e7eb]"
        )}
        aria-label="Download"
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
