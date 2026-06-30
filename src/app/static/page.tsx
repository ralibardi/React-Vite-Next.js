import Image from "next/image";
import Link from "next/link";
import { ClientClock } from "@/components/shared/ClientClock";
import { ClientCounter } from "@/components/shared/ClientCounter";
import { ComponentBoundaryNotes } from "@/components/shared/ComponentBoundaryNotes";
import { ServerRenderInfo } from "@/components/shared/ServerRenderInfo";

/**
 * Static Page (SSG)
 * -----------------
 * Default in App Router is "static if possible".
 * Here we force it to be static via:
 *   `export const dynamic = "force-static"`
 *
 * Mental model:
 * - In production, Next.js generates HTML ahead of time (build time).
 * - The output is then cached/served like a file.
 * - The HTML does NOT change until you rebuild + redeploy.
 */
export const dynamic = "force-static";

/**
 * Build-time timestamp
 * --------------------
 * This is module-level code. For a forced-static page, it runs at build time.
 * That makes this a helpful "proof" that the page is static.
 */
const BUILD_TIME_ISO = new Date().toISOString();

export default function StaticPage() {
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
              Static Page (SSG)
            </h1>
            <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              This page is forced static. In production it only changes when you
              rebuild and redeploy.
            </p>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              <strong className="text-black dark:text-zinc-50">
                Build time:
              </strong>{" "}
              {BUILD_TIME_ISO}
            </p>
          </div>

          {/* Shared component examples (mix of Server + Client components) */}
          <div className="flex flex-col gap-4 mt-4">
            <ComponentBoundaryNotes />
            <ServerRenderInfo
              label="ServerRenderInfo (server component)"
              note="On a forced-static page, this value is computed at build time (not per refresh)."
            />
            {/* These are Client Components, so they'll still update on the browser even if the page is static. */}
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
              href="/isr"
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              View ISR Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
