import { WalmartTopNav } from "@/components/walmart/walmart-top-nav";
import { WalmartSidebar, WalmartSidebarMobile } from "@/components/walmart/walmart-sidebar";
import { WalmartSideTabs } from "@/components/walmart/walmart-side-tabs";

export function WalmartShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="walmart-font flex min-h-screen flex-col bg-[#f4f7f9]">
      <WalmartTopNav />
      <div className="relative flex flex-1">
        <WalmartSidebar />
        <WalmartSidebarMobile />
        <main className="min-w-0 flex-1 p-3 md:p-4">{children}</main>
        <WalmartSideTabs />
      </div>
    </div>
  );
}
