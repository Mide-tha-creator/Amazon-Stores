"use client";

import { useState } from "react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDisplayDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { DatePreset, DateRange } from "@/types/common";

import "react-day-picker/style.css";

interface AmazonDateRangePickerProps {
  preset: DatePreset;
  range: DateRange;
  onPresetChange: (preset: DatePreset) => void;
  onRangeChange: (range: DateRange) => void;
}

type ActiveField = "start" | "end" | null;

function toIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function AmazonDateRangePicker({
  preset,
  range,
  onPresetChange,
  onRangeChange,
}: AmazonDateRangePickerProps) {
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [openField, setOpenField] = useState<ActiveField>(null);

  const startDate = parseISO(range.start);
  const endDate = parseISO(range.end);

  const handleSelect = (date: Date | undefined) => {
    if (!date || !openField) return;
    const iso = toIso(date);
    if (openField === "start") {
      const nextStart = iso;
      const nextEnd =
        isAfter(date, endDate) || format(endDate, "yyyy-MM-dd") === iso
          ? iso
          : range.end;
      onRangeChange({ start: nextStart, end: nextEnd });
      onPresetChange("custom");
      setOpenField("end");
      setActiveField("end");
    } else {
      const nextEnd = isBefore(date, startDate) ? range.start : iso;
      onRangeChange({ start: range.start, end: nextEnd });
      onPresetChange("custom");
      setOpenField(null);
      setActiveField(null);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="space-y-0.5">
        <Label className="text-[11px] font-bold text-[#111111]">Date</Label>
        <Select
          value={preset}
          onValueChange={(v) => onPresetChange(v as DatePreset)}
        >
          <SelectTrigger className="h-[34px] w-[96px] rounded-sm border-[#d5d9d9] bg-white text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="ytd">Year to date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        {(["start", "end"] as const).map((field) => {
          const isActive = activeField === field || openField === field;
          const display =
            field === "start"
              ? formatDisplayDate(range.start)
              : formatDisplayDate(range.end);
          const selected = field === "start" ? startDate : endDate;

          return (
            <Popover
              key={field}
              open={openField === field}
              onOpenChange={(open) => {
                setOpenField(open ? field : null);
                if (open) setActiveField(field);
                else if (activeField === field) setActiveField(null);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative flex h-[34px] w-[112px] items-center rounded-sm border bg-white pl-7 pr-2 text-left text-[12px] text-[#111111]",
                    isActive
                      ? "border-[#008296] ring-1 ring-[#008296]"
                      : "border-[#d5d9d9] hover:border-[#008296]"
                  )}
                  onFocus={() => setActiveField(field)}
                >
                  <Calendar className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#565959]" />
                  <span className="truncate">{display}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto border-[#d5d9d9] p-0"
                align="start"
                sideOffset={4}
              >
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  defaultMonth={selected}
                  classNames={{
                    root: "p-3 amazon-day-picker",
                    month_caption:
                      "flex justify-center pb-2 text-[13px] font-semibold text-[#111111]",
                    nav: "flex items-center justify-between absolute inset-x-3 top-3",
                    button_previous:
                      "h-7 w-7 rounded text-[#565959] hover:bg-[#f3f5f6]",
                    button_next:
                      "h-7 w-7 rounded text-[#565959] hover:bg-[#f3f5f6]",
                    weekday:
                      "w-9 text-center text-[11px] font-normal text-[#565959]",
                    day: "h-9 w-9 p-0 text-center text-[13px]",
                    day_button:
                      "h-9 w-9 rounded-none font-normal hover:bg-[#e7f4f5]",
                    selected:
                      "[&>button]:bg-[#008296] [&>button]:text-white [&>button]:hover:bg-[#008296]",
                    today: "[&>button]:font-bold",
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
