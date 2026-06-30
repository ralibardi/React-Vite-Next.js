import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Automatic Revalidation API Route
 * -------------------------------
 * Route: `/api/revalidate`
 *
 * Why it exists:
 * - ISR pages are cached for performance.
 * - This endpoint allows automatic triggers (webhooks, scheduled jobs, Azure Functions, etc.)
 *   to refresh the cache when content changes.
 *
 * What it does:
 * - Validates a secret (from Azure Key Vault via env injection - Option A).
 * - Calls `revalidatePath(path)` to invalidate cached HTML/data for that path.
 *
 * Usage examples:
 * - Webhook from CMS: POST to `/api/revalidate?path=/isr` with secret header
 * - Azure Function: Call this endpoint when data changes
 * - Scheduled job: Periodically trigger revalidation
 *
 * Safety basics:
 * - This endpoint MUST be dynamic (it runs per request).
 * - We validate the requested path to avoid weird input like `..`.
 * - Secret is server-only (never exposed to browser) - compatible with Azure Key Vault Option A.
 */
export const dynamic = "force-dynamic";

/**
 * Minimal path validation.
 * We only allow absolute paths like `/isr`.
 */
function isSafePath(path: string) {
  if (!path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  return true;
}

/**
 * How we read the secret:
 * - Prefer a header `x-revalidate-secret` (best practice; avoids URL logging).
 * - Also allow `?secret=` for simple local testing.
 */
function getSecretFromRequest(url: URL, req: Request) {
  // Best practice: avoid putting secrets in URLs (they can show up in logs/history).
  // We still support `?secret=` for easy local testing, but also allow a header.
  return (
    url.searchParams.get("secret") ??
    req.headers.get("x-revalidate-secret") ??
    undefined
  );
}

export async function GET(req: Request) {
  /**
   * GET variant (easy to test from the browser / curl)
   * Example:
   * - `/api/revalidate?path=/isr` with `x-revalidate-secret: ...`
   */
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  const secret = getSecretFromRequest(url, req);

  // 1) Validate input
  if (!path || !isSafePath(path)) {
    return NextResponse.json(
      { ok: false, error: "Missing/invalid `path`." },
      { status: 400 },
    );
  }

  // 2) Validate secret (simple auth)
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  /**
   * 3) Invalidate cache for the path
   * Next request to that route will regenerate HTML/data.
   *
   * Tip: Next.js also supports `revalidateTag(...)` for data-driven invalidation.
   */
  revalidatePath(path);
  return NextResponse.json({
    ok: true,
    revalidated: true,
    path,
    now: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  /**
   * POST variant (more "API-like")
   * - Body: `{ "path": "/isr" }`
   * - Secret: header `x-revalidate-secret`
   */
  const url = new URL(req.url);
  const secret = getSecretFromRequest(url, req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const path =
    typeof body === "object" &&
    body &&
    "path" in body &&
    typeof (body as Record<string, unknown>).path === "string"
      ? ((body as Record<string, unknown>).path as string)
      : null;

  // 1) Validate input
  if (!path || !isSafePath(path)) {
    return NextResponse.json(
      { ok: false, error: "Missing/invalid `path`." },
      { status: 400 },
    );
  }

  // 2) Validate secret (simple auth)
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  // 3) Invalidate cache for the path
  revalidatePath(path);
  return NextResponse.json({
    ok: true,
    revalidated: true,
    path,
    now: new Date().toISOString(),
  });
}
