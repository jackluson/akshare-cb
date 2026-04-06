import { NetworkError } from "../errors.js";

export interface RequestOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  timeout?: number;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  randomDelayRange?: [number, number];
}

const DEFAULT_RETRY: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1.0,
  randomDelayRange: [0.5, 1.5],
};

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

function buildUrl(baseUrl: string, params?: Record<string, string>): string {
  if (!params) return baseUrl;
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a URL with retry and exponential backoff.
 * Returns the Response object on success.
 */
export async function requestWithRetry(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<Response> {
  const { maxRetries, baseDelay, randomDelayRange } = {
    ...DEFAULT_RETRY,
    ...retryOptions,
  };
  const { method = "GET", headers = {}, params, body, timeout = 15_000 } = options;

  const fullUrl = buildUrl(url, params);
  const allHeaders = { ...DEFAULT_HEADERS, ...headers };

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = baseDelay * 2 ** attempt + randomInRange(...randomDelayRange);
      await sleep(delay * 1000);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: allHeaders,
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 429) {
        lastError = new NetworkError("Rate limited", 429);
        continue;
      }

      if (!response.ok) {
        // Only retry server errors (5xx); client errors (4xx) are permanent
        if (response.status >= 500) {
          lastError = new NetworkError(`HTTP ${response.status}`, response.status);
          continue;
        }
        throw new NetworkError(`HTTP ${response.status}`, response.status);
      }

      return response;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof DOMException && err.name === "AbortError") {
        lastError = new NetworkError(`Request timeout after ${timeout}ms`);
      } else {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }
  }

  throw lastError ?? new NetworkError("Request failed after retries");
}

/**
 * Fetch JSON with retry.
 */
export async function fetchJson<T = unknown>(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<T> {
  const response = await requestWithRetry(url, options, retryOptions);
  return response.json() as Promise<T>;
}

/**
 * Fetch text with retry.
 */
export async function fetchText(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<string> {
  const response = await requestWithRetry(url, options, retryOptions);
  return response.text();
}
