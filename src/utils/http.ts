import ky from "ky";
import { getConfig } from "../config.js";
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
}

const DEFAULT_TIMEOUT = 15_000;
const DEFAULT_MAX_RETRIES = 3;

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildKyInstance(options: RequestOptions = {}, retryOptions: RetryOptions = {}) {
  const globalConfig = getConfig();
  const { method = "GET", headers = {}, params, body } = options;
  const timeout = options.timeout ?? globalConfig.timeout ?? DEFAULT_TIMEOUT;
  const maxRetries = retryOptions.maxRetries ?? globalConfig.retry?.limit ?? DEFAULT_MAX_RETRIES;

  return ky.extend({
    method: method.toLowerCase() as "get" | "post",
    headers: { ...DEFAULT_HEADERS, ...globalConfig.headers, ...headers },
    searchParams: params,
    body,
    timeout,
    retry: {
      limit: maxRetries,
      methods: ["get", "post"],
      statusCodes: [429, 500, 502, 503, 504],
    },
    hooks: globalConfig.hooks,
  });
}

/**
 * Fetch a URL with retry using ky.
 * Returns the Response object on success.
 */
export async function requestWithRetry(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<Response> {
  try {
    const client = buildKyInstance(options, retryOptions);
    return client(url);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new NetworkError(String(err));
  }
}

/**
 * Fetch JSON with retry.
 */
export async function fetchJson<T = unknown>(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<T> {
  try {
    const client = buildKyInstance(options, retryOptions);
    return client(url).json<T>();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new NetworkError(String(err));
  }
}

/**
 * Fetch text with retry.
 */
export async function fetchText(
  url: string,
  options: RequestOptions = {},
  retryOptions: RetryOptions = {},
): Promise<string> {
  try {
    const client = buildKyInstance(options, retryOptions);
    return client(url).text();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new NetworkError(String(err));
  }
}
