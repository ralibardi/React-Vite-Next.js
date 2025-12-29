// Server Component (educational notes)
// ------------------------------------
// This component is meant to teach the "Server vs Client" boundary in Next.js App Router.
// It renders as normal server-side JSX, but it also includes examples (commented out)
// of things that are NOT allowed in Server Components.
//
// - If you need clicks/state/effects -> put `"use client"` at the top of the file.
// - Otherwise, keep it server-side (faster, smaller JS bundle).

export function ComponentBoundaryNotes() {
  return (
    <section className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3">
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
        Server vs Client: what goes where?
      </h2>
      <ul className="m-0 list-disc pl-5 space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <li>
          <strong className="text-black dark:text-zinc-50">
            Server Components
          </strong>
          : default in{" "}
          <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            src/app
          </code>
          . Great for fetching data and rendering HTML. No{" "}
          <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            useState
          </code>
          , no{" "}
          <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            useEffect
          </code>
          , no{" "}
          <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            onClick
          </code>
          .
        </li>
        <li>
          <strong className="text-black dark:text-zinc-50">
            Client Components
          </strong>
          : add{" "}
          <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            &quot;use client&quot;
          </code>{" "}
          at the top. Use for interactivity (state, effects, event handlers).
        </li>
        <li>
          <strong className="text-black dark:text-zinc-50">
            Best practice
          </strong>
          : keep pages/layouts server-side, and only "client-ize" the small
          interactive leaf components.
        </li>
      </ul>
    </section>
  );
}

/*
INVALID (Server Component) examples — these will error if uncommented:

import { useEffect, useState } from "react";

export function ServerWithStateOrEffects() {
  const [x, setX] = useState(0); // ❌ useState is client-only
  useEffect(() => {             // ❌ useEffect is client-only
    console.log("runs in browser, not server");
  }, []);
  return <div>{x}</div>;
}

export function ServerWithEventHandlers() {
  return <button onClick={() => alert("hi")}>Click</button>; // ❌ event handlers are client-only
}

Fix: move this code into a `"use client"` file.
*/
