import { getStorePath } from "@/config/stores/registry";
import type { StoreId } from "@/config/stores/types";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  Lock,
  Megaphone,
  DollarSign,
  ShoppingCart,
  Tag,
  TrendingUp,
  Truck,
} from "lucide-react";

export interface WalmartNavChild {
  label: string;
  href: string;
}

export interface WalmartNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: WalmartNavChild[];
}

export function getWalmartNavItems(storeId: StoreId): WalmartNavItem[] {
  const insightsBase = getStorePath(storeId, "/analytics/sales-insights");

  return [
    { label: "Home", href: "#", icon: Home },
    { label: "Catalog", href: "#", icon: Tag },
    { label: "Pricing", href: "#", icon: DollarSign },
    { label: "Orders", href: "#", icon: ShoppingCart },
    { label: "WFS", href: "#", icon: Truck },
    { label: "Payments", href: "#", icon: CreditCard },
    { label: "Performance", href: "#", icon: TrendingUp },
    {
      label: "Analytics",
      href: insightsBase,
      icon: BarChart3,
      children: [
        { label: "Sales Insights", href: insightsBase },
        {
          label: "Search Insights",
          href: getStorePath(storeId, "/analytics/search-insights"),
        },
      ],
    },
    { label: "Growth", href: "#", icon: TrendingUp },
    { label: "Advertising", href: "#", icon: Megaphone },
    { label: "Reports", href: "#", icon: FileText },
    { label: "Apps", href: "#", icon: LayoutGrid },
  ];
}

export const WALMART_UNLOCK_ITEM = { label: "Unlock", href: "#", icon: Lock };
