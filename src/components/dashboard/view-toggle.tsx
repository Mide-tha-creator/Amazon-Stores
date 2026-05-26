"use client";

import { cn } from "@/lib/utils";
import type { CompareViewMode } from "@/types/amazon";

interface ViewToggleProps {
  value: CompareViewMode;
  onChange: (mode: CompareViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-sm border border-[#d5d9d9]">
      {(
        [
          { id: "graph" as const, label: "Graph view" },
          { id: "table" as const, label: "Table view" },
        ] as const
      ).map((opt, i) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "h-[30px] px-3 text-[12px] font-normal transition-colors",
            i === 1 && "border-l border-[#d5d9d9]",
            value === opt.id
              ? "bg-[#008296] text-white"
              : "bg-white text-[#111111] hover:bg-[#f3f5f6]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
