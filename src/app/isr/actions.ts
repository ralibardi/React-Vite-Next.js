"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Action: revalidate the ISR page
 * -------------------------------------
 * This runs on the server (never in the browser).
 *
 * Why this exists:
 * - Available for programmatic use (internal services, webhooks, etc.)
 * - With Azure Key Vault + env injection, secrets stay server-side.
 *
 * NOTE: This is not exposed to users in the UI. For automatic revalidation,
 * use the `/api/revalidate` endpoint instead (it has secret validation).
 *
 * If you need user-facing revalidation in the future:
 * - Add auth/role checks here before calling `revalidatePath`.
 */
export async function revalidateIsrAction() {
  revalidatePath("/isr");
  return { ok: true as const, now: new Date().toISOString() };
}


