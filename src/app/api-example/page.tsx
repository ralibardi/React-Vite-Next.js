import Image from "next/image";
import Link from "next/link";
import { ApiCaller } from "@/components/shared/ApiCaller";
import { ComponentBoundaryNotes } from "@/components/shared/ComponentBoundaryNotes";

/**
 * API Example Page
 * ---------------
 * This page demonstrates calling a .NET 10 API from a Next.js Client Component.
 *
 * Key Points:
 * - The page itself is a Server Component (default in App Router)
 * - The ApiCaller component is a Client Component (handles clicks)
 * - API calls are made from the browser (client-side)
 * - Use NEXT_PUBLIC_* env vars for API URLs that are safe to expose
 */
export default function ApiExamplePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-8 sm:px-16 bg-white dark:bg-black">
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
              API Call Example (.NET 10)
            </h1>
            <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              This page demonstrates how to call a .NET 10 API from a Next.js
              Client Component. The component handles user interactions (clicks)
              and makes API calls from the browser.
            </p>
          </div>

          <ComponentBoundaryNotes />

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Example: Direct API Call
            </h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              This example calls a .NET 10 API directly from the browser. Make
              sure to set{" "}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                NEXT_PUBLIC_API_URL
              </code>{" "}
              in your environment variables.
            </p>
            <ApiCaller
              apiUrl={
                process.env.NEXT_PUBLIC_API_URL ||
                "https://jsonplaceholder.typicode.com/posts/1"
              }
              method="GET"
            />
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Example: POST Request
            </h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Example of a POST request with a JSON body:
            </p>
            <ApiCaller
              apiUrl={
                process.env.NEXT_PUBLIC_API_URL ||
                "https://jsonplaceholder.typicode.com/posts"
              }
              method="POST"
              body={{
                title: "Example Post",
                body: "This is a test post from Next.js",
                userId: 1,
              }}
            />
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Example: Using Next.js API Proxy
            </h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
              For better security, you can use a Next.js API route as a proxy.
              This hides your .NET API URL and allows server-side
              authentication. The proxy route is at{" "}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                /api/proxy
              </code>
              .
            </p>
            <ApiCaller apiUrl="/api/proxy?endpoint=/data" method="GET" />
          </div>

          <div className="flex flex-col gap-4 mt-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
              Setup Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-black dark:text-zinc-50 mb-2">
                  Option 1: Direct API Call (Client-side)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  <li>
                    Create a{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      .env.local
                    </code>{" "}
                    file in your project root
                  </li>
                  <li>
                    Add your .NET 10 API URL:{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      NEXT_PUBLIC_API_URL=https://your-api.com/api
                    </code>
                  </li>
                  <li>
                    <strong>Important:</strong> Only use{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      NEXT_PUBLIC_*
                    </code>{" "}
                    for values safe to expose to the browser
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-black dark:text-zinc-50 mb-2">
                  Option 2: API Proxy (Server-side, Recommended)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  <li>
                    Add to{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      .env.local
                    </code>
                    :{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      DOTNET_API_URL=https://your-api.com/api
                    </code>
                  </li>
                  <li>
                    Use the proxy route from your Client Component:{" "}
                    <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                      /api/proxy?endpoint=/your-endpoint
                    </code>
                  </li>
                  <li>
                    <strong>Benefit:</strong> API URL and keys stay server-side
                    (not exposed to browser)
                  </li>
                </ol>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Restart your dev server after changing environment variables.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row mt-4">
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto sm:px-6 whitespace-nowrap"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
