# Next.js (App Router) — ADHD‑friendly guide for this repo

If you only read one section, read **“The mental model”**.

---

## What this repo is

This project demonstrates **three ways Next.js can render a route**:

- **`/static`**: forced static (SSG)
- **`/isr`**: ISR (static page that regenerates)
- **`/api/revalidate`**: an API route for **automatic revalidation** (webhooks, scheduled jobs, etc.)

Key files:

- **Home**: `src/app/page.tsx`
- **Static**: `src/app/static/page.tsx`
- **ISR**: `src/app/isr/page.tsx`
- **Revalidate API**: `src/app/api/revalidate/route.ts`
- **Shared components**: `src/components/shared/*`

---

## The mental model (copy/paste into your brain)

### 1) App Router defaults to **Server Components**

In `src/app/**`, files are **Server Components by default**.

Server Components:

- Run on the **server**
- Can read **server secrets** (`process.env.REVALIDATE_SECRET`, DB credentials)
- Produce HTML for the browser
- **Cannot** use `useState`, `useEffect`, `onClick`

### 2) Client Components are *opt‑in*

If a file starts with:

```txt
"use client";
```

…then it runs in the **browser**.

Client Components:

- Can use `useState`, `useEffect`, `onClick`
- Cannot safely access server secrets (only `NEXT_PUBLIC_*` env vars are available)
- Ship JavaScript to the browser (more JS = potentially slower)

### 3) Rendering style is about **caching**

Next.js aggressively caches server output for speed.

In this repo, you’ll see:

- **Static (SSG)**: HTML is created at build time and reused.
- **ISR**: HTML is cached, but can regenerate after a time window or on-demand.
- **Dynamic (SSR)**: HTML is generated on each request (or at least not reused the same way).

---

## What is a “static page” (SSG) in plain English?

Static = “**baked**” ahead of time.

- **When it runs**: at **build time**
- **When it changes**: only after **rebuild + redeploy**
- **Why it’s fast**: the server/CDN can reuse the same HTML

In this repo:

- Route: **`/static`**
- File: `src/app/static/page.tsx`
- Key line: `export const dynamic = "force-static"`

Proof on the page:

- It prints a **Build time** timestamp calculated at module load time.

---

## What is ISR?

ISR = static page + “**refresh sometimes**”.

- The route is still **cached**
- After `revalidate` seconds, the next request can trigger regeneration
- You can also trigger regeneration **immediately** (on-demand)

In this repo:

- Route: **`/isr`**
- File: `src/app/isr/page.tsx`
- Key line: `export const revalidate = 10`

Proof on the page:

- It prints a server timestamp (**Generated at**) that changes when regeneration happens.

---

## The one thing that confuses everyone: `next dev` vs production

`next dev` is optimized for fast feedback while coding.

So caching/ISR behavior can feel “off”.

If you want to *learn ISR correctly*, use:

```bash
npm run build
npm run start
```

Then:

- Open `http://localhost:3000/isr`
- Note the timestamp
- Wait > 10 seconds
- Refresh → timestamp should change

---

## “But my ClientClock changes even on /static… why?”

Because it’s a **Client Component**.

Client Components run in the browser, and they:

- Can update every second (`setInterval`)
- Can keep React state (`useState`)
- Do not need the server to re-render the whole page

In this repo, compare:

- **Server timestamp** (changes only when server regenerates)
- **Browser time** (changes every second)

That contrast is the whole teaching point.

---

## Automatic revalidation (webhooks, scheduled jobs)

### How it works

Revalidation happens **automatically** via:

- Webhooks from your CMS (when content changes)
- Scheduled jobs (Azure Functions, cron jobs, etc.)
- Internal services that call the API endpoint

**No user-facing button** — this keeps it secure and simple.

### The API endpoint

- File: `src/app/api/revalidate/route.ts`
- Route: `/api/revalidate?path=/isr`

It does:

1) Validate the path (must look like `/isr`)  
2) Validate a secret (from Azure Key Vault via env injection)  
3) `revalidatePath("/isr")` to invalidate the cache  

### Secrets with Azure Key Vault (Option A)

**Server secret (private, never exposed to browser):**

- Azure Key Vault stores: `REVALIDATE_SECRET`
- Azure injects it into your app's environment variables at deploy time
- Used by: the API route (server only)

**Setup in Azure:**

1. Store `REVALIDATE_SECRET` in Azure Key Vault
2. Configure your App Service/Container App to read from Key Vault
3. Azure automatically injects it as `process.env.REVALIDATE_SECRET`

**Local development:**

- `.env.local`: `REVALIDATE_SECRET=some-long-random-string`
- This matches what you'll store in Key Vault

**Why this is secure:**

- Secret never goes to the browser
- Only server-side code can access it
- Compatible with Azure Key Vault Option A (env injection)

---

## If you want to extend this repo (small, safe next steps)

- **Change the ISR window**: edit `revalidate` in `src/app/isr/page.tsx`
- **Add a “dynamic/SSR” page**:
  - Create `src/app/dynamic/page.tsx`
  - Use `export const dynamic = "force-dynamic"`
  - Print a server timestamp to see it change every request
- **Add a fetch demo**:
  - Fetch data in a Server Component and observe caching
  - Then try `fetch(url, { cache: "no-store" })` and compare behavior

---

## Quick glossary

- **Route**: a URL path like `/isr`
- **Server Component**: runs on server, returns JSX/HTML, no browser hooks
- **Client Component**: runs in browser, can have state/effects/events
- **SSG / Static**: built ahead of time
- **ISR**: cached + regenerates after a window or on-demand
- **Revalidate**: invalidate cached output so the next request regenerates it


