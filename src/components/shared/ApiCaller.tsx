"use client";

// Client Component - API Caller
// -----------------------------
// This component demonstrates calling a .NET 10 API from a Next.js client component.
//
// Why Client Component?
// - Needs to handle onClick events (user interaction)
// - Needs useState for loading/error states
// - Makes API calls from the browser
//
// Best Practices:
// - Use environment variables (NEXT_PUBLIC_*) for API URLs that are safe to expose
// - Consider using Next.js API routes as a proxy for sensitive operations
// - Handle loading and error states properly

import { useState } from "react";

type ApiResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp?: string;
};

type ApiCallerProps = {
  /**
   * API endpoint URL
   * Use NEXT_PUBLIC_API_URL environment variable or provide directly
   */
  apiUrl?: string;
  /**
   * HTTP method (default: GET)
   */
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /**
   * Request body for POST/PUT requests
   */
  body?: Record<string, unknown>;
  /**
   * Additional headers
   */
  headers?: Record<string, string>;
};

export function ApiCaller({
  apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/data",
  method = "GET",
  body,
  headers = {},
}: ApiCallerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    // Reset previous state
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      // Add body for POST/PUT requests
      if ((method === "POST" || method === "PUT") && body) {
        requestOptions.body = JSON.stringify(body);
      }

      // Make the API call
      const res = await fetch(apiUrl, requestOptions);

      // Check if response is ok
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Parse response
      const data = await res.json();

      // Set successful response
      setResponse({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      // Handle errors
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setResponse({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
      <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
        API Caller (Client Component)
      </h2>
      <p className="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        This component calls a .NET 10 API when clicked. It must be a Client
        Component because it handles user interactions (onClick) and uses React
        hooks (useState).
      </p>

      <div className="mb-3">
        <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-500">
          <strong>Endpoint:</strong> {apiUrl}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          <strong>Method:</strong> {method}
        </p>
      </div>

      <button
        type="button"
        onClick={handleApiCall}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium rounded-full border border-solid border-black/[.08] bg-white text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:text-white dark:hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Calling API..." : "Call .NET 10 API"}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>⏳ Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            ❌ Error: {error}
          </p>
        </div>
      )}

      {/* Success Response */}
      {response?.success && (
        <div className="mt-3 p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            ✅ Success!
          </p>
          <pre className="text-xs overflow-auto p-2 bg-white dark:bg-black rounded border border-zinc-200 dark:border-zinc-700">
            {JSON.stringify(response.data, null, 2)}
          </pre>
          {response.timestamp && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Response time: {new Date(response.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Failed Response */}
      {response && !response.success && (
        <div className="mt-3 p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ Request completed with errors
          </p>
        </div>
      )}
    </section>
  );
}
