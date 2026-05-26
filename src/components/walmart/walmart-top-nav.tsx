"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store/store-context";
import { useSidebar } from "@/hooks/use-sidebar";

function BentoMenuIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-grid grid-cols-3 gap-1", className)}
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-[#4b5563]"
        />
      ))}
    </span>
  );
}

export function WalmartTopNav() {
  const { config } = useStore();
  const { setMobileOpen, toggleWalmartSidebar, walmartExpanded } = useSidebar();

  const searchPlaceholder =
    config.topNav?.searchPlaceholder ?? "Try searching for Catalog";
  const messageBadge = config.topNav?.messageBadge;
  const notificationBadge = config.topNav?.notificationBadge ?? 22;

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="flex h-14 items-center gap-3 px-3 lg:px-4">
        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 hover:bg-[#f4f7f9] lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <BentoMenuIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden h-9 w-9 shrink-0 hover:bg-[#f4f7f9] lg:flex",
              walmartExpanded && "bg-[#f4f7f9]"
            )}
            onClick={toggleWalmartSidebar}
            aria-label={
              walmartExpanded ? "Collapse sidebar to icons" : "Expand sidebar"
            }
            aria-pressed={walmartExpanded}
          >
            <BentoMenuIcon />
          </Button>
          <Link
            href={config.routes.home}
            className="text-[19px] font-bold leading-none tracking-tight text-[#0071ce] hover:text-[#004f9a]"
          >
            Seller Center
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2.5 md:gap-3">
          <div className="relative hidden w-[min(380px,42vw)] md:block">
            <Input
              placeholder={searchPlaceholder}
              className="h-9 rounded-md border-[#d1d5db] bg-white pr-9 text-[12px] shadow-none placeholder:text-[#9ca3af]"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-[#374151] hover:bg-[#f4f7f9]"
              aria-label="Messages"
            >
              <Mail className="h-[18px] w-[18px] stroke-[1.5]" />
              {messageBadge != null && messageBadge > 0 ? (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 border-0 bg-[#e02020] px-1 text-[10px] font-normal text-white">
                  {messageBadge}
                </Badge>
              ) : null}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-[#374151] hover:bg-[#f4f7f9]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] stroke-[1.5]" />
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 border-0 bg-[#e02020] px-1 text-[10px] font-normal text-white">
                {notificationBadge}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#374151] hover:bg-[#f4f7f9]"
              aria-label="Help"
            >
              <HelpCircle className="h-[18px] w-[18px] stroke-[1.5]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#374151] hover:bg-[#f4f7f9]"
              aria-label="Settings"
            >
              <Settings className="h-[18px] w-[18px] stroke-[1.5]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 sm:inline-flex"
              aria-label="Apps"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-[#7c3aed] via-[#2563eb] to-[#22d3ee]"
                aria-hidden
              />
            </Button>
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-full border border-[#d1d5db] bg-white pl-0.5 pr-2 hover:bg-[#f9fafb]"
              aria-label="Account menu"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb] text-[#6b7280]">
                <User className="h-4 w-4" />
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6b7280]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
