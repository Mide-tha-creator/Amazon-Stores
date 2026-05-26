"use client";

import { useCallback, useState } from "react";
import { DEFAULT_AMAZON_DATE_RANGE } from "@/lib/constants";
import type {
  DatePreset,
  FulfillmentChannel,
  ReportFilters,
  SalesBreakdown,
} from "@/types/common";

const defaultFilters: ReportFilters = {
  preset: "custom",
  range: { ...DEFAULT_AMAZON_DATE_RANGE },
  fulfillment: "both",
  salesBreakdown: "marketplace_total",
};

export function useReportFilters(initial?: Partial<ReportFilters>) {
  const [draft, setDraft] = useState<ReportFilters>({
    ...defaultFilters,
    ...initial,
  });
  const [applied, setApplied] = useState<ReportFilters>({
    ...defaultFilters,
    ...initial,
  });

  const updateDraft = useCallback((patch: Partial<ReportFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateRange = useCallback((range: ReportFilters["range"]) => {
    setDraft((prev) => ({ ...prev, range, preset: "custom" }));
  }, []);

  const updatePreset = useCallback((preset: DatePreset) => {
    setDraft((prev) => ({ ...prev, preset }));
  }, []);

  const updateFulfillment = useCallback((fulfillment: FulfillmentChannel) => {
    setDraft((prev) => ({ ...prev, fulfillment }));
  }, []);

  const updateSalesBreakdown = useCallback((salesBreakdown: SalesBreakdown) => {
    setDraft((prev) => ({ ...prev, salesBreakdown }));
  }, []);

  const applyFilters = useCallback(() => {
    setApplied({ ...draft });
    return draft;
  }, [draft]);

  return {
    draft,
    applied,
    updateDraft,
    updateRange,
    updatePreset,
    updateFulfillment,
    updateSalesBreakdown,
    applyFilters,
    setApplied,
  };
}
