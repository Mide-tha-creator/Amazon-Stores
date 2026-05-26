# Seller Analytics Platform

Multi-store ecommerce seller analytics demo inspired by Amazon Seller Central and Walmart Seller Center. **Mock data only** — simulated for client presentations.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui patterns
- Framer Motion
- Recharts
- Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to pick a store.

## Stores

| Store | Route |
|-------|-------|
| Chokebody Enterprise (Amazon) | `/store/amazon-chokebody/dashboard/sales` |
| Apex Outdoors (Amazon) | `/store/amazon-apex/dashboard/sales` |
| Nova Home (Amazon) | `/store/amazon-nova/dashboard/sales` |
| Walmart Seller Center | `/store/walmart-main/analytics/sales-insights` |
| Second Walmart Store | `/store/walmart-second/analytics/sales-insights` |

## Data editor

Visit [/admin](http://localhost:3000/admin) to edit KPI overrides and JSON data. Changes persist in **localStorage** for the current browser.

## Configuration

- **Store metadata & branding:** `src/config/stores/`
- **Mock datasets:** `src/data/stores/{storeId}/`
- **Override merge:** `src/lib/store/resolve-store-data.ts`

Legacy URLs (`/amazon/...`, `/walmart/...`) redirect to the default store routes.

## Disclaimer

Demonstration environment only. Not affiliated with Amazon or Walmart.
