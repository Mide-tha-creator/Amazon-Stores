"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStorePath } from "@/config/stores/registry";
import { useStore } from "@/lib/store/store-context";
import { useSidebar } from "@/hooks/use-sidebar";

const NAV_LINKS = [
  { label: "Manage All Inventory", href: "#" },
  { label: "Campaign Manager", href: "#" },
  { label: "Manage Orders", href: "#" },
  { label: "Manage Stores", href: "#" },
  { label: "Business Reports", key: "reports" as const, href: "#" },
  { label: "Account Health", href: "#" },
  { label: "Performance Notifications", href: "#" },
  { label: "Feedback Manager", href: "#" },
  { label: "Voice of the Customer", href: "#" },
];

export function AmazonSecondaryNav() {
  const pathname = usePathname();
  const { storeId } = useStore();
  const { setMobileOpen } = useSidebar();

  const isReportsRoute =
    pathname.includes("/dashboard/") || pathname.includes("/reports/");

  return (
    <nav className="flex h-8 items-center gap-0 border-b border-white/10 bg-topnav px-2 text-[11px] text-white sm:px-3">
      <Button
        variant="ghost"
        size="icon"
        className="mr-0.5 h-6 w-6 shrink-0 text-white hover:bg-white/10 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-3.5 w-3.5" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto sm:gap-3">
        {NAV_LINKS.map((link) => {
          const active =
            link.key === "reports" ? isReportsRoute : false;
          const href =
            link.key === "reports"
              ? getStorePath(storeId, "/dashboard/sales")
              : link.href;

          return (
            <Link
              key={link.label}
              href={href}
              onClick={(e) => {
                if (link.href === "#") e.preventDefault();
              }}
              className={cn(
                "whitespace-nowrap py-1.5 leading-none hover:text-white/90",
                active && "border-b-2 border-white font-medium"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-1 h-[26px] shrink-0 rounded-sm border-white/40 bg-transparent px-2.5 text-[11px] text-white hover:bg-white/10"
      >
        Edit
      </Button>
    </nav>
  );
}
