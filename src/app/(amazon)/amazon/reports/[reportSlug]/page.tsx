import { AmazonReportContent } from "@/components/dashboard/amazon-report-content";

const REPORT_TITLES: Record<string, string> = {
  "sales-traffic": "Sales and Traffic",
  "detail-page-sales": "Detail Page Sales and Traffic",
  "seller-performance": "Seller Performance",
  "detail-page-asin": "Detail Page Sales and Traffic",
  "detail-page-parent": "Detail Page Sales and Traffic By Parent Item",
  "detail-page-child": "Detail Page Sales and Traffic By Child Item",
  "sales-orders-month": "Sales and Orders by Month",
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportSlug: string }>;
}) {
  const { reportSlug } = await params;
  const title = REPORT_TITLES[reportSlug] ?? "Business Report";

  return <AmazonReportContent title={title} showAsinCarousel={false} />;
}
