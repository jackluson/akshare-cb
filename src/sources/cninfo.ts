/**
 * 巨潮资讯数据源 - 可转债发行/转股数据
 * Data source: http://webapi.cninfo.com.cn
 * Corresponds to Python: akshare/bond/bond_issue_cninfo.py
 */
import { createCipheriv } from "node:crypto";
import type { BondCovIssueCninfoRecord, BondCovStockIssueCninfoRecord } from "../types/cninfo";
import { CNINFO } from "../urls";
import { formatFlexDate, parseDate } from "../utils/date";
import { fetchJson } from "../utils/http";
import { toNumeric } from "../utils/numeric";

/**
 * Generate AES-128-CBC encrypted token for cninfo API authentication.
 * Replaces Python's py_mini_racer execution of cninfo.js.
 *
 * Algorithm: AES-CBC-encrypt( floor(timestamp/1000), key, iv ) -> base64
 * Key/IV: "1234567887654321"
 */
function getResCode1(): string {
  const key = Buffer.from("1234567887654321");
  const iv = Buffer.from("1234567887654321");
  const plaintext = Buffer.from(Math.floor(Date.now() / 1000).toString());
  const cipher = createCipheriv("aes-128-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return encrypted.toString("base64");
}

function cninfoHeaders(): Record<string, string> {
  return {
    Accept: "*/*",
    "Accept-Enckey": getResCode1(),
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Content-Length": "0",
    Host: "webapi.cninfo.com.cn",
    Origin: "http://webapi.cninfo.com.cn",
    Pragma: "no-cache",
    Referer: "http://webapi.cninfo.com.cn/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  };
}

interface CninfoResponse {
  records?: CninfoRecord[];
  [key: string]: unknown;
}

interface CninfoRecord {
  [key: string]: unknown;
}

/**
 * 巨潮资讯-可转债发行
 * Returns convertible bond issuance data for a date range.
 * Uses AES-128-CBC encrypted token for API authentication (auto-generated).
 *
 * @param startDate - Start date, e.g. `"2024-01-01"` or `"20240101"`
 * @param endDate - End date, e.g. `"2024-12-31"` or `"20241231"`
 * @returns Array of {@link BondCovIssueCninfoRecord} (28 fields)
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 巨潮资讯
 *
 * @example
 * ```typescript
 * const issues = await bondCovIssueCninfo("2024-01-01", "2024-12-31");
 * ```
 */
export async function bondCovIssueCninfo(
  startDate: string,
  endDate: string,
): Promise<BondCovIssueCninfoRecord[]> {
  const url = CNINFO.ISSUE;
  const params = {
    sdate: formatFlexDate(startDate),
    edate: formatFlexDate(endDate),
  };

  const data = await fetchJson<CninfoResponse>(url, {
    method: "POST",
    headers: cninfoHeaders(),
    params,
  });

  return (data.records ?? []).map(mapIssueRecord);
}

/**
 * 巨潮资讯-可转债转股
 * Returns convertible bond to stock conversion records.
 *
 * @returns Array of {@link BondCovStockIssueCninfoRecord} (10 fields)
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 巨潮资讯
 *
 * @example
 * ```typescript
 * const conversions = await bondCovStockIssueCninfo();
 * ```
 */
export async function bondCovStockIssueCninfo(): Promise<BondCovStockIssueCninfoRecord[]> {
  const url = CNINFO.STOCK_ISSUE;

  const data = await fetchJson<CninfoResponse>(url, {
    method: "POST",
    headers: cninfoHeaders(),
  });

  return (data.records ?? []).map(mapStockIssueRecord);
}

function mapIssueRecord(raw: CninfoRecord): BondCovIssueCninfoRecord {
  return {
    bondCode: String(raw.SECCODE ?? ""),
    bondName: String(raw.SECNAME ?? ""),
    announceDate: parseDate(raw.DECLAREDATE),
    issueStartDate: parseDate(raw.F002D),
    issueEndDate: parseDate(raw.F003D),
    plannedIssueAmount: toNumeric(raw.F005N),
    actualIssueAmount: toNumeric(raw.F006N),
    faceValue: toNumeric(raw.F007N),
    issuePrice: toNumeric(raw.F008N),
    issueMethod: String(raw.F009V ?? ""),
    issueTarget: String(raw.F010V ?? ""),
    issueScope: String(raw.F011V ?? ""),
    underwritingMethod: String(raw.F012V ?? ""),
    fundraisingPurpose: String(raw.F013V ?? ""),
    initialConvertPrice: toNumeric(raw.F003N),
    convertStartDate: parseDate(raw.F027D),
    convertEndDate: parseDate(raw.F053D),
    onlineSubscribeDate: parseDate(raw.F054D),
    onlineSubscribeCode: String(raw.F055V ?? ""),
    onlineSubscribeShortName: String(raw.F056V ?? ""),
    onlineSubscribeMax: toNumeric(raw.F057N),
    onlineSubscribeMin: toNumeric(raw.F058N),
    onlineSubscribeUnit: toNumeric(raw.F059N),
    onlineBallotPublishDate: parseDate(raw.F060D),
    prioritySubscribeDate: parseDate(raw.F061D),
    allotmentPrice: toNumeric(raw.F062N),
    rightsRecordDate: parseDate(raw.F063D),
    priorityPaymentDate: parseDate(raw.F064D),
    convertCode: String(raw.F001V ?? ""),
    market: String(raw.F017V ?? ""),
    bondFullName: String(raw.BONDNAME ?? ""),
  };
}

function mapStockIssueRecord(raw: CninfoRecord): BondCovStockIssueCninfoRecord {
  return {
    bondCode: String(raw.SECCODE ?? ""),
    bondName: String(raw.SECNAME ?? ""),
    announceDate: parseDate(raw.DECLAREDATE),
    convertCode: String(raw.F001V ?? ""),
    convertShortName: String(raw.F002V ?? ""),
    convertPrice: toNumeric(raw.F003N),
    voluntaryConvertStartDate: parseDate(raw.F004D),
    voluntaryConvertEndDate: parseDate(raw.F005D),
    underlyingStock: String(raw.F017V ?? ""),
    bondFullName: String(raw.BONDNAME ?? ""),
  };
}
