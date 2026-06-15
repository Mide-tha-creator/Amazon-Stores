import { getFullHistoryDashboardDateRange } from "@/lib/store/rolling-dashboard-range";

/** @deprecated Prefer store config defaultDateRange at runtime on the client. */
export const DEFAULT_AMAZON_DATE_RANGE = getFullHistoryDashboardDateRange("2024-05-16");

export const MOCK_API_DELAY_MS = 450;

export const AMAZON_STORE_NAME = "Chokebody Enterprise";
