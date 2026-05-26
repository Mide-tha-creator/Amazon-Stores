import { getStorePath } from "@/config/stores/registry";
import type { StoreId } from "@/config/stores/types";

export interface NavLink {
  label: string;
  href: string;
  slug?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export function getAmazonNavGroups(storeId: StoreId): NavGroup[] {
  return [
    {
      title: "Dashboards",
      links: [
        {
          label: "Sales Dashboard",
          href: getStorePath(storeId, "/dashboard/sales"),
          slug: "sales-dashboard",
        },
      ],
    },
    {
      title: "Business Reports",
      links: [],
    },
    {
      title: "By Date",
      links: [
        {
          label: "Sales and Traffic",
          href: getStorePath(storeId, "/reports/sales-traffic"),
          slug: "sales-traffic",
        },
        {
          label: "Detail Page Sales and Traffic",
          href: getStorePath(storeId, "/reports/detail-page-sales"),
          slug: "detail-page-sales",
        },
        {
          label: "Seller Performance",
          href: getStorePath(storeId, "/reports/seller-performance"),
          slug: "seller-performance",
        },
      ],
    },
    {
      title: "By ASIN",
      links: [
        {
          label: "Detail Page Sales and Traffic",
          href: getStorePath(storeId, "/reports/detail-page-asin"),
          slug: "detail-page-asin",
        },
        {
          label: "Detail Page Sales and Traffic By Parent Item",
          href: getStorePath(storeId, "/reports/detail-page-parent"),
          slug: "detail-page-parent",
        },
        {
          label: "Detail Page Sales and Traffic By Child Item",
          href: getStorePath(storeId, "/reports/detail-page-child"),
          slug: "detail-page-child",
        },
      ],
    },
    {
      title: "Other",
      links: [
        {
          label: "Sales and Orders by Month",
          href: getStorePath(storeId, "/reports/sales-orders-month"),
          slug: "sales-orders-month",
        },
      ],
    },
  ];
}
