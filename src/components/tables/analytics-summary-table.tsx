import { formatCurrency } from "@/lib/format-currency";
import type { CompareSalesAggregate } from "@/types/amazon";

interface AnalyticsSummaryTableProps {
  aggregate: CompareSalesAggregate;
}

export function AnalyticsSummaryTable({ aggregate }: AnalyticsSummaryTableProps) {
  const headers = [
    "Total order items",
    "Units ordered",
    "Ordered product sales",
    "Average units/order item",
    "Average sales/order item",
  ];

  return (
    <div className="overflow-x-auto border border-[#d5d9d9]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#e7f4f5]">
            <th className="border-r border-[#d5d9d9] bg-white px-3 py-2 text-left font-semibold text-[#007185]">
              Period
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="border-r border-[#d5d9d9] bg-white px-3 py-2 text-left font-semibold text-[#111111] last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="border-r border-[#d5d9d9] px-3 py-2 font-medium text-[#007185]">
              {aggregate.label}
            </td>
            <td className="border-r border-[#d5d9d9] px-3 py-2 text-[#111111]">
              {aggregate.totalOrderItems.toLocaleString()}
            </td>
            <td className="border-r border-[#d5d9d9] px-3 py-2 text-[#111111]">
              {aggregate.unitsOrdered.toLocaleString()}
            </td>
            <td className="border-r border-[#d5d9d9] px-3 py-2 text-[#111111]">
              {formatCurrency(aggregate.orderedProductSales)}
            </td>
            <td className="border-r border-[#d5d9d9] px-3 py-2 text-[#111111]">
              {aggregate.avgUnitsPerOrderItem.toFixed(2)}
            </td>
            <td className="px-3 py-2 text-[#111111]">
              {formatCurrency(aggregate.avgSalesPerOrderItem)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
