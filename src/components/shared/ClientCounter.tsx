"use client";

// Client Component
// ---------------
// `"use client"` makes this file run in the browser.
// That means:
// - You CAN use React hooks like useState/useEffect.
// - You CAN attach event handlers like onClick.
// - You should NOT access server-only secrets (process.env without NEXT_PUBLIC_*, DB, filesystem).
//
// Note: Client Components can be imported into Server Components (pages/layouts),
// but doing so creates a "client boundary" and ships this component's JS to the browser.
//
// In this repo, this counter exists so you can *see* that client state works the same
// on Static, ISR, and Dynamic pages (because it's browser JS).

import { useState } from "react";

type ClientCounterProps = {
  initial?: number;
};

export function ClientCounter({ initial = 0 }: ClientCounterProps) {
  // State is a browser concept here: this value updates without a server render.
  const [count, setCount] = useState<number>(initial);

  return (
    <section className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-3">
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
        ClientCounter (state + event handler)
      </h2>
      <p className="mb-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <strong className="text-black dark:text-zinc-50">Count:</strong> {count}
      </p>
      <button
        type="button"
        // This handler runs in the browser because this is a Client Component.
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-full border border-solid border-black/[.08] bg-white text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:text-white dark:hover:bg-[#1a1a1a] cursor-pointer"
      >
        Increment
      </button>
    </section>
  );
}
