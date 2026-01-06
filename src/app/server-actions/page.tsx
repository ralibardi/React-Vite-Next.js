import Image from "next/image";
import Link from "next/link";
import { ServerActionsDemo } from "./ServerActionsDemo";

/**
 * Server Actions Demo Page
 * ------------------------
 * This page demonstrates Next.js Server Actions for form submissions
 * and POST/PUT/PATCH operations.
 *
 * Server Actions allow you to:
 * - Handle form submissions without API routes
 * - Perform mutations directly from React components
 * - Get type safety and automatic validation
 * - Work with progressive enhancement (no JS required)
 */
export default function ServerActionsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col gap-8 py-16 px-8 sm:px-16 bg-white dark:bg-black">
        <div className="flex items-center gap-4">
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
              Server Actions Demo
            </h1>
            <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Server Actions are Next.js functions that run on the server,
              perfect for form submissions and mutations. They eliminate the
              need for API routes and provide built-in type safety, validation,
              and security.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                What are Server Actions?
              </h2>
              <div className="flex flex-col gap-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                <p>
                  Server Actions are async functions marked with{" "}
                  <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm">
                    "use server"
                  </code>
                  . They run exclusively on the server and can be called
                  directly from Client Components or used with HTML forms.
                </p>
                <p>
                  <strong className="text-black dark:text-zinc-50">
                    Key benefits:
                  </strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>No API routes needed - simpler code structure</li>
                  <li>Type-safe with TypeScript</li>
                  <li>Automatic form handling and validation</li>
                  <li>Progressive enhancement (works without JavaScript)</li>
                  <li>Built-in CSRF protection</li>
                  <li>Direct database access (secrets stay server-side)</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                HTTP Methods Demonstrated
              </h2>
              <div className="flex flex-col gap-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                <div>
                  <strong className="text-black dark:text-zinc-50">
                    POST:
                  </strong>{" "}
                  Create new resources (e.g., creating a new user)
                </div>
                <div>
                  <strong className="text-black dark:text-zinc-50">PUT:</strong>{" "}
                  Full resource updates (replace entire resource with new data)
                </div>
                <div>
                  <strong className="text-black dark:text-zinc-50">
                    PATCH:
                  </strong>{" "}
                  Partial updates (only update the fields you provide)
                </div>
                <div>
                  <strong className="text-black dark:text-zinc-50">
                    DELETE:
                  </strong>{" "}
                  Remove resources (demonstrated in the user list)
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Component */}
          <ServerActionsDemo />

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
