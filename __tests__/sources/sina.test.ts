import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  bondCbProfileSina,
  bondCbSummarySina,
  bondZhHsCovDaily,
  bondZhHsCovSpot,
} from "../../src/sources/sina.ts";
import { getCallUrl } from "../helpers";

// ---------------------------------------------------------------------------
// bondZhHsCovSpot
// ---------------------------------------------------------------------------
describe("bondZhHsCovSpot", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches paginated spot data and returns merged records", async () => {
    // count endpoint returns "160" => 160 / 80 = 2 pages
    const countResponse = new Response("160", { status: 200 });

    const page1Data = [
      {
        symbol: "sh113050",
        name: "中信转债",
        trade: "110.50",
        pricechange: "0.50",
        changepercent: "0.45",
        buy: "110.40",
        sell: "110.50",
        settlement: "110.00",
        open: "110.00",
        high: "111.00",
        low: "109.50",
        volume: "12345",
        amount: "1356789.00",
        code: "113050",
      },
    ];
    const page2Data = [
      {
        symbol: "sz128039",
        name: "三力转债",
        trade: "105.20",
        pricechange: "-0.30",
        changepercent: "-0.28",
        buy: "105.10",
        sell: "105.20",
        settlement: "105.50",
        open: "105.50",
        high: "106.00",
        low: "104.80",
        volume: "8000",
        amount: "842000.00",
        code: "128039",
      },
    ];

    const page1Response = new Response(JSON.stringify(page1Data), { status: 200 });
    const page2Response = new Response(JSON.stringify(page2Data), { status: 200 });

    // mockFetch is called in order: count URL, page 1 data, page 2 data
    mockFetch
      .mockResolvedValueOnce(countResponse)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const result = await bondZhHsCovSpot();

    // 2 pages * 80 = 160 total items expected in pagination, but we only
    // provided 1 record per page, so we get 2 records back.
    expect(result).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Verify count URL was called
    const countCallUrl = getCallUrl(mockFetch, 0);
    expect(countCallUrl).toContain("getHQNodeStockCountSimple");

    // Verify page 1 data URL
    const page1CallUrl = getCallUrl(mockFetch, 1);
    expect(page1CallUrl).toContain("getHQNodeDataSimple");
    expect(page1CallUrl).toContain("page=1");
    expect(page1CallUrl).toContain("num=80");

    // Verify page 2 data URL
    const page2CallUrl = getCallUrl(mockFetch, 2);
    expect(page2CallUrl).toContain("page=2");
    expect(page2CallUrl).toContain("num=80");

    // Verify first record fields
    expect(result[0]).toEqual(
      expect.objectContaining({
        symbol: "sh113050",
        name: "中信转债",
        trade: "110.50",
        pricechange: "0.50",
        changepercent: "0.45",
        volume: "12345",
        code: "113050",
      }),
    );

    // Verify second record fields
    expect(result[1]).toEqual(
      expect.objectContaining({
        symbol: "sz128039",
        name: "三力转债",
        trade: "105.20",
        pricechange: "-0.30",
        changepercent: "-0.28",
        volume: "8000",
        code: "128039",
      }),
    );
  });

  it("handles count < 80 as a single page", async () => {
    const countResponse = new Response("50", { status: 200 });
    const page1Data = [{ symbol: "sh113050", name: "中信转债", trade: "110.50" }];

    mockFetch
      .mockResolvedValueOnce(countResponse)
      .mockResolvedValueOnce(new Response(JSON.stringify(page1Data), { status: 200 }));

    const result = await bondZhHsCovSpot();

    expect(result).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2); // count + 1 page
  });
});

// ---------------------------------------------------------------------------
// bondZhHsCovDaily
// ---------------------------------------------------------------------------
describe("bondZhHsCovDaily", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("constructs correct URL with symbol and date", async () => {
    // Return invalid JS so runJsFunction fails gracefully
    const jsText = 'var klc_kl="test_data";';
    mockFetch.mockResolvedValueOnce(new Response(jsText, { status: 200 }));

    // The function will try to call runJsFunction which will fail to load
    // the hk_js_decode.js script in test environment, but we can still
    // verify the URL was constructed correctly
    try {
      await bondZhHsCovDaily("sz128039");
    } catch {
      // Expected to fail since hk_js_decode.js doesn't exist in test env
    }

    const calledUrl = getCallUrl(mockFetch);
    expect(calledUrl).toContain("sz128039");
    expect(calledUrl).toContain("hisdata/klc_kl.js");
  });

  it("returns empty array when decoded result is null/undefined", async () => {
    // The function has a null guard: if (!decoded) return [];
    // With invalid encrypted data, the decryption returns undefined
    const jsText = 'var klc_kl="invalid_data";';
    mockFetch.mockResolvedValueOnce(new Response(jsText, { status: 200 }));

    const result = await bondZhHsCovDaily("sz128039");
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// bondCbProfileSina
// ---------------------------------------------------------------------------
describe("bondCbProfileSina", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses HTML table and returns item/value pairs", async () => {
    const html = `
      <html><body>
      <table>
        <tr><th>项目</th><th>内容</th></tr>
        <tr><td>债券代码</td><td>128039</td></tr>
        <tr><td>债券简称</td><td>三力转债</td></tr>
        <tr><td>发行总额(亿)</td><td>2.00</td></tr>
      </table>
      </body></html>
    `;
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const result = await bondCbProfileSina("sz128039");

    // URL should contain the symbol
    const calledUrl = getCallUrl(mockFetch);
    expect(calledUrl).toContain("sz128039");

    // Should return {item, value} pairs parsed from the first table
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ item: "债券代码", value: "128039" });
    expect(result[1]).toEqual({ item: "债券简称", value: "三力转债" });
    expect(result[2]).toEqual({ item: "发行总额(亿)", value: "2.00" });
  });

  it("returns empty array when no table is found", async () => {
    const html = "<html><body><p>No table here</p></body></html>";
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const result = await bondCbProfileSina("sz128039");
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// bondCbSummarySina
// ---------------------------------------------------------------------------
describe("bondCbSummarySina", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses the 11th table (index 10) as KV pairs", async () => {
    // Build HTML with 11 tables. The 11th table (index 10) has 6 columns
    // forming 3 KV pairs per row.
    const tables: string[] = [];
    for (let i = 0; i < 10; i++) {
      tables.push(`<table><tr><th>h${i}</th></tr><tr><td>v${i}</td></tr></table>`);
    }
    // The target table at index 10: 6 columns = 3 key-value pairs
    // Add a header row so the data rows are properly parsed
    tables.push(
      `<table>
        <thead><tr><th>k1</th><th>v1</th><th>k2</th><th>v2</th><th>k3</th><th>v3</th></tr></thead>
        <tbody>
        <tr>
          <td>债券代码</td><td>155255</td>
          <td>债券简称</td><td>moden转债</td>
          <td>发行人</td><td>moden股份有限公司</td>
        </tr>
        <tr>
          <td>发行总额(亿)</td><td>10.00</td>
          <td>剩余总额(亿)</td><td>5.00</td>
          <td>票面利率</td><td>0.50%</td>
        </tr>
        </tbody>
      </table>`,
    );

    const html = `<html><body>${tables.join("\n")}</body></html>`;
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const result = await bondCbSummarySina("sh155255");

    // URL should contain the symbol
    const calledUrl = getCallUrl(mockFetch);
    expect(calledUrl).toContain("sh155255");

    // Should parse KV pairs from the 11th table
    expect(result).toContainEqual({ item: "债券代码", value: "155255" });
    expect(result).toContainEqual({ item: "债券简称", value: "moden转债" });
    expect(result).toContainEqual({ item: "发行人", value: "moden股份有限公司" });
    expect(result).toContainEqual({ item: "发行总额(亿)", value: "10.00" });
    expect(result).toContainEqual({ item: "剩余总额(亿)", value: "5.00" });
    expect(result).toContainEqual({ item: "票面利率", value: "0.50%" });
    expect(result).toHaveLength(6);
  });

  it("returns empty array when target table has no rows", async () => {
    // Only 5 tables, none at index 10
    const tables: string[] = [];
    for (let i = 0; i < 5; i++) {
      tables.push(`<table><tr><th>h${i}</th></tr><tr><td>v${i}</td></tr></table>`);
    }
    const html = `<html><body>${tables.join("\n")}</body></html>`;
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const result = await bondCbSummarySina("sh155255");
    expect(result).toEqual([]);
  });
});
