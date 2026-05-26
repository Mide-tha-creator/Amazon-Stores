"use client";

import { useState } from "react";
import { ChevronDown, Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BusinessInsight } from "@/types/amazon";

interface BusinessInsightsPanelProps {
  insights?: BusinessInsight | null;
  isLoading?: boolean;
}

export function BusinessInsightsPanel({
  insights,
  isLoading,
}: BusinessInsightsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading || !insights) {
    return (
      <section className="px-4 py-5 md:px-5">
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </section>
    );
  }

  const visibleParagraphs = expanded
    ? insights.paragraphs
    : insights.paragraphs.slice(0, 1);

  return (
    <section className="px-4 py-5 md:px-5">
      <div className="rounded border border-[#d5d9d9] bg-white p-4 shadow-sm md:p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#007185]" />
          <h2 className="text-lg font-bold italic text-[#002f36]">
            Business Performance Insights
          </h2>
        </div>
        <p className="mb-4 text-[11px] italic text-[#565959]">
          This content is generated using AI and is not a substitute for your own
          business expertise. Amazon does not guarantee the accuracy of AI-generated
          data.
        </p>
        <div className="space-y-3 text-[13px] leading-relaxed text-[#111111]">
          {visibleParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {insights.paragraphs.length > 1 && (
          <button
            type="button"
            className="mt-3 flex items-center gap-1 text-[13px] text-[#007185] hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See Less" : "See More"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-[#d5d9d9] pt-4 text-[11px] text-[#565959]">
          <span>Help improve this experience</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded p-1 hover:bg-[#f3f3f3]"
              aria-label="Thumbs up"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded p-1 hover:bg-[#f3f3f3]"
              aria-label="Thumbs down"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded p-1 hover:bg-[#f3f3f3]"
              aria-label="Copy"
              onClick={() => {
                void navigator.clipboard.writeText(insights.paragraphs.join("\n\n"));
              }}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
