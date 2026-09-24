/**
 * 东方财富数据源 - 可转债数据
 * Data source: https://data.eastmoney.com/kzz/default.html
 * Corresponds to Python: akshare/bond/bond_zh_cov.py
 */
import { ValidationError } from "../errors";
import type {
  BondCovComparisonRecord,
  BondCovInfoIndicator,
  BondCovMinRecord,
  BondCovValueAnalysisRecord,
  BondZhCovOptions,
  BondZhCovRecord,
} from "../types/eastmoney";
import { EASTMONEY } from "../urls";
import { parseDate } from "../utils/date";
import { fetchJson } from "../utils/http";
import { toNumeric } from "../utils/numeric";
import { fetchPaginatedData } from "../utils/pagination";

const DATACENTER_URL = EASTMONEY.DATACENTER;

const BOND_QUOTE_COLUMNS =
  "f2~01~CONVERT_STOCK_CODE~CONVERT_STOCK_PRICE," +
  "f235~10~SECURITY_CODE~TRANSFER_PRICE,f236~10~SECURITY_CODE~TRANSFER_VALUE," +
  "f2~10~SECURITY_CODE~CURRENT_BOND_PRICE,f237~10~SECURITY_CODE~TRANSFER_PREMIUM_RATIO," +
  "f239~10~SECURITY_CODE~RESALE_TRIG_PRICE,f240~10~SECURITY_CODE~REDEEM_TRIG_PRICE," +
  "f23~01~CONVERT_STOCK_CODE~PBV_RATIO";

/**
 * 东方财富-可转债列表
 * Returns the full list of convertible bonds from East Money Data Center.
 *
 * @param isSurviveOrOptions Legacy survival flag, or {@link BondZhCovOptions}.
 * @param delay Legacy pagination delay in milliseconds (boolean form only).
 * @returns Normalized records. Fetches all pages unless options.pageNumber is specified.
 * Requests ALL columns and the eight quote fields with quoteType=0; no JSONP callback is needed.
 * @throws {@link ValidationError} on invalid pagination, delay, or sorting options
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const bonds = await bondZhCov();
 * console.log(bonds[0].bondCode); // "127100"
 * const page = await bondZhCov({ pageSize: 50, pageNumber: 2 });
 * const surviving = await bondZhCov(true, 500); // Existing calls remain supported.
 * ```
 */
export async function bondZhCov(
  isSurviveOrOptions: boolean | BondZhCovOptions = false,
  delay?: number,
): Promise<BondZhCovRecord[]> {
  const options =
    typeof isSurviveOrOptions === "boolean"
      ? { isSurvive: isSurviveOrOptions, delay }
      : isSurviveOrOptions;
  const { isSurvive = false, pageSize = 500, pageNumber } = options;
  const sortColumns = options.sortColumns ?? "PUBLIC_START_DATE,SECURITY_CODE";
  const sortTypes = options.sortTypes ?? "-1,-1";
  for (const [field, value] of Object.entries({ pageSize, pageNumber })) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
      throw new ValidationError(`${field} must be a positive integer`, field);
    }
  }
  if (options.delay !== undefined && (!Number.isFinite(options.delay) || options.delay < 0)) {
    throw new ValidationError("delay must be a non-negative finite number", "delay");
  }
  if (sortColumns.split(",").some((column) => !column.trim())) {
    throw new ValidationError("sortColumns must contain non-empty field names", "sortColumns");
  }
  if (
    sortTypes.split(",").length !== sortColumns.split(",").length ||
    sortTypes.split(",").some((order) => order !== "-1" && order !== "1")
  ) {
    throw new ValidationError("sortTypes must specify -1 or 1 for each sort column", "sortTypes");
  }
  const params = {
    sortColumns,
    sortTypes,
    pageSize: String(pageSize),
    pageNumber: String(pageNumber ?? 1),
    reportName: "RPT_BOND_CB_LIST",
    columns: "ALL",
    quoteColumns: BOND_QUOTE_COLUMNS,
    quoteType: "0",
    ...(options.filter !== undefined ? { filter: options.filter } : {}),
    source: "WEB",
    client: "WEB",
  };

  // Fetch the requested page, or page 1 to discover the total page count.
  const firstPage = await fetchJson<Record<string, unknown>>(DATACENTER_URL, {
    params,
  });

  const result = firstPage.result as Record<string, unknown> | undefined;
  if (!result) return [];

  const totalPages = pageNumber === undefined ? Number(result.pages ?? 1) : 1;
  const allData: Record<string, unknown>[] = [
    ...((result.data as Record<string, unknown>[]) ?? []),
  ];

  // Fetch remaining pages
  for (let page = 2; page <= totalPages; page++) {
    const currentDelay = options.delay ?? 500 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, currentDelay));

    const pageData = await fetchJson<Record<string, unknown>>(DATACENTER_URL, {
      params: { ...params, pageNumber: String(page) },
    });
    const pageResult = pageData.result as Record<string, unknown> | undefined;
    if (pageResult?.data) {
      allData.push(...(pageResult.data as Record<string, unknown>[]));
    }
  }

  const bonds = allData.map(mapBondZhCovRecord);
  if (!isSurvive) return bonds;

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const todayStart = new Date().setHours(0, 0, 0, 0);

  return bonds.filter((item) => {
    if (!item.listingDate || !item.convertPrice || !item.bondPrice || !item.convertValue)
      return false;
    if (item.listingDate && new Date(item.listingDate).setHours(0, 0, 0, 0) > todayStart)
      return false;
    if (!item.bondCode.startsWith("1")) return false;
    if (item.recordDateSh && todayStart > new Date(item.recordDateSh).getTime() - THREE_DAYS_MS)
      return false;
    if (
      item.transferEndDate &&
      todayStart > new Date(item.transferEndDate).getTime() - THREE_DAYS_MS
    )
      return false;
    return true;
  });
}

function nullableBondString(value: unknown): string | null {
  if (value == null || value === "" || value === "-") return null;
  return String(value);
}

function mapBondZhCovRecord(raw: Record<string, unknown>): BondZhCovRecord {
  return {
    bondCode: String(raw.SECURITY_CODE ?? ""),
    bondName: String(raw.SECURITY_NAME_ABBR ?? ""),
    subscribeDate: parseDate(raw.PUBLIC_START_DATE),
    subscribeCode: String(raw.CORRECODE ?? raw.APPLY_CODE ?? ""),
    subscribeLimit: toNumeric(raw.ONLINE_GENERAL_AAU ?? raw.SUBSCRIPTION_LIMIT),
    stockCode: String(raw.CONVERT_STOCK_CODE ?? ""),
    stockName: String(raw.SECURITY_SHORT_NAME ?? raw.CONVERT_STOCK_NAME ?? ""),
    stockPrice: toNumeric(raw.CONVERT_STOCK_PRICE),
    convertPrice: toNumeric(raw.TRANSFER_PRICE),
    convertValue: toNumeric(raw.TRANSFER_VALUE),
    bondPrice: toNumeric(raw.CURRENT_BOND_PRICE) ?? 100,
    convertPremiumRate: toNumeric(raw.TRANSFER_PREMIUM_RATIO),
    allotmentDate: parseDate(raw.SECURITY_START_DATE ?? raw.ALLOTMENT_DATE),
    allotmentPerShare: toNumeric(raw.FIRST_PER_PREPLACING ?? raw.ALLOTMENT_PER_SHARE),
    issueSize: toNumeric(raw.ACTUAL_ISSUE_SCALE ?? raw.ISSUE_SIZE),
    ballotDate: parseDate(raw.BOND_START_DATE ?? raw.WINNING_NUMBER_PUBLISH_DATE),
    winRate: toNumeric(raw.ONLINE_GENERAL_LWR ?? raw.WIN_RATE),
    listingDate: parseDate(raw.LISTING_DATE),
    creditRating: String(raw.RATING ?? ""),
    delistDate: parseDate(raw.DELIST_DATE),
    expireDate: parseDate(raw.EXPIRE_DATE),
    ceaseDate: parseDate(raw.CEASE_DATE),
    recordDateSh: parseDate(raw.RECORD_DATE_SH),
    transferEndDate: parseDate(raw.TRANSFER_END_DATE),
    securityId: nullableBondString(raw.SECUCODE),
    tradeMarket: nullableBondString(raw.TRADE_MARKET),
    bondDuration: toNumeric(raw.BOND_EXPIRE),
    valueDate: parseDate(raw.VALUE_DATE),
    issueYear: nullableBondString(raw.ISSUE_YEAR),
    payInterestDay: nullableBondString(raw.PAY_INTEREST_DAY),
    interestRateExplain: nullableBondString(raw.INTEREST_RATE_EXPLAIN),
    bondCombineCode: nullableBondString(raw.BOND_COMBINE_CODE),
    issuePrice: toNumeric(raw.ISSUE_PRICE),
    remark: nullableBondString(raw.REMARK),
    parValue: toNumeric(raw.PAR_VALUE),
    issueObject: nullableBondString(raw.ISSUE_OBJECT),
    redeemType: nullableBondString(raw.REDEEM_TYPE),
    resaleExecuteReason: nullableBondString(raw.EXECUTE_REASON_HS),
    resaleNoticeDate: parseDate(raw.NOTICE_DATE_HS),
    redeemNoticeDate: parseDate(raw.NOTICE_DATE_SH),
    resaleExecutePrice: toNumeric(raw.EXECUTE_PRICE_HS),
    redeemExecutePrice: toNumeric(raw.EXECUTE_PRICE_SH),
    redeemStartDate: parseDate(raw.EXECUTE_START_DATESH),
    resaleStartDate: parseDate(raw.EXECUTE_START_DATEHS),
    executeEndDate: parseDate(raw.EXECUTE_END_DATE),
    subscribeName: nullableBondString(raw.CORRECODE_NAME_ABBR),
    allotmentCode: nullableBondString(raw.CORRECODEO),
    allotmentName: nullableBondString(raw.CORRECODE_NAME_ABBRO),
    initialConvertPrice: toNumeric(raw.INITIAL_TRANSFER_PRICE),
    convertStartDate: parseDate(raw.TRANSFER_START_DATE),
    resaleClause: nullableBondString(raw.RESALE_CLAUSE),
    redeemClause: nullableBondString(raw.REDEEM_CLAUSE),
    ratingAgency: nullableBondString(raw.PARTY_NAME),
    stockPriceHq: toNumeric(raw.CONVERT_STOCK_PRICEHQ),
    market: nullableBondString(raw.MARKET),
    resaleTriggerPrice: toNumeric(raw.RESALE_TRIG_PRICE),
    redeemTriggerPrice: toNumeric(raw.REDEEM_TRIG_PRICE),
    pbRatio: toNumeric(raw.PBV_RATIO),
    interestBeginDate: parseDate(raw.IB_START_DATE),
    interestEndDate: parseDate(raw.IB_END_DATE),
    cashflowDate: parseDate(raw.CASHFLOW_DATE),
    couponRate: toNumeric(raw.COUPON_IR),
    issueTypeName: nullableBondString(raw.PARAM_NAME),
    issueType: nullableBondString(raw.ISSUE_TYPE),
    redeemExecuteReason: nullableBondString(raw.EXECUTE_REASON_SH),
    paydayNew: nullableBondString(raw.PAYDAYNEW),
    bondPriceNew: toNumeric(raw.CURRENT_BOND_PRICENEW),
    isConvertStock: nullableBondString(raw.IS_CONVERT_STOCK),
    isRedeem: nullableBondString(raw.IS_REDEEM),
    isSellback: nullableBondString(raw.IS_SELLBACK),
    firstProfit: toNumeric(raw.FIRST_PROFIT),
    subscribeDateTime: nullableBondString(raw.PUBLIC_START_DATE_HOURS),
  };
}

/**
 * 东方财富-可转债比价表
 * Returns convertible bond comparison table with price premium analysis.
 *
 * @returns Array of {@link BondCovComparisonRecord} with 20 fields per record
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const comparison = await bondCovComparison();
 * console.log(comparison[0].bondCode);
 * ```
 */
export async function bondCovComparison(): Promise<BondCovComparisonRecord[]> {
  const url = EASTMONEY.PUSH_CLIST;
  const params = {
    pn: "1",
    pz: "100",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f243",
    fs: "b:MK0354",
    fields:
      "f1,f152,f2,f3,f12,f13,f14,f227,f228,f229,f230,f231,f232,f233,f234," +
      "f235,f236,f237,f238,f239,f240,f241,f242,f26,f243",
  };

  const data = await fetchPaginatedData<Record<string, unknown>>(url, params, {
    dataPath: "data.diff",
    totalPath: "data.total",
  });
  return data.map(mapComparisonRecord);
}

function mapComparisonRecord(raw: Record<string, unknown>): BondCovComparisonRecord {
  return {
    index: toNumeric(raw.f1) ?? 0,
    bondCode: String(raw.f12 ?? ""),
    bondName: String(raw.f14 ?? ""),
    bondPrice: toNumeric(raw.f2),
    bondChangeRate: toNumeric(raw.f3),
    stockCode: String(raw.f232 ?? ""),
    stockName: String(raw.f234 ?? ""),
    pureBondValue: toNumeric(raw.f227),
    stockPrice: toNumeric(raw.f229),
    stockChangeRate: toNumeric(raw.f230),
    convertPrice: toNumeric(raw.f235),
    convertValue: toNumeric(raw.f236),
    convertPremiumRate: toNumeric(raw.f237),
    bondPurePremiumRate: toNumeric(raw.f238),
    resaleTriggerPrice: toNumeric(raw.f239),
    redeemTriggerPrice: toNumeric(raw.f240),
    maturityRedeemPrice: toNumeric(raw.f241),
    listingDate: parseDate(raw.f26),
    convertStartDate: parseDate(raw.f242),
    issueStartDate: parseDate(raw.f243),
    subscribeDate: null,
  };
}

/**
 * 东方财富-可转债详情
 * Returns detailed information for a specific convertible bond.
 *
 * @param symbol - Bond code, e.g. `"127100"`
 * @param indicator - Data type: `"basic"` = basic info, `"ballot"` = ballot data,
 *   `"fundraising"` = fundraising details, `"dates"` = key dates
 * @returns Array of raw records whose structure depends on `indicator`
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const basic = await bondZhCovInfo("127100", "basic");
 * const ballot = await bondZhCovInfo("127100", "ballot");
 * ```
 */
export async function bondZhCovInfo(
  symbol: string,
  indicator: BondCovInfoIndicator = "basic",
): Promise<Record<string, unknown>[]> {
  const indicatorMap: Record<BondCovInfoIndicator, string> = {
    basic: "RPT_BOND_CB_LIST",
    ballot: "RPT_CB_BALLOTNUM",
    fundraising: "RPT_BOND_BS_OPRFINVESTITEM",
    dates: "RPT_CB_IMPORTANTDATE",
  };

  const reportName = indicatorMap[indicator];
  if (!reportName) return [];

  const quoteColumns =
    "f2~01~CONVERT_STOCK_CODE~CONVERT_STOCK_PRICE,f235~10~SECURITY_CODE~TRANSFER_PRICE," +
    "f236~10~SECURITY_CODE~TRANSFER_VALUE,f2~10~SECURITY_CODE~CURRENT_BOND_PRICE," +
    "f237~10~SECURITY_CODE~TRANSFER_PREMIUM_RATIO,f239~10~SECURITY_CODE~RESALE_TRIG_PRICE," +
    "f240~10~SECURITY_CODE~REDEEM_TRIG_PRICE,f23~01~CONVERT_STOCK_CODE~PBV_RATIO";

  const params: Record<string, string> = {
    reportName,
    columns: "ALL",
    quoteColumns,
    quoteType: "0",
    source: "WEB",
    client: "WEB",
    filter: `(SECURITY_CODE="${symbol}")`,
  };

  if (indicator === "fundraising") {
    params.sortColumns = "SORT";
    params.sortTypes = "1";
  }

  const data = await fetchJson<Record<string, unknown>>(DATACENTER_URL, { params });
  const result = data.result as Record<string, unknown> | undefined;
  if (!result?.data) return [];

  return result.data as Record<string, unknown>[];
}

/**
 * 东方财富-可转债价值分析
 * Returns historical value analysis data for a specific convertible bond.
 *
 * @param symbol - Bond code, e.g. `"127100"`
 * @returns Array of {@link BondCovValueAnalysisRecord}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const analysis = await bondCovValueAnalysis("127100");
 * console.log(analysis[0].closePrice);
 * ```
 */
export async function bondCovValueAnalysis(symbol: string): Promise<BondCovValueAnalysisRecord[]> {
  const url = EASTMONEY.DATA_GET;
  const params = {
    sty: "ALL",
    token: "894050c76af8597a853f5b408b759f5d",
    st: "date",
    sr: "1",
    source: "WEB",
    type: "RPTA_WEB_KZZ_LS",
    filter: `(zcode="${symbol}")`,
    p: "1",
    ps: "8000",
  };

  const data = await fetchJson<Record<string, unknown>>(url, { params });
  const result = data.result as Record<string, unknown> | undefined;
  if (!result?.data) return [];

  return (result.data as Record<string, unknown>[]).map(mapValueAnalysis);
}

function mapValueAnalysis(raw: Record<string, unknown>): BondCovValueAnalysisRecord {
  const values = Object.values(raw);
  return {
    date: parseDate(values[0]) ?? "",
    closePrice: toNumeric(values[1]),
    pureBondValue: toNumeric(values[3]),
    convertValue: toNumeric(values[2]),
    bondPremiumRate: toNumeric(values[4]),
    convertPremiumRate: toNumeric(values[5]),
  };
}

const MARKET_TYPE: Record<string, string> = { sh: "1", sz: "0" };

function parseSecid(symbol: string): string | null {
  const prefix = symbol.slice(0, 2).toLowerCase();
  const code = symbol.slice(2);
  const marketType = MARKET_TYPE[prefix];
  if (!marketType) return null;
  return `${marketType}.${code}`;
}

/**
 * 东方财富-可转债分钟行情
 * Returns intraday minute-level market data for a convertible bond.
 *
 * @param symbol - Market prefix + code, e.g. `"sz128039"`, `"sh113050"`
 * @param period - Minute period: `"1"` = tick, `"5"` / `"15"` / `"30"` / `"60"` = kline.
 *   Defaults to `"15"`.
 * @param adjust - Adjustment method: `""` = none, `"qfq"` = forward, `"hfq"` = backward.
 *   Defaults to `""`.
 * @param startDate - Filter start time. Defaults to `"1979-09-01 09:32:00"`.
 * @param endDate - Filter end time. Defaults to `"2222-01-01 09:32:00"`.
 * @returns Array of {@link BondCovMinRecord}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const ticks = await bondZhHsCovMin("sz128039", "1");
 * const kline = await bondZhHsCovMin("sz128039", "15");
 * ```
 */
export async function bondZhHsCovMin(
  symbol: string,
  period: string = "15",
  adjust: string = "",
  startDate: string = "1979-09-01 09:32:00",
  endDate: string = "2222-01-01 09:32:00",
): Promise<BondCovMinRecord[]> {
  const secid = parseSecid(symbol);
  if (!secid) return [];

  if (period === "1") {
    return fetchMinTrends(secid, "0");
  }
  return fetchMinKline(secid, period, adjust, startDate, endDate);
}

async function fetchMinTrends(secid: string, iscr: string): Promise<BondCovMinRecord[]> {
  const url = EASTMONEY.STOCK_TRENDS;
  const params = {
    secid,
    fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58",
    iscr,
    iscca: "0",
    ut: "f057cbcbce2a86e2866ab8877db1d059",
    ndays: "1",
  };

  const data = await fetchJson<Record<string, unknown>>(url, { params });
  const result = data.data as Record<string, unknown> | undefined;
  if (!result?.trends) return [];

  return (result.trends as string[]).map(parseMinTrendLine);
}

function parseMinTrendLine(line: string): BondCovMinRecord {
  const parts = line.split(",");
  return {
    time: parts[0] ?? "",
    open: toNumeric(parts[1]),
    close: toNumeric(parts[2]),
    high: toNumeric(parts[3]),
    low: toNumeric(parts[4]),
    volume: toNumeric(parts[5]),
    amount: toNumeric(parts[6]),
  };
}

async function fetchMinKline(
  secid: string,
  period: string,
  adjust: string,
  startDate: string,
  endDate: string,
): Promise<BondCovMinRecord[]> {
  const url = EASTMONEY.STOCK_KLINE;
  const adjustMap: Record<string, string> = { "": "0", qfq: "1", hfq: "2" };

  const params = {
    secid,
    klt: period,
    fqt: adjustMap[adjust] ?? "0",
    lmt: "66",
    end: "20500000",
    forcect: "1",
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
  };

  const data = await fetchJson<Record<string, unknown>>(url, { params });
  const result = data.data as Record<string, unknown> | undefined;
  if (!result?.klines) return [];

  return (result.klines as string[])
    .map(parseMinKline)
    .filter((r) => r.time >= startDate && r.time <= endDate);
}

function parseMinKline(line: string): BondCovMinRecord {
  const parts = line.split(",");
  return {
    time: parts[0] ?? "",
    open: toNumeric(parts[1]),
    close: toNumeric(parts[2]),
    high: toNumeric(parts[3]),
    low: toNumeric(parts[4]),
    volume: toNumeric(parts[5]),
    amount: toNumeric(parts[6]),
    amplitude: toNumeric(parts[7]),
    changeRate: toNumeric(parts[8]),
    changeAmount: toNumeric(parts[9]),
    turnoverRate: toNumeric(parts[10]),
  };
}

/**
 * 东方财富-可转债盘前分钟行情
 * Returns pre-market intraday data for a convertible bond.
 *
 * @param symbol - Market prefix + code, e.g. `"sz128039"`
 * @returns Array of {@link BondCovMinRecord}
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 东方财富
 *
 * @example
 * ```typescript
 * const preMarket = await bondZhHsCovPreMin("sz128039");
 * ```
 */
export async function bondZhHsCovPreMin(symbol: string): Promise<BondCovMinRecord[]> {
  const secid = parseSecid(symbol);
  if (!secid) return [];
  return fetchMinTrends(secid, "1");
}
