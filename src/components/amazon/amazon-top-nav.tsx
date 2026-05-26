"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Globe,
  HelpCircle,
  Mail,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store/store-context";
import { useDisplayStoreConfig } from "@/lib/store/use-display-store-config";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AmazonTopNav() {
  const { storeId } = useStore();
  const displayConfig = useDisplayStoreConfig(storeId);
  const { setMobileOpen } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [favBarHidden, setFavBarHidden] = useState(false);

  const storeLabel =
    displayConfig.displayName.length > 22
      ? `${displayConfig.displayName.slice(0, 20)}…`
      : displayConfig.displayName;

  return (
    <header className="bg-topnav text-white">
      <div className="flex h-12 items-center gap-1.5 px-3 md:gap-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-white hover:bg-white/10"
          onClick={() => (isMobile ? setMobileOpen(true) : undefined)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Link
          href={displayConfig.routes.home}
          className="flex shrink-0 items-center"
        >
          <Image
            src={displayConfig.logo.src}
            alt={displayConfig.logo.alt}
            width={430}
            height={80}
            className="h-[26px] w-auto max-w-[220px] object-contain object-left"
            priority
          />
        </Link>
        <button
          type="button"
          className="hidden h-[34px] min-w-0 items-center gap-1 rounded border border-[#d5d9d9] bg-white px-2.5 text-[11px] md:flex"
        >
          <span className="max-w-[140px] truncate font-bold text-[#002f36]">
            {storeLabel}
          </span>
          <span className="text-[#002f36]">|</span>
          <span className="truncate font-normal text-[#002f36]">
            {displayConfig.regionLabel ?? "United States"}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 text-[#002f36]" />
        </button>
        <div className="mx-2 hidden min-w-0 flex-1 md:flex lg:mx-3">
          <div className="flex w-full max-w-[520px] overflow-hidden rounded">
            <Input
              placeholder="Search"
              className="h-[34px] flex-1 rounded-none border-0 bg-[#0d4a55] text-[12px] italic text-white shadow-none placeholder:text-white/80 focus-visible:ring-0"
            />
            <button
              type="button"
              className="flex h-[34px] w-9 shrink-0 items-center justify-center bg-[#008296] hover:bg-[#006b7a]"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-0.5 text-[11px] md:gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <span className="whitespace-nowrap text-white/90">New Seller Central</span>
            <Switch className="h-3.5 w-7 data-[state=checked]:bg-[#008296]" />
          </div>
          <button
            type="button"
            className="hidden rounded p-1 hover:bg-white/10 lg:inline-flex"
            aria-label="Messages"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="hidden rounded p-1 hover:bg-white/10 lg:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/10"
            aria-label="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-0.5 rounded px-1 text-[11px] hover:bg-white/10 sm:flex"
          >
            <Globe className="h-3.5 w-3.5" />
            EN
            <ChevronDown className="h-3 w-3" />
          </button>
          <Link
            href="/"
            className="hidden items-center gap-1 px-1 text-[11px] hover:underline sm:flex"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Help
          </Link>
        </div>
      </div>
      {!favBarHidden && (
        <div className="hidden items-center justify-between border-t border-white/10 bg-[var(--amazon-topnav-sub,#013a47)] px-4 py-1.5 text-[11px] text-white/80 md:flex">
          <span className="flex items-center gap-1">
            Add your favorite pages here by clicking this icon{" "}
            <Bookmark className="inline h-3.5 w-3.5" /> in the navigation menu.
          </span>
          <button
            type="button"
            className="text-white hover:underline"
            onClick={() => setFavBarHidden(true)}
          >
            Hide
          </button>
        </div>
      )}
    </header>
  );
}
