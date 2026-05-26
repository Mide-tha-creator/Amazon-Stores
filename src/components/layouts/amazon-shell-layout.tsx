import { AmazonTopNav } from "@/components/amazon/amazon-top-nav";
import { AmazonSecondaryNav } from "@/components/amazon/amazon-secondary-nav";
import {
  AmazonReportsSidebar,
  AmazonReportsSidebarMobile,
} from "@/components/amazon/amazon-reports-sidebar";
import { AmazonSellerFooter } from "@/components/amazon/amazon-seller-footer";
import { AmazonFeedbackTab } from "@/components/amazon/amazon-feedback-tab";

export function AmazonShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="amazon-font flex min-h-screen flex-col bg-page">
      <AmazonTopNav />
      <AmazonSecondaryNav />
      <div className="flex flex-1">
        <AmazonReportsSidebar />
        <AmazonReportsSidebarMobile />
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <main className="min-w-0 flex-1 overflow-x-hidden bg-page p-2 md:p-3 lg:p-4">
            {children}
          </main>
          <AmazonSellerFooter />
        </div>
      </div>
      <AmazonFeedbackTab />
    </div>
  );
}
