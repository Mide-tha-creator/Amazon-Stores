"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/format-currency";
import { formatDisplayDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { DailySalesRow } from "@/types/walmart";

interface SalesDataTableProps {
  rows: DailySalesRow[];
  variant?: "default" | "walmart";
}

function HeaderWithTooltip({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="flex items-center gap-1 font-semibold text-[#374151]">
      {title}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" aria-label={`About ${title}`}>
            <Info className="h-3.5 w-3.5 text-[#9ca3af]" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{tip}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function SalesDataTable({
  rows,
  variant = "default",
}: SalesDataTableProps) {
  const isWalmart = variant === "walmart";
  const cellPad = isWalmart ? "px-2 py-1.5" : "px-3 py-2.5";
  const bodyCellPad = isWalmart ? "px-2 py-1.5" : "px-3 py-2";
  const textSize = isWalmart ? "text-[12px]" : "text-[13px]";

  return (
    <div className="overflow-x-auto border border-[#e5e7eb] bg-white">
      <table className={cn("w-full border-collapse", textSize)}>
        <thead>
          <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Date
            </th>
            <th className={cn(cellPad, "text-left")}>
              <HeaderWithTooltip title="GMV" tip="Gross Merchandise Value" />
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              GMV % change
            </th>
            <th className={cn(cellPad, "text-left")}>
              <HeaderWithTooltip
                title="GMV - commission"
                tip="GMV after marketplace commission"
              />
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Units Sold
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Orders
            </th>
            <th className={cn(cellPad, "text-left")}>
              <HeaderWithTooltip title="AUR" tip="Average Unit Retail" />
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Auth Sales
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Cancelled Sales
            </th>
            <th
              className={cn(
                cellPad,
                "text-left font-semibold text-[#374151]"
              )}
            >
              Refund sales
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 30).map((row) => (
            <tr
              key={row.date}
              className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]"
            >
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatDisplayDate(row.date)}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.gmv)}
              </td>
              <td
                className={cn(
                  bodyCellPad,
                  row.gmvChangePercent >= 0 ? "text-[#15803d]" : "text-[#b91c1c]"
                )}
              >
                {row.gmvChangePercent.toFixed(2)}%
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.gmvNetCommission)}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {row.unitsSold.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {row.orders.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.aur)}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.authSales)}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.cancelledSales)}
              </td>
              <td className={cn(bodyCellPad, "text-[#111827]")}>
                {formatCurrency(row.refundSales)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
