"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAmazonNavGroups } from "@/components/amazon/nav-config";
import { useStore } from "@/lib/store/store-context";
import { useDisplayStoreConfig } from "@/lib/store/use-display-store-config";
import { useSidebar } from "@/hooks/use-sidebar";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { storeId } = useStore();
  useDisplayStoreConfig(storeId);
  const amazonNavGroups = getAmazonNavGroups(storeId);

  return (
    <nav className="flex flex-col gap-2 py-2 text-[12px]">
      <button
        type="button"
        className="flex items-center gap-1 px-2.5 text-left text-[11px] font-normal uppercase tracking-wide text-[#007185] hover:underline"
        onClick={onNavigate}
      >
        <X className="h-3 w-3" />
        CLOSE REPORTS MENU
      </button>
      {amazonNavGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-0 px-2.5 text-[12px] font-bold text-[#111111]">
            {group.title}
          </p>
          {group.links.length > 0 && (
            <ul>
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className={cn(
                        "block px-2.5 py-1 leading-snug transition-colors",
                        active
                          ? "font-semibold text-[#008296]"
                          : "text-[#007185] hover:underline"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}

export function AmazonReportsSidebar() {
  const { collapsed } = useSidebar();

  if (collapsed) return null;

  return (
    <aside className="hidden w-[200px] shrink-0 border-r border-[#d5d9d9] bg-sidebar lg:block">
      <SidebarNav />
    </aside>
  );
}

export function AmazonReportsSidebarMobile() {
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
      <aside className="fixed inset-y-0 left-0 z-50 w-[260px] overflow-y-auto border-r border-[#d5d9d9] bg-sidebar shadow-xl lg:hidden">
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
