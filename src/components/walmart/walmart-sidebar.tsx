"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getWalmartNavItems,
  WALMART_UNLOCK_ITEM,
} from "@/components/walmart/walmart-nav-config";
import { useStore } from "@/lib/store/store-context";
import { useSidebar } from "@/hooks/use-sidebar";

function NavContent({
  onNavigate,
  iconOnly = false,
}: {
  onNavigate?: () => void;
  iconOnly?: boolean;
}) {
  const pathname = usePathname();
  const { storeId } = useStore();
  const navItems = getWalmartNavItems(storeId);
  const insightsBase = navItems.find((i) => i.label === "Analytics")?.href ?? "";

  const isInsightsRoute =
    pathname.startsWith(insightsBase) ||
    pathname.includes("/analytics/sales-insights") ||
    pathname.includes("/analytics/search-insights");

  return (
    <nav
      className={cn(
        "flex h-full flex-col",
        iconOnly ? "items-center py-2" : "py-3 text-[13px]"
      )}
    >
      <ul
        className={cn(
          "flex flex-1 flex-col",
          iconOnly ? "w-full items-center gap-1 px-0" : "space-y-0.5 px-2"
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAnalytics = item.label === "Analytics";
          const sectionActive =
            isAnalytics && isInsightsRoute
              ? true
              : item.href !== "#" && pathname.startsWith(item.href);

          return (
            <li key={item.label} className={iconOnly ? "w-full" : undefined}>
              <Link
                href={item.href === "#" ? insightsBase : item.href}
                onClick={(e) => {
                  if (item.href === "#") e.preventDefault();
                  onNavigate?.();
                }}
                title={iconOnly ? item.label : undefined}
                className={cn(
                  "relative flex transition-colors",
                  iconOnly
                    ? "mx-auto h-9 w-9 items-center justify-center rounded-sm hover:bg-[#f4f7f9]"
                    : "items-center gap-3 rounded-md px-3 py-2",
                  sectionActive
                    ? "text-[#0071ce]"
                    : "text-[#374151] hover:bg-[#f4f7f9]"
                )}
              >
                {sectionActive && (
                  <span
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2",
                      iconOnly
                        ? "left-0.5 h-1.5 w-1.5 rounded-full bg-[#1a73e8]"
                        : "left-0 h-5 w-1 rounded-r bg-[#0071ce]"
                    )}
                    aria-hidden
                  />
                )}
                <Icon
                  className={cn(
                    "shrink-0",
                    iconOnly ? "h-4 w-4" : "h-[18px] w-[18px]"
                  )}
                />
                {!iconOnly && <span>{item.label}</span>}
              </Link>
              {!iconOnly && item.children && (sectionActive || isAnalytics) && (
                <ul className="ml-9 mt-0.5 space-y-0.5 border-l border-[#e5e7eb] pl-3">
                  {item.children.map((child) => {
                    const childActive =
                      pathname === child.href ||
                      (child.label === "Sales Insights" && isInsightsRoute);
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={cn(
                            "block py-1.5",
                            childActive
                              ? "font-semibold text-[#0071ce]"
                              : "text-[#6b7280] hover:text-[#0071ce]"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div
        className={cn(
          "border-t border-[#e5e7eb]",
          iconOnly ? "flex w-full justify-center pt-2" : "px-2 pt-3"
        )}
      >
        <Link
          href={WALMART_UNLOCK_ITEM.href}
          onClick={(e) => e.preventDefault()}
          title={iconOnly ? WALMART_UNLOCK_ITEM.label : undefined}
          className={cn(
            "flex text-[#374151] hover:bg-[#f4f7f9]",
            iconOnly
              ? "h-9 w-9 items-center justify-center rounded-sm"
              : "items-center gap-3 rounded-md px-3 py-2"
          )}
        >
          <WALMART_UNLOCK_ITEM.icon
            className={iconOnly ? "h-4 w-4" : "h-[18px] w-[18px]"}
          />
          {!iconOnly && <span>{WALMART_UNLOCK_ITEM.label}</span>}
        </Link>
      </div>
    </nav>
  );
}

export function WalmartSidebar() {
  const { walmartExpanded } = useSidebar();
  const iconOnly = !walmartExpanded;

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-[#e5e7eb] bg-white transition-[width] duration-200 lg:block",
        iconOnly ? "w-[50px]" : "w-[220px]"
      )}
    >
      <NavContent iconOnly={iconOnly} />
    </aside>
  );
}

export function WalmartSidebarMobile() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  if (!mobileOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        aria-label="Close overlay"
        onClick={() => setMobileOpen(false)}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-[260px] overflow-y-auto border-r border-[#e5e7eb] bg-white shadow-xl lg:hidden">
        <NavContent onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
