"use client";

// Client Component with an effect (useEffect)
// -----------------------------------------
// `"use client"` makes this file run in the browser.
// That means:
// - You CAN use React hooks like useState/useEffect.
// - You CAN attach event handlers like onClick.
// - You should NOT access server-only secrets (process.env without NEXT_PUBLIC_*, DB, filesystem).
//
// Note: Client Components can be imported into Server Components (pages/layouts),
// but doing so creates a "client boundary" and ships this component's JS to the browser.
//
// Effects run in the browser AFTER the component renders.
// This is how you do timers, subscriptions, and DOM integrations.
//
// This component will update every second even on a static page,
// because it's running on the client.
//
// Beginner mental model:
// - The page HTML can be cached (Static/ISR), but this component still runs JS in the browser.
// - So "browser time" changes even if the server never re-renders the page.

import { useEffect, useState } from "react";

export function ClientClock() {
  // Track if component has mounted to avoid hydration mismatch:
  // the server doesn't know the user's current local time zone/clock.
  const [mounted, setMounted] = useState(false);
  // Initialize state once (function initializer avoids running on every render).
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    setMounted(true);
    // Update the clock once per second.
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-3">
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
        ClientClock (effect)
      </h2>
      <p className="m-0 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <strong className="text-black dark:text-zinc-50">Browser time:</strong>{" "}
        {mounted ? now.toLocaleTimeString() : "--:--:--"}
      </p>
    </section>
  );
}
