import Image from "next/image";
import Link from "next/link";

/**
 * Home Page (Server Component)
 * ----------------------------
 * This file lives in `src/app/page.tsx`, which means:
 * - It becomes the `/` route.
 * - It runs as a Server Component by default (no `"use client"`).
 *
 * Server Components are great for:
 * - Rendering HTML on the server
 * - Fetching data securely (DB, private env vars, internal services)
 *
 * They are NOT for:
 * - `useState`, `useEffect`, or event handlers like `onClick`
 *   (those require a Client Component).
 */
export default function Home() {
  return (
    // We keep a consistent app shell across pages: centered content + light/dark backgrounds.
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-8 sm:px-16 bg-white dark:bg-black">
        <div className="flex items-center gap-4">
          {/* `next/image` optimizes images (responsive sizing, lazy loading, etc.) */}
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              Next.js Rendering Strategies Demo
            </h1>
            <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              This application demonstrates different rendering strategies in Next.js,
              helping you understand when and how to use static pages, ISR, and dynamic
              rendering.
            </p>
          </div>

          <section className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                What is Next.js?
              </h2>
              <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                {/* `next/link` enables client-side navigation (fast transitions) */}
                <Link
                  href="https://nextjs.org"
                  className="font-medium text-zinc-950 dark:text-zinc-50 underline hover:opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Next.js
                </Link>{" "}
                is a React framework for building full-stack web applications. It provides
                powerful features like server-side rendering, static site generation, and
                API routes, making it easier to build fast, SEO-friendly applications.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                Static Pages (SSG)
              </h2>
              <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Static pages are pre-rendered at <strong>build time</strong> and served as
                static HTML files. They're incredibly fast because the HTML is already
                generated and can be cached by CDNs. Use static pages for content that
                doesn't change frequently, like blog posts, documentation, or marketing
                pages. The content only updates when you rebuild and redeploy the
                application.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                ISR (Incremental Static Regeneration)
              </h2>
              <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                ISR combines the benefits of static pages with the ability to update
                content without rebuilding. Pages are statically generated at build time,
                but can be regenerated in the background after a specified time interval
                (revalidation period) or on-demand via API calls. This is perfect for
                content that changes occasionally but doesn't need to be updated on every
                request, like product listings or news articles.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                Try It Out
              </h2>
              <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Explore the examples below to see how each rendering strategy works in
                practice. Notice the timestamps and how they change (or don't change)
                based on the rendering method.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row mt-4">
            <Link
              href="/static"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              View Static Page
            </Link>
            <Link
              href="/isr"
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              View ISR Page
            </Link>
            <Link
              href="/api-example"
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              API Example
            </Link>
            <Link
              href="/server-actions"
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              Server Actions Demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
