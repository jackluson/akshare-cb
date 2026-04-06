/**
 * 集思录数据源 - 可转债等权指数/列表/强赎/转股价调整
 * Data source: https://www.jisilu.cn/data/cbnew/#cb
 * Corresponds to Python: akshare/bond/bond_convert.py
 */
import type {
  BondCbAdjLogsJslRecord,
  BondCbIndexJslRecord,
  BondCbIndexJslRecordRaw,
  BondCbJslRecord,
  BondCbRedeemJslRecord,
  RedeemStatus,
} from "../types/jisilu";
import { parseDate } from "../utils/date";
import { parseHtmlTableAsRecords } from "../utils/html-table";
import { fetchText } from "../utils/http";
import { lenientJsonParse } from "../utils/lenient-json";
import { toNumeric } from "../utils/numeric";

const INDEX_URL = "https://www.jisilu.cn/webapi/cb/index_history/";
const CB_LIST_URL = "https://www.jisilu.cn/data/cbnew/cb_list_new/";
const REDEEM_URL = "https://www.jisilu.cn/data/cbnew/redeem_list/";
const ADJ_LOGS_URL = "https://www.jisilu.cn/data/cbnew/adj_logs/";

const REDEEM_ICON_MAP: Record<string, RedeemStatus> = {
  R: "已公告强赎",
  O: "公告要强赎",
  G: "公告不强赎",
  B: "已满足强赎条件",
  "": "",
};

const JSL_BASE_HEADERS: Record<string, string> = {
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://www.jisilu.cn",
  Pragma: "no-cache",
  Referer: "https://www.jisilu.cn/data/cbnew/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
};

/**
 * 集思录-可转债等权指数
 * Returns the Jisilu convertible bond equal-weight index history (raw column-based format).
 *
 * @returns Column-based raw data {@link BondCbIndexJslRecordRaw}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 集思录
 *
 * @example
 * ```typescript
 * const raw = await bondCbIndexJsl();
 * console.log(raw.price_dt[0]); // date array
 * ```
 */
export async function bondCbIndexJsl(): Promise<BondCbIndexJslRecordRaw> {
  const text = await fetchText(INDEX_URL);
  const parsed = lenientJsonParse<{ data: BondCbIndexJslRecordRaw }>(text);
  return parsed.data ?? [];
}

/**
 * 集思录-可转债等权指数
 * Returns the Jisilu convertible bond equal-weight index history as row-based records.
 *
 * @returns Array of {@link BondCbIndexJslRecord} (32 fields)
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @internal
 */
export async function bondCbIndexJslWithList(): Promise<BondCbIndexJslRecord[]> {
  const raw = await bondCbIndexJsl();
  if (!raw) return [];
  // API returns column-based data (each key maps to an array of values).
  // Transpose into row-based records.
  const keys = Object.keys(raw) as (keyof BondCbIndexJslRecordRaw)[];
  const len = (raw.price_dt as unknown[])?.length ?? 0;

  const records: BondCbIndexJslRecord[] = [];
  for (let i = 0; i < len; i++) {
    const record: Record<string, unknown> = {};
    for (const key of keys) {
      const value = (raw[key] as unknown[])[i];
      record[key] = typeof value === "number" ? value : (toNumeric(value) ?? value);
    }
    records.push(record as unknown as BondCbIndexJslRecord);
  }

  return records;
}

/**
 * 集思录-可转债列表
 * Returns all listed convertible bond data from Jisilu.
 * Requires a valid browser cookie for authentication.
 *
 * @param cookie - Browser cookie string for Jisilu authentication
 * @returns Array of {@link BondCbJslRecord} (23 fields)
 * @throws {@link AuthenticationError} when cookie is missing or invalid
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 集思录
 *
 * @example
 * ```typescript
 * const list = await bondCbJsl("your_cookie_string");
 * console.log(list[0].bondCode);
 * ```
 */
export async function bondCbJsl(cookie: string): Promise<BondCbJslRecord[]> {
  const headers = { ...JSL_BASE_HEADERS, cookie };

  const params = {
    ___jsl: `LST___t=${Date.now()}`,
  };

  const payload = {
    fprice: "",
    tprice: "",
    curr_iss_amt: "",
    volume: "",
    svolume: "",
    premium_rt: "",
    ytm_rt: "",
    market: "",
    rating_cd: "",
    is_search: "N",
    "market_cd[]": ["shmb", "shkc", "szmb", "szcy"],
    btype: "",
    listed: "Y",
    qflag: "N",
    sw_cd: "",
    bond_ids: "",
    rp: "50",
  };

  const text = await fetchText(CB_LIST_URL, {
    method: "POST",
    headers,
    params,
    body: JSON.stringify(payload),
  });

  const dataJson = lenientJsonParse<JslListResponse>(text);
  const rows = dataJson.rows ?? [];

  return rows.map((row) => mapJslRecord(row.cell));
}

interface JslListResponse {
  rows?: Array<{ cell: JslRawCell }>;
}

interface JslRawCell {
  bond_id?: string;
  bond_nm?: string;
  price?: unknown;
  increase_rt?: unknown;
  stock_id?: string;
  stock_nm?: string;
  sprice?: unknown;
  sincrease_rt?: unknown;
  pb?: unknown;
  convert_price?: unknown;
  convert_value?: unknown;
  premium_rt?: unknown;
  rating_cd?: string;
  put_convert_price?: unknown;
  force_redeem_price?: unknown;
  convert_amt_ratio?: unknown;
  maturity_dt?: unknown;
  year_left?: unknown;
  curr_iss_amt?: unknown;
  volume?: unknown;
  turnover_rt?: unknown;
  ytm_rt?: unknown;
  dblow?: unknown;
}

function mapJslRecord(cell: JslRawCell): BondCbJslRecord {
  return {
    bondCode: cell.bond_id ?? "",
    bondName: cell.bond_nm ?? "",
    price: toNumeric(cell.price),
    changeRate: toNumeric(cell.increase_rt),
    stockCode: cell.stock_id ?? "",
    stockName: cell.stock_nm ?? "",
    stockPrice: toNumeric(cell.sprice),
    stockChangeRate: toNumeric(cell.sincrease_rt),
    stockPB: toNumeric(cell.pb),
    convertPrice: toNumeric(cell.convert_price),
    convertValue: toNumeric(cell.convert_value),
    convertPremiumRate: toNumeric(cell.premium_rt),
    rating: cell.rating_cd ?? null,
    resaleTriggerPrice: toNumeric(cell.put_convert_price),
    redeemTriggerPrice: toNumeric(cell.force_redeem_price),
    bondRatio: toNumeric(cell.convert_amt_ratio),
    maturityDate: parseDate(cell.maturity_dt),
    remainingYears: toNumeric(cell.year_left),
    remainingSize: toNumeric(cell.curr_iss_amt),
    turnover: toNumeric(cell.volume),
    turnoverRate: toNumeric(cell.turnover_rt),
    ytm: toNumeric(cell.ytm_rt),
    doubleLow: toNumeric(cell.dblow),
  };
}

/**
 * 集思录-可转债强赎
 * Returns forced redemption data for all convertible bonds.
 *
 * @returns Array of {@link BondCbRedeemJslRecord} (18 fields)
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 集思录
 *
 * @example
 * ```typescript
 * const redeem = await bondCbRedeemJsl();
 * console.log(redeem[0].redeemStatus); // "已公告强赎" | "公告要强赎" | ...
 * ```
 */
export async function bondCbRedeemJsl(): Promise<BondCbRedeemJslRecord[]> {
  const params = {
    ___jsl: `LST___t=${Date.now()}`,
  };

  const payload = { rp: "50" };

  const text = await fetchText(REDEEM_URL, {
    method: "POST",
    headers: JSL_BASE_HEADERS,
    params,
    body: JSON.stringify(payload),
  });

  const dataJson = lenientJsonParse<JslRedeemResponse>(text);
  const rows = dataJson.rows ?? [];

  return rows.map((row) => mapRedeemRecord(row.cell));
}

interface JslRedeemResponse {
  rows?: Array<{ cell: JslRedeemRawCell }>;
}

interface JslRedeemRawCell {
  bond_id?: string;
  bond_nm?: string;
  price?: unknown;
  stock_id?: string;
  stock_nm?: string;
  orig_iss_amt?: unknown;
  curr_iss_amt?: unknown;
  convert_dt?: unknown;
  delist_dt?: unknown;
  maturity_dt?: unknown;
  convert_price?: unknown;
  redeem_price_ratio?: unknown;
  force_redeem_price?: unknown;
  sprice?: unknown;
  real_force_redeem_price?: unknown;
  redeem_count?: string;
  redeem_tc?: string;
  redeem_icon?: string;
}

function mapRedeemRecord(cell: JslRedeemRawCell): BondCbRedeemJslRecord {
  // Map redeem_icon to Chinese status text
  const iconKey = String(cell.redeem_icon ?? "");
  const redeemStatus: RedeemStatus = REDEEM_ICON_MAP[iconKey] ?? "";

  return {
    bondCode: cell.bond_id ?? "",
    bondName: cell.bond_nm ?? "",
    price: toNumeric(cell.price),
    stockCode: cell.stock_id ?? "",
    stockName: cell.stock_nm ?? "",
    totalSize: toNumeric(cell.orig_iss_amt),
    remainingSize: toNumeric(cell.curr_iss_amt),
    convertStartDate: parseDate(cell.convert_dt),
    lastTradeDate: parseDate(cell.delist_dt),
    maturityDate: parseDate(cell.maturity_dt),
    convertPrice: toNumeric(cell.convert_price),
    redeemTriggerRatio: toNumeric(cell.redeem_price_ratio),
    redeemTriggerPrice: toNumeric(cell.force_redeem_price),
    stockPrice: toNumeric(cell.sprice),
    redeemPrice: toNumeric(cell.real_force_redeem_price),
    redeemDayCount: cell.redeem_count ?? null,
    redeemClause: cell.redeem_tc ?? null,
    redeemStatus,
  };
}

/**
 * 集思录-转股价调整记录
 * Returns adjustment history for a convertible bond's conversion price.
 * Returns an empty array if no data is available.
 *
 * @param symbol - Bond code without market prefix, e.g. `"128013"`
 * @returns Array of {@link BondCbAdjLogsJslRecord}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on HTML parse failures
 * @category 集思录
 *
 * @example
 * ```typescript
 * const adjLogs = await bondCbAdjLogsJsl("128013");
 * ```
 */
export async function bondCbAdjLogsJsl(symbol: string): Promise<BondCbAdjLogsJslRecord[]> {
  const url = `${ADJ_LOGS_URL}?bond_id=${symbol}`;
  const text = await fetchText(url);

  // Check for presence of a table; if absent, return empty array
  if (!text.includes("</table>")) {
    return [];
  }

  const records = parseHtmlTableAsRecords(text, 0);

  return records.map(mapAdjLogRecord);
}

function mapAdjLogRecord(raw: Record<string, string>): BondCbAdjLogsJslRecord {
  // Column names may contain spaces; strip them for consistent lookup
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    normalized[key.replace(/\s+/g, "")] = value;
  }

  return {
    beforePrice: toNumeric(normalized.下修前转股价),
    afterPrice: toNumeric(normalized.下修后转股价),
    bottomPrice: toNumeric(normalized.下修底价),
    meetingDate: parseDate(normalized.股东大会日),
    effectiveDate: parseDate(normalized.新转股价生效日期),
  };
}
