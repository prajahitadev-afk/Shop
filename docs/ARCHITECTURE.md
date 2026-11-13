# Architecture notes

## Overview

A single-page React app talking directly to Supabase from the browser. There is no custom backend.

```
Browser (React SPA)
  pages -> context/hooks -> services -> Supabase (Postgres + Auth)
```

- **State:** `AuthContext` holds the signed-in user and customer record. `CartContext` holds cart and wishlist, mirrors the cart to `carts`/`cart_items` when signed in.
- **Data access:** all queries live in `src/services/`. Pages never call Supabase directly, with a few exceptions (see Debt).
- **Routing:** a hand-rolled `Page` union plus `pushState` in `App.tsx`.

## Decisions

### ADR-1: Client-only architecture on Supabase
**Status:** accepted. Fast to build and cheap to host. **Consequence:** every rule that matters for money or access must be enforced by Postgres (Row Level Security, constraints, functions), because the browser is not trusted.

### ADR-2: Per-page metadata through a hook (`usePageMeta`)
**Status:** accepted. Keeps titles, canonical URLs and JSON-LD next to the page that owns them. **Consequence:** metadata is set after JavaScript runs. Google renders JS, but other crawlers and link-preview bots (WhatsApp, Slack) only see the static tags in `index.html`. If social sharing of product links matters, add prerendering or move to a framework with server rendering.

### ADR-3: No router library (for now)
**Status:** under review. Works for ten routes. Costs: duplicated `Page` type in several files, no route params typing, manual focus and scroll handling. Moving to React Router would remove these.

## Open risks (highest first)

1. **Prices, totals and coupons are computed in the browser.** Coupon codes are hard-coded in `src/pages/Cart.tsx`, and orders and payments are inserted from the client. A user can alter a total or write a `Paid` payment row. Move order creation, coupon validation and price calculation into a Postgres function or Supabase Edge Function, and make `payments` writable only by it.
2. **Row Level Security must be verified.** The anon key ships in the bundle. Confirm RLS on every table listed in the README, especially `customers`, `customer_addresses`, `orders`, `order_items`, `payments`.
3. **No real payment gateway.** `paymentService.ts` only records a row.
4. **Local fallback when Supabase is not configured** silently "succeeds" at saving orders and payments. Fine for development, dangerous in production. Fail loudly in production builds.

## Debt

- `Page` type is copied into App, Navbar, Shop, ProductDetail. Export it from one module.
- `Cart.tsx` (about 870 lines) holds the cart, checkout, address form and confirmation. Split it.
- `About` and `Blog` pages exist but are commented out of routing and navigation.
- Navbar "Shop" dropdown entries (Best Sellers, New Arrivals, Gift Sets) all go to `/shop` without filtering.
- Several image `alt=""` and low-contrast `text-[10px]` labels remain across Home, Shop and ProductCard. A full WCAG pass with a screen reader has not been done.
