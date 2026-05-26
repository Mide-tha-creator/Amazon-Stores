"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface SidebarContextValue {
  /** Amazon: hides the reports sidebar when true */
  collapsed: boolean;
  /** Walmart desktop: full labeled sidebar when true; icon-only rail when false */
  walmartExpanded: boolean;
  mobileOpen: boolean;
  setCollapsed: (v: boolean) => void;
  setWalmartExpanded: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
  toggleCollapsed: () => void;
  toggleWalmartSidebar: () => void;
  isWalmartRoute: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function isWalmartPath(pathname: string): boolean {
  return (
    pathname.startsWith("/walmart") ||
    pathname.includes("/store/walmart-")
  );
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isWalmartRoute = isWalmartPath(pathname);

  const [collapsed, setCollapsed] = useState(false);
  const [walmartExpanded, setWalmartExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedAmazon = localStorage.getItem("sidebar-collapsed");
    if (storedAmazon === "true") setCollapsed(true);

    const storedWalmart = localStorage.getItem("walmart-sidebar-expanded");
    if (storedWalmart === "true") setWalmartExpanded(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const toggleWalmartSidebar = useCallback(() => {
    setWalmartExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("walmart-sidebar-expanded", String(next));
      return next;
    });
  }, []);

  const setWalmartExpandedPersisted = useCallback((v: boolean) => {
    setWalmartExpanded(v);
    localStorage.setItem("walmart-sidebar-expanded", String(v));
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        walmartExpanded,
        mobileOpen,
        setCollapsed,
        setWalmartExpanded: setWalmartExpandedPersisted,
        setMobileOpen,
        toggleCollapsed,
        toggleWalmartSidebar,
        isWalmartRoute,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
