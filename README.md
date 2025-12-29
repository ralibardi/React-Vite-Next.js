This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ISR + On-demand Revalidation (Demo)

This repo includes:
- `/static`: forced static page
- `/isr`: ISR page (revalidation time set in `src/app/isr/page.tsx`, defaults to 60 seconds)
- `/api/revalidate`: on-demand revalidation endpoint
- `/api-example`: example page demonstrating .NET 10 API calls from Client Components
- `/api/proxy`: optional Next.js API route that proxies requests to your .NET 10 API

### Quick Next.js mental model (App Router)

In the `src/app` (App Router) world:
- Pages are **Server Components by default** (they run on the server, not in the browser).
- Next.js aggressively **caches** and **reuses** results for performance.
- Whether a route is **static** or **dynamic** depends on what you do in that route:
  - **Static** (SSG): pre-rendered at build time, then served as a file-like response.
  - **ISR**: like static, but can regenerate after a time window or via on-demand invalidation.
  - **Dynamic (SSR)**: rendered on every request (or whenever you opt-out of caching).

The code in this repo demonstrates the three most common knobs:
- `export const dynamic = "force-static"`: force a route to be static (`/static`)
- `export const revalidate = <seconds>`: enable ISR with a configurable time window (`/isr`, defaults to 60s via `ISR_REVALIDATE_SECONDS`)
- `revalidatePath("/isr")`: invalidate cached output so the next request regenerates it (`/api/revalidate`)

### Important ISR gotcha: `next dev` vs production

To learn ISR correctly, test with:

```bash
pnpm build
pnpm start
```

`next dev` is optimized for fast iteration and does not always reflect production caching/regeneration behavior.

### Setup

Create `.env.local` in the project root:

```bash
REVALIDATE_SECRET=some-long-random-string
ISR_REVALIDATE_SECONDS=60
```

Environment variables:
- `REVALIDATE_SECRET`: Secret for the `/api/revalidate` endpoint (required for on-demand revalidation)

Note: The ISR revalidation time is set directly in `src/app/isr/page.tsx` as `export const revalidate = 60`. Next.js 16 requires route segment config to be statically analyzable, so environment variables cannot be used directly. Change the value in the file to customize.

Tips:
- Do **not** commit `.env.local`.
- Use `NEXT_PUBLIC_*` env vars only for values that are safe to expose to the browser.
- To customize ISR revalidation time, edit `src/app/isr/page.tsx` and change the `revalidate` value

### Test ISR (use production mode)

ISR works as expected in production mode:

```bash
pnpm build
pnpm start
```

Then:
- Visit `http://localhost:3000/static` and refresh a few times (should not change in production).
- Visit `http://localhost:3000/isr`, note the timestamp, wait for the revalidation interval (default 60 seconds), refresh (timestamp should update).

### Trigger regeneration on-demand

From PowerShell, prefer `curl.exe` to avoid the `curl` alias:

```bash
curl.exe "http://localhost:3000/api/revalidate?path=/isr&secret=YOUR_SECRET"
```

Then refresh `http://localhost:3000/isr` and the timestamp should update immediately.

Best-practice tip: avoid secrets in URLs. This endpoint also accepts a header:

```bash
curl.exe -H "x-revalidate-secret: YOUR_SECRET" "http://localhost:3000/api/revalidate?path=/isr"
```

Optional (POST + JSON body) variant:

```bash
curl.exe -X POST -H "content-type: application/json" -H "x-revalidate-secret: YOUR_SECRET" -d "{ \"path\": \"/isr\" }" "http://localhost:3000/api/revalidate"
```

### Notes, tips, and common pitfalls

- **Static vs ISR vs “dynamic”**:
  - `/static` is forced static via `dynamic = "force-static"`.
  - `/isr` is static-but-regenerating via `revalidate = 10`.
  - `/api/revalidate` is dynamic (it must execute per request).
- **ISR is not “update instantly” by default**: it updates *after* the revalidate window *or* when you call `revalidatePath(...)`.
- **Data fetching + caching**:
  - If you use `fetch(...)` in Server Components, Next.js may cache responses.
  - For fine-grained control, Next.js supports per-fetch revalidation (e.g. `fetch(url, { next: { revalidate: 10 } })`) and tag-based invalidation (`revalidateTag(...)`).
- **Why a timestamp works as a demo**: the timestamp is generated on the server when the route is rendered. If you see it change, you know regeneration happened.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
