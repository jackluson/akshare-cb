/**
 * 新浪财经数据源 - 沪深可转债实时/历史行情 + 可转债详情/概况
 * Data source: https://vip.stock.finance.sina.com.cn/mkt/#hskzz_z
 * Corresponds to Python:
 *   akshare/bond/bond_zh_cov.py (bond_zh_hs_cov_spot, bond_zh_hs_cov_daily)
 *   akshare/bond/bond_cb_sina.py (bond_cb_profile_sina, bond_cb_summary_sina)
 */
import type {
  BondCbProfileItem,
  BondCbSummaryItem,
  BondCovDailyRecord,
  BondCovSpotRecord,
} from "../types/sina";
import { parseDate } from "../utils/date";
import { parseHtmlTableAsKVPairs, parseHtmlTableAsRecords } from "../utils/html-table";
import { fetchText } from "../utils/http";
import { runJsFunction } from "../utils/js-runner";
import { lenientJsonParse } from "../utils/lenient-json";
import { toNumeric } from "../utils/numeric";

const SPOT_COUNT_URL =
  "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeStockCountSimple";
const SPOT_DATA_URL =
  "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeDataSimple";
const HIST_URL =
  "https://finance.sina.com.cn/realstock/company/{symbol}/hisdata/klc_kl.js?d={date}";
const PROFILE_URL = "https://money.finance.sina.com.cn/bond/info/{symbol}.html";
const SUMMARY_URL = "https://money.finance.sina.com.cn/bond/quotes/{symbol}.html";

/**
 * 新浪财经-债券-沪深可转债实时行情
 * Returns real-time spot data for all SSE/SZSE convertible bonds.
 * Uses paginated GET; 80 items per page.
 *
 * @returns Array of {@link BondCovSpotRecord} — dynamic fields from Sina API
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 新浪财经
 *
 * @example
 * ```typescript
 * const spot = await bondZhHsCovSpot();
 * console.log(spot[0].symbol);
 * ```
 */
export async function bondZhHsCovSpot(): Promise<BondCovSpotRecord[]> {
  const pageCount = await getPageCount();
  const allRecords: BondCovSpotRecord[] = [];

  for (let page = 1; page <= pageCount; page++) {
    const params = {
      page: String(page),
      num: "80",
      sort: "symbol",
      asc: "1",
      node: "hskzz_z",
      _s_r_a: "page",
    };

    const text = await fetchText(SPOT_DATA_URL, { params });
    const pageData = lenientJsonParse<BondCovSpotRecord[]>(text);
    if (Array.isArray(pageData)) {
      allRecords.push(...pageData);
    }
  }

  return allRecords;
}

/**
 * Get the total number of pages for the spot data.
 * Fetches the total count from the count endpoint and divides by 80.
 */
async function getPageCount(): Promise<number> {
  const text = await fetchText(SPOT_COUNT_URL, {
    params: { node: "hskzz_z" },
  });
  const match = text.match(/\d+/);
  if (!match) return 1;
  const total = Number.parseInt(match[0], 10);
  const pages = total / 80;
  return Number.isInteger(pages) ? pages : Math.floor(pages) + 1;
}

/**
 * 新浪财经-债券-沪深可转债历史日线
 * Returns daily K-line data for a given convertible bond symbol.
 *
 * @param symbol - Bond symbol with market prefix, e.g. `"sz128039"`
 * @returns Array of {@link BondCovDailyRecord}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 新浪财经
 *
 * @example
 * ```typescript
 * const daily = await bondZhHsCovDaily("sz128039");
 * console.log(daily[0].close);
 * ```
 */
export async function bondZhHsCovDaily(symbol: string): Promise<BondCovDailyRecord[]> {
  const now = new Date();
  const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}_${String(now.getDate()).padStart(2, "0")}`;
  const url = HIST_URL.replace("{symbol}", symbol).replace("{date}", dateStr);

  const text = await fetchText(url);

  // Extract the encrypted data payload between the first "=" and the first ";"
  const encryptedData = text.split("=")[1].split(";")[0].replace(/"/g, "");

  // Decode using the hk_js_decode.js script
  const decoded = await runJsFunction<
    Array<{
      date?: string;
      open?: string;
      high?: string;
      low?: string;
      close?: string;
      volume?: string;
    }>
  >("../scripts/hk_js_decode.js", "d", encryptedData);

  if (!decoded) return [];
  return decoded.map(mapDailyRecord);
}

function mapDailyRecord(raw: Record<string, unknown>): BondCovDailyRecord {
  return {
    date: parseDate(raw.date) ?? "",
    open: toNumeric(raw.open),
    high: toNumeric(raw.high),
    close: toNumeric(raw.close),
    low: toNumeric(raw.low),
    volume: toNumeric(raw.volume),
  };
}

/**
 * 新浪财经-债券-可转债详情资料
 * Returns detailed bond profile as key-value items.
 *
 * @param symbol - Bond symbol with market prefix, e.g. `"sz128039"`
 * @returns Array of {@link BondCbProfileItem}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on HTML parse failures
 * @category 新浪财经
 *
 * @example
 * ```typescript
 * const profile = await bondCbProfileSina("sz128039");
 * console.log(profile[0]); // { item: "债券代码", value: "128039" }
 * ```
 */
export async function bondCbProfileSina(symbol: string): Promise<BondCbProfileItem[]> {
  const url = PROFILE_URL.replace("{symbol}", symbol);
  const html = await fetchText(url);

  // Parse the first HTML table as records, then map to item/value pairs
  const records = parseHtmlTableAsRecords(html, 0);

  return records.map((record) => {
    // Each record is a single row with two columns: key and value
    const keys = Object.keys(record);
    return {
      item: keys[0] ? record[keys[0]] : "",
      value: keys[1] ? record[keys[1]] : "",
    };
  });
}

/**
 * 新浪财经-债券-可转债概况摘要
 * Returns bond summary as key-value items.
 * Parses the 11th table (index 10) which has 6 columns = 3 key-value pairs side by side.
 *
 * @param symbol - Bond symbol with market prefix, e.g. `"sh155255"`
 * @returns Array of {@link BondCbSummaryItem}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on HTML parse failures
 * @category 新浪财经
 *
 * @example
 * ```typescript
 * const summary = await bondCbSummarySina("sh155255");
 * ```
 */
export async function bondCbSummarySina(symbol: string): Promise<BondCbSummaryItem[]> {
  const url = SUMMARY_URL.replace("{symbol}", symbol);
  const html = await fetchText(url);

  // The 11th table (index 10) has 6 columns forming 3 key-value pairs per row
  const kvMap = parseHtmlTableAsKVPairs(html, 10);

  return Object.entries(kvMap).map(([item, value]) => ({ item, value }));
}
