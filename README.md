# Prajahita Shop

Storefront for Prajahita, a maker of handmade herbal soaps. Customers browse soaps by skin type and ingredient, save favourites, build a cart and place orders.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Supabase (Postgres + Auth).

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env     # then fill in your Supabase values
npm run dev              # http://localhost:8443
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (port from `PORT`, default 8443) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run format` | Format with oxfmt |

### Environment variables

| Name | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public (anon) key. Safe to expose only when Row Level Security is on for every table. |

Without these the app still runs on built-in fallback products (`productService.ts`) and a browser-stored cart, and nothing is saved to a database.

## Project layout

```
src/
  App.tsx            App shell, URL <-> page state, chat widget
  pages/             One component per screen (Home, Shop, ProductDetail, Cart, ...)
  components/        Navbar, Footer, ProductCard
  context/           AuthContext, CartContext (cart state + sync to Supabase)
  hooks/             Data hooks (useProducts, useOrders, ...)
  services/          Supabase queries, one file per table or domain
  lib/               supabase client, auth helpers, seo helper, uuid
  types/             Shared TypeScript types
  data/              Local fallback data
public/              robots.txt, sitemap.xml
```

Supabase tables used: `products`, `product_skin_types`, `product_ingredients`, `skin_types`, `ingredients`, `testimonials`, `customers`, `customer_addresses`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `notifications`.

## Routes

`/`, `/shop`, `/product/:id`, `/ingredients`, `/contact`, `/cart`, `/checkout`, `/login`, `/signup`, `/orders`. Routing is handled in `src/App.tsx` (no router library). `vercel.json` rewrites every path to `index.html`.

## SEO

- `src/lib/seo.ts` exposes `usePageMeta()`, which sets the title, description, canonical URL, Open Graph tags and optional JSON-LD per page. Product pages emit schema.org `Product` data.
- Cart, checkout and account pages are `noindex`.
- Before launch, replace `https://your-domain.com` in `public/sitemap.xml` and `public/robots.txt`, and swap the placeholder `og:image` in `index.html` for a brand image.

## Accessibility

Navigation uses real links, dialogs have roles and Escape-to-close, form fields have associated labels, and focus moves to the main content on page change. See `docs/ARCHITECTURE.md` for known gaps.

## Deploying

Deployed on Vercel (`vercel.json`). Set the two `VITE_SUPABASE_*` variables in the project settings.

See `docs/ARCHITECTURE.md` for design decisions and open risks.
