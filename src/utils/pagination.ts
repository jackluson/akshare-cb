import { fetchJson } from "./http.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Fetch paginated data from East Money APIs.
 * Automatically detects total pages from the first response and iterates.
 * Replaces Python's fetch_paginated_data().
 */
export async function fetchPaginatedData<T = Record<string, unknown>>(
  url: string,
  baseParams: Record<string, string>,
  options: {
    pageSize?: number;
    delayRange?: [number, number];
    dataPath?: string;
    totalPath?: string;
  } = {},
): Promise<T[]> {
  const { delayRange = [0.5, 1.5], dataPath = "data.diff", totalPath = "data.total" } = options;

  // Fetch page 1
  const firstPageParams = { ...baseParams, pn: "1" };
  const firstPage = await fetchJson<Record<string, unknown>>(url, { params: firstPageParams });

  const total = Number(getNestedValue(firstPage, totalPath) ?? 0);
  const perPage = Number(baseParams.pz ?? 20);
  const totalPages = Math.ceil(total / perPage);

  const results: T[] = extractDataArray<T>(firstPage, dataPath);

  // Fetch remaining pages
  for (let page = 2; page <= totalPages; page++) {
    await sleep(randomInRange(...delayRange) * 1000);

    const pageParams = { ...baseParams, pn: String(page) };
    const pageData = await fetchJson<Record<string, unknown>>(url, { params: pageParams });
    const items = extractDataArray<T>(pageData, dataPath);
    results.push(...items);
  }

  return results;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function extractDataArray<T>(response: Record<string, unknown>, dataPath: string): T[] {
  const data = getNestedValue(response, dataPath);
  if (Array.isArray(data)) return data as T[];
  return [];
}
