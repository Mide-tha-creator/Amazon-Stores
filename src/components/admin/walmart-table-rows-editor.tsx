"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeTableRowDate } from "@/lib/store/walmart-table-rows";
import type { DailySalesRow } from "@/types/walmart";

const VISIBLE_ROW_LIMIT = 50;

interface WalmartTableRowsEditorProps {
  rows: DailySalesRow[];
  onChange: (rows: DailySalesRow[]) => void;
}

export function WalmartTableRowsEditor({
  rows,
  onChange,
}: WalmartTableRowsEditorProps) {
  const visibleRows = rows.slice(0, VISIBLE_ROW_LIMIT);

  const updateRow = (index: number, patch: Partial<DailySalesRow>) => {
    const next = [...rows];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Edit daily table rows (newest first). Dates use the calendar control and are
        saved as YYYY-MM-DD. Showing the first {VISIBLE_ROW_LIMIT} of {rows.length}{" "}
        rows; saving merges edits into the full dataset.
      </p>
      <div className="max-h-[520px] overflow-auto rounded-md border border-[#e5e7eb]">
        <table className="w-full min-w-[960px] border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-[#f9fafb]">
            <tr className="border-b border-[#e5e7eb]">
              {[
                "Date",
                "GMV",
                "Units",
                "Orders",
                "AUR",
                "Auth sales",
                "Cancelled",
                "Refund",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-2 py-2 text-left font-semibold text-[#374151]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr
                key={`${index}-${row.date}`}
                className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]"
              >
                <td className="px-2 py-1.5">
                  <Input
                    type="date"
                    className="h-8 w-[148px] text-[12px]"
                    value={normalizeTableRowDate(row.date)}
                    onChange={(e) =>
                      updateRow(index, { date: e.target.value })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[100px] text-[12px]"
                    value={row.gmv}
                    onChange={(e) =>
                      updateRow(index, { gmv: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[88px] text-[12px]"
                    value={row.unitsSold}
                    onChange={(e) =>
                      updateRow(index, {
                        unitsSold: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[88px] text-[12px]"
                    value={row.orders}
                    onChange={(e) =>
                      updateRow(index, { orders: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[88px] text-[12px]"
                    value={row.aur}
                    onChange={(e) =>
                      updateRow(index, { aur: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[100px] text-[12px]"
                    value={row.authSales}
                    onChange={(e) =>
                      updateRow(index, {
                        authSales: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[100px] text-[12px]"
                    value={row.cancelledSales}
                    onChange={(e) =>
                      updateRow(index, {
                        cancelledSales: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 w-[100px] text-[12px]"
                    value={row.refundSales}
                    onChange={(e) =>
                      updateRow(index, {
                        refundSales: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > VISIBLE_ROW_LIMIT ? (
        <Label className="text-[11px] font-normal text-muted-foreground">
          Rows {VISIBLE_ROW_LIMIT + 1}–{rows.length} are unchanged unless edited via
          the JSON tab.
        </Label>
      ) : null}
    </div>
  );
}
