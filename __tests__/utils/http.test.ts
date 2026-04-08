import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchJson, fetchText, requestWithRetry } from "../../src/utils/http.ts";
import { getCallUrl } from "../helpers";

describe("requestWithRetry", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns response on first success", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const result = await requestWithRetry("https://example.com/api");
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries on HTTP 429", async () => {
    mockFetch
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const result = await requestWithRetry("https://example.com/api", {}, { maxRetries: 2 });
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("retries on HTTP 500", async () => {
    mockFetch
      .mockResolvedValueOnce(new Response("error", { status: 500 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const result = await requestWithRetry("https://example.com/api", {}, { maxRetries: 2 });
    expect(result.ok).toBe(true);
  });

  it("appends params to URL", async () => {
    mockFetch.mockResolvedValueOnce(new Response("ok", { status: 200 }));

    await requestWithRetry("https://example.com/api", {
      params: { foo: "bar", baz: "123" },
    });

    const url = getCallUrl(mockFetch);
    expect(url).toContain("foo=bar");
    expect(url).toContain("baz=123");
  });
});

describe("fetchJson", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses JSON response", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ key: "value" }), { status: 200 }),
    );

    const result = await fetchJson("https://example.com/api");
    expect(result).toEqual({ key: "value" });
  });
});

describe("fetchText", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns text response", async () => {
    mockFetch.mockResolvedValueOnce(new Response("hello world", { status: 200 }));

    const result = await fetchText("https://example.com/api");
    expect(result).toBe("hello world");
  });
});
