/**
 * Global configuration for akshare-cb HTTP client.
 *
 * @example
 * ```typescript
 * import { configure } from "akshare-cb";
 *
 * configure({
 *   headers: { "User-Agent": "my-app/1.0" },
 *   timeout: 30_000,
 *   hooks: {
 *     beforeRequest: [
 *       (request) => {
 *         request.headers.set("X-Custom", "value");
 *       },
 *     ],
 *   },
 * });
 * ```
 */

import type { BeforeRequestHook, Hooks } from "ky";

export interface AkshareCbConfig {
  /** Additional headers merged with defaults. */
  headers?: Record<string, string>;
  /** Global request timeout in milliseconds. */
  timeout?: number;
  /** Retry configuration. */
  retry?: { limit?: number };
  /** ky hooks for request/response interception. */
  hooks?: {
    beforeRequest?: BeforeRequestHook[];
    afterResponse?: Hooks["afterResponse"];
  };
}

let globalConfig: AkshareCbConfig = {};

/**
 * Set global configuration for all HTTP requests.
 * Can be called multiple times; each call merges with the previous config.
 */
export function configure(options: AkshareCbConfig): void {
  globalConfig = { ...globalConfig, ...options };
}

/** Reset global config to defaults. Mainly useful for testing. */
export function resetConfig(): void {
  globalConfig = {};
}

/** Get the current global config. */
export function getConfig(): AkshareCbConfig {
  return globalConfig;
}
