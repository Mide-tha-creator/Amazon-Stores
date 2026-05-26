"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmazonDateRangePicker } from "@/components/amazon/amazon-date-range-picker";
import { cn } from "@/lib/utils";
import type {
  DatePreset,
  FulfillmentChannel,
  ReportFilters,
  SalesBreakdown,
} from "@/types/common";

interface GlobalFilterBarProps {
  filters: ReportFilters;
  onPresetChange: (preset: DatePreset) => void;
  onRangeChange: (range: ReportFilters["range"]) => void;
  onFulfillmentChange: (channel: FulfillmentChannel) => void;
  onSalesBreakdownChange: (breakdown: SalesBreakdown) => void;
  onApply: () => void;
  isPending?: boolean;
  variant?: "default" | "amazon";
}

export function GlobalFilterBar({
  filters,
  onPresetChange,
  onRangeChange,
  onFulfillmentChange,
  onSalesBreakdownChange,
  onApply,
  isPending,
  variant = "amazon",
}: GlobalFilterBarProps) {
  const isAmazon = variant === "amazon";

  if (!isAmazon) {
    return (
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 border-y border-border bg-secondary/80 px-4 py-4 md:px-6">
        <AmazonDateRangePicker
          preset={filters.preset}
          range={filters.range}
          onPresetChange={onPresetChange}
          onRangeChange={onRangeChange}
        />
        <Button onClick={onApply} disabled={isPending}>
          {isPending ? "Applying…" : "Apply"}
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b border-[#d5d9d9] bg-[#eef6f6] px-3 py-3 md:pl-4 md:pr-5">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <AmazonDateRangePicker
          preset={filters.preset}
          range={filters.range}
          onPresetChange={onPresetChange}
          onRangeChange={onRangeChange}
        />

        <div className="space-y-0.5">
          <Label className="text-[11px] font-bold text-[#111111]">
            Sales breakdown
          </Label>
          <Select
            value={filters.salesBreakdown}
            onValueChange={(v) => onSalesBreakdownChange(v as SalesBreakdown)}
          >
            <SelectTrigger className="h-[34px] w-[170px] rounded-sm border-[#d5d9d9] bg-white text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketplace_total">Marketplace total</SelectItem>
              <SelectItem value="fba_only">FBA only</SelectItem>
              <SelectItem value="seller_only">Seller only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-0.5">
          <Label className="text-[11px] font-bold text-[#111111]">
            Fulfillment channel
          </Label>
          <Select
            value={filters.fulfillment}
            onValueChange={(v) => onFulfillmentChange(v as FulfillmentChannel)}
          >
            <SelectTrigger className="h-[34px] w-[210px] rounded-sm border-[#d5d9d9] bg-white text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both (Amazon and seller)</SelectItem>
              <SelectItem value="amazon">Amazon fulfilled</SelectItem>
              <SelectItem value="seller">Seller fulfilled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onApply}
          disabled={isPending}
          className={cn(
            "h-[34px] min-w-[68px] rounded-sm bg-[#008296] px-4 text-[12px] font-bold hover:bg-[#006b7a]"
          )}
        >
          {isPending ? "Applying…" : "Apply"}
        </Button>
      </div>
    </div>
  );
}
