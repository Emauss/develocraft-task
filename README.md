# Product Browser

A single-page app that displays a list of products from the [DummyJSON](https://dummyjson.com) API. The list is **searchable, filterable, sortable, and paginated — entirely server-side**, with **the URL as the single source of truth** for all list state. Every filter, sort, page, and search term lives in the query string, so links are shareable, browser back/forward steps through your history, and a refresh restores exactly what you were looking at.

**Live demo:** _[https://develocraft-task.vercel.app]_

---

## Features

- 🔎 **Debounced server-side search** (`/products/search`) — 350 ms debounce, superseded requests aborted.
- 🗂️ **Category filter** (`/products/category/:slug`) and **sorting** by title / price / rating, ascending or descending.
- 📄 **Server-side pagination** with windowed page controls (`1 … 5 6 7 … 17`) and a **page-size selector** (12/24/36/48).
- 🔗 **URL-driven state** — `/?q=phone&sortBy=price&order=desc&limit=24&page=2` fully reconstructs the view.
- ♿ **Accessible** — semantic landmarks, labelled controls, `aria-current` on the active page, polite result-count announcements, keyboard-operable throughout.
- 🧩 **Four UI states everywhere** — loading skeleton, error (with retry), empty (with clear-filters), and success.

---

## Tech stack

| Concern      | Choice                                            |
| ------------ | ------------------------------------------------- |
| Build tool   | Vite 8                                            |
| UI           | React 19 + TypeScript (`strict`)                  |
| Server state | TanStack Query v5                                 |
| Routing      | React Router v8 (library mode, `useSearchParams`) |
| Validation   | Zod v4 (API responses **and** URL params)         |
| Styling      | SCSS Modules (no UI framework)                    |
| Testing      | Vitest + React Testing Library                    |
| Tooling      | ESLint 10 (flat config) + Prettier                |
| Deploy       | Vercel (SPA)                                      |

---

## Getting started

### Prerequisites

- Node.js 20+ and npm.

### Install

```bash
npm install
```

### Environment

The API base URL comes from an environment variable, never hardcoded. Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

```dotenv
# .env
VITE_API_URL=https://dummyjson.com
```

### Scripts

```bash
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check (tsc -b) and build for production → dist/
npm run preview    # serve the production build locally
npm run test       # run the test suite once
npm run test:watch # run tests in watch mode
npm run lint       # ESLint
npm run format     # Prettier (write)
```

Before every commit: `npm run lint && npm run test` must pass.

---

## Architecture

```
src/
  api/
    client.ts                 # typed fetch wrapper: baseUrl from env, errors, AbortSignal, Zod validation
    products/
      dto.ts                  # Zod schemas + inferred DTO types (the API contract)
      endpoints.ts            # getProducts / searchProducts / getProductsByCategory / getCategories
  features/products/
    hooks/                    # one folder per hook (hook + test + index barrel)
      useProductListParams/   # parse/serialize URL <-> typed params (pure, testable)
      useProducts/            # TanStack Query hook; picks the endpoint from params
      useCategories/
      useDebouncedValue/
    components/               # one folder per component (Component.tsx + .module.scss + index.ts)
      ProductList/ ProductCard/ ProductListSkeleton/
      SearchInput/ CategoryFilter/ SortControls/ Pagination/
      ErrorState/ EmptyState/
  pages/ProductsPage/
  styles/                    # index.scss + _variables.scss + _mixins.scss (shared via sass loadPaths)
  App.tsx  main.tsx  router.tsx
```

**Conventions**

- Components never call `fetch` and never know the API shape — they consume hooks.
- Every API response is validated with Zod at the boundary; a contract mismatch throws a descriptive error rather than corrupting the UI.
- Query keys include **all** request params; `placeholderData: keepPreviousData` keeps the current page visible while the next loads; the query's `signal` is passed to `fetch` for race-safe cancellation.
- Imports use the `@/*` alias (`→ src/*`) for anything outside the current folder; no `../` climbing.
- Arrow functions throughout; no `any`, no unjustified non-null assertions.

---

## Decisions & rationale

**Why Vite over Next.js.** The task is a client-side, interactive product browser with no SSR/SEO requirement and no server of our own — the data comes from a third-party API consumed straight from the browser. Next.js would add a server runtime, its data-fetching conventions, and framework weight to solve problems this app doesn't have. Vite gives a fast dev loop and a small static SPA bundle that deploys anywhere. (If SEO-indexable product pages or server-side data aggregation were requirements, that calculus would flip toward Next.)

**Why the URL is the single source of truth.** List state (search, category, sort, page) is exactly the kind of state that should be linkable, survive a refresh, and work with back/forward. Keeping it in the URL — parsed through one Zod schema — means there is no second copy of the truth in `useState` to drift out of sync. A shared link like `/?category=laptops&sortBy=price&order=desc` reproduces the view for anyone. The only local state is the search box's typing buffer, which exists solely to debounce writes to the URL.

**Why TanStack Query.** Server state is not UI state: it needs caching, deduplication, background refetching, and request cancellation. TanStack Query gives all of that for free. `keepPreviousData` makes pagination feel instant (the old page dims instead of flashing to a skeleton), query keys drive automatic caching per parameter combination, and the injected `AbortSignal` cancels superseded requests — critical while typing in the search box.

**Why Zod at the boundary.** We don't own the backend, so the contract can't be trusted at runtime. Each response is parsed by a Zod schema in `dto.ts`; a mismatch throws immediately with a readable message instead of surfacing as a confusing `undefined` three components deep. The same discipline validates URL params: garbage like `?page=abc&sortBy=hack` falls back to defaults via `.catch()` rather than crashing. Types are inferred from the schemas, so the runtime contract and the TypeScript types can never disagree.

**Why server-side pagination / search / sort.** The dataset lives behind the API and can be large; shipping the whole catalogue to filter it in the browser wastes bandwidth and memory and doesn't scale. DummyJSON exposes `limit`/`skip`, `q`, `sortBy`/`order`, and category endpoints, so we let the server do the work and only request the fields we render (via `select`), keeping payloads small.

**The search-vs-category limitation.** DummyJSON cannot combine a search query with a category filter in a single request — `/products/search` and `/products/category/:slug` are distinct endpoints with no shared parameter. The chosen trade-off: **search and category are mutually exclusive in the UI** — setting one clears the other, and that change is reflected in the URL. This keeps a single, honest source of truth and never shows results that silently ignore one of the two inputs.

_Alternatives considered:_ (1) **client-side intersection** — fetch a category then filter by the query in memory: breaks server-side pagination (totals and page counts become wrong) and only searches the current page; (2) **disable one control while the other is active** — communicates the constraint but is more restrictive and adds modal-feeling UI state; (3) **pick a different API** that supports combined filtering — the cleanest fix, but the task rewards demonstrating good practice against a real backend's constraints, so we document and design around it instead. Mutual exclusivity was the least surprising option that keeps every render truthful.

---

## Testing

Run with `npm run test`. Coverage focuses on the logic most worth protecting:

- **URL params** (`useProductListParams`) — parsing, defaults, invalid values falling back, page-reset behaviour, and omitting defaults from the URL (round-trip parse ↔ serialize).
- **Endpoint selection** (`fetchProducts`) — `q` → search, `category` → category, neither → plain list; `skip` derivation and `AbortSignal` forwarding.
- **`Pagination`** — windowed pages, `aria-current`, disabled prev/next at the edges, change handler.
- **`ProductsPage`** with a mocked API — skeleton → data, empty state on zero results, error → retry → recovery.

---

## Deployment (Vercel)

Built as a static SPA. `vercel.json` rewrites all routes to `/index.html` so deep links with query params resolve after deploy. Build command `npm run build`, output directory `dist`.

---

## What I'd improve with more time

- **MSW** (Mock Service Worker) to mock the API at the network layer in tests, instead of mocking the endpoints module — tests would exercise the real `client.ts` + Zod validation path.
- **End-to-end tests with Playwright** — cover the real URL/back-forward/refresh flows in a browser, which unit tests can only approximate.
- **List virtualization** (e.g. TanStack Virtual) for very large result sets, if page sizes grew.
- **Optimistic prefetching** of the next page on hover/idle so pagination feels instantaneous.
- **i18n** — the copy is currently English-only; strings would move into a message catalogue.
- **A shared toolbar layout for small screens** and a bit more visual polish — the task deliberately prioritised architecture over styling.
