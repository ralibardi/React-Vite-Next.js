import { type NextRequest, NextResponse } from "next/server";

/**
 * API Proxy Route
 * --------------
 * This is an optional Next.js API route that acts as a proxy to your .NET 10 API.
 *
 * Why use a proxy?
 * - Hide your actual API URL from the client
 * - Add server-side authentication/authorization
 * - Transform requests/responses
 * - Add rate limiting or caching
 * - Keep API keys secret (use server-only env vars)
 *
 * Usage:
 * - Call this route from your Client Component: `/api/proxy?endpoint=/your-endpoint`
 * - Or use it directly: POST /api/proxy with body containing the endpoint and data
 */
export const dynamic = "force-dynamic";

/**
 * GET handler - proxies GET requests to .NET 10 API
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing 'endpoint' query parameter" },
        { status: 400 },
      );
    }

    // Get your .NET 10 API base URL from server-only env var (not NEXT_PUBLIC_*)
    const apiBaseUrl = process.env.DOTNET_API_URL || "https://api.example.com";

    // Construct full URL
    const apiUrl = `${apiBaseUrl}${endpoint}`;

    // Forward the request to .NET 10 API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        // Forward any custom headers if needed
        // "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

/**
 * POST handler - proxies POST requests to .NET 10 API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, data } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing 'endpoint' in request body" },
        { status: 400 },
      );
    }

    // Get your .NET 10 API base URL from server-only env var
    const apiBaseUrl = process.env.DOTNET_API_URL || "https://api.example.com";

    // Construct full URL
    const apiUrl = `${apiBaseUrl}${endpoint}`;

    // Forward the request to .NET 10 API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        // Add authentication headers here if needed
        // "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const responseData = await response.json();

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
