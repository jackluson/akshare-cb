/**
 * Test helpers for extracting fetch call data when using ky.
 * ky calls fetch(Request) instead of fetch(url, init).
 */
import { expect } from "vitest";

/** Get the URL from a mocked fetch call (handles both string and Request arg). */
export function getCallUrl(mockFetch: ReturnType<typeof vi.fn>, callIndex = 0): string {
  const arg = mockFetch.mock.calls[callIndex]?.[0];
  if (arg instanceof Request) return arg.url;
  return String(arg);
}

/** Get headers from a mocked fetch call (handles both Request and init arg). */
export function getCallHeaders(
  mockFetch: ReturnType<typeof vi.fn>,
  callIndex = 0,
): Record<string, string> {
  const arg = mockFetch.mock.calls[callIndex]?.[0];

  if (arg instanceof Request) {
    const headers: Record<string, string> = {};
    arg.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  const init = mockFetch.mock.calls[callIndex]?.[1] as RequestInit | undefined;
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      const headers: Record<string, string> = {};
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
      return headers;
    }
    return init.headers as Record<string, string>;
  }

  return {};
}

/** Get the HTTP method from a mocked fetch call. */
export function getCallMethod(mockFetch: ReturnType<typeof vi.fn>, callIndex = 0): string {
  const arg = mockFetch.mock.calls[callIndex]?.[0];
  if (arg instanceof Request) return arg.method;
  const init = mockFetch.mock.calls[callIndex]?.[1] as RequestInit | undefined;
  return init?.method ?? "GET";
}

/** Assert that a mocked fetch was called and the URL contains the given substring. */
export function expectUrlContains(
  mockFetch: ReturnType<typeof vi.fn>,
  substring: string,
  callIndex = 0,
): void {
  const url = getCallUrl(mockFetch, callIndex);
  expect(url).toContain(substring);
}
