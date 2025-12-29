// Server Component (default in App Router)
// --------------------------------------
// This file does NOT have `"use client"`, so it runs on the server.
// That means:
// - You can access server-only things (env vars, filesystem, DB, internal services).
// - You CANNOT use React client hooks like useState/useEffect.
// - You CANNOT attach browser event handlers like onClick.
//
// Where does the timestamp come from?
// - If the parent route is STATIC, this is computed at build time.
// - If the parent route uses ISR, it’s computed when the route regenerates.
// - If the parent route is DYNAMIC, it’s computed on each request.
//
// This component is intentionally simple: it just prints a server timestamp so you can
// observe whether the current route is static/ISR/dynamic.

type ServerRenderInfoProps = {
  label: string;
  note?: string;
};

export function ServerRenderInfo({ label, note }: ServerRenderInfoProps) {
  // This line runs on the server. What "server" means depends on your deployment:
  // Node server, serverless function, edge runtime, etc.
  const serverRenderedAtIso = new Date().toISOString();

  return (
    <section className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-3">
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">{label}</h2>
      <p className="mb-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <strong className="text-black dark:text-zinc-50">Server-rendered at:</strong> {serverRenderedAtIso}
      </p>
      {note ? <p className="m-0 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{note}</p> : null}
    </section>
  );
}
