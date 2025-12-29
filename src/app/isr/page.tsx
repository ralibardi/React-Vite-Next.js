import Image from "next/image";
import Link from "next/link";
import { ClientClock } from "@/components/shared/ClientClock";
import { ClientCounter } from "@/components/shared/ClientCounter";
import { ComponentBoundaryNotes } from "@/components/shared/ComponentBoundaryNotes";
import { ServerRenderInfo } from "@/components/shared/ServerRenderInfo";

/**
 * ISR Page (Incremental Static Regeneration)
 * -----------------------------------------
 * Setting `export const revalidate = <seconds>` means:
 * - Next.js will cache this route's HTML output.
 * - After the specified seconds, the *next* request will trigger regeneration (usually in the background).
 *
 * Customization options:
 * - Hardcoded: `export const revalidate = 60` (60 seconds)
 * - Environment variable: `export const revalidate = Number(process.env.ISR_REVALIDATE_SECONDS) || 60`
 * - Common values:
 *   - 60 = 1 minute (good for frequently changing content)
 *   - 3600 = 1 hour (good for moderately changing content)
 *   - 86400 = 24 hours (good for daily updates)
 *   - false = no revalidation (static until next build)
 *
 * Important (common confusion):
 * - In `next dev`, caching/ISR behavior can feel different.
 * - To observe "real" ISR, test with `next build && next start`.
 */
// ISR revalidation time in seconds
// Note: Next.js 16 requires route segment config exports to be statically analyzable
// (no function calls or operations on env vars). Change this value directly to customize.
// Common values: 60 (1 min), 3600 (1 hour), 86400 (24 hours)
export const revalidate = 60;

export default function IsrPage() {
  /**
   * Server timestamp (proof of regeneration)
   * ---------------------------------------
   * This page is a Server Component, so this line runs on the server.
   * With ISR, it updates when the route regenerates:
   * - after the revalidate window (10 seconds), or
   * - after automatic revalidation is triggered via `/api/revalidate` (webhooks/scheduled jobs).
   */
  const generatedAtIso = new Date().toISOString();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-8 sm:px-16 bg-white dark:bg-black">
        <div className="flex items-center gap-4">
          {/* Click logo to go back home */}
          <Link href="/">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              ISR Page (Incremental Static Regeneration)
            </h1>
            <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              This page uses ISR (
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm">
                revalidate = {revalidate}
              </code>{" "}
              seconds). In production, the value below updates after the
              interval, or immediately after automatic revalidation is triggered
              (webhooks, scheduled jobs, etc.).
            </p>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              <strong className="text-black dark:text-zinc-50">
                Generated at:
              </strong>{" "}
              {generatedAtIso}
            </p>
            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-500 italic">
              Note: Revalidation happens automatically via webhooks/scheduled
              jobs. The{" "}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                /api/revalidate
              </code>{" "}
              endpoint is available for programmatic triggers (not exposed to
              users).
            </p>
          </div>

          {/* Shared component examples (mix of Server + Client components) */}
          <div className="flex flex-col gap-4 mt-4">
            <ComponentBoundaryNotes />
            <ServerRenderInfo
              label="ServerRenderInfo (server component)"
              note="On an ISR page, this timestamp changes when the route regenerates."
            />
            {/* These are Client Components, so they update in the browser without regenerating the page. */}
            <ClientClock />
            <ClientCounter initial={0} />
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row mt-4">
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              Back to Home
            </Link>
            <Link
              href="/static"
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              View Static Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
