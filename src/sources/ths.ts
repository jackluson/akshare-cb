/**
 * 同花顺数据源 - 可转债申购/上市数据
 * Data source: https://data.10jqka.com.cn/ipo/kzz/
 * Corresponds to Python: akshare/bond/bond_cb_ths.py
 */
import type { BondZhCovInfoThsRecord } from "../types/ths";
import { THS } from "../urls";
import { parseDate } from "../utils/date";
import { fetchJson } from "../utils/http";
import { toNumeric } from "../utils/numeric";

const THS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
};

interface ThsRawRecord {
  sub_date?: string;
  bond_code?: string;
  bond_nm?: string;
  sub_code?: string;
  original_stock_cd?: string;
  per_share_allocation?: string;
  plan_issue_volume?: string;
  actual_issue_volume?: string;
  draw_pub_date?: string;
  draw_lucky_nm?: string;
  listing_date?: string;
  stock_code?: string;
  stock_nm?: string;
  convert_price?: string;
  maturity_date?: string;
  draw_lucky_rate?: string;
  [key: string]: unknown;
}

/**
 * 同花顺-数据中心-可转债
 * Returns convertible bond IPO and listing data from THS.
 *
 * @returns Array of {@link BondZhCovInfoThsRecord} (16 fields)
 * @throws {@link NetworkError} on HTTP failures
 * @throws {@link ParseError} on JSON parse failures
 * @category 同花顺
 *
 * @example
 * ```typescript
 * const thsData = await bondZhCovInfoThs();
 * console.log(thsData[0].bondCode);
 * ```
 */
export async function bondZhCovInfoThs(): Promise<BondZhCovInfoThsRecord[]> {
  const data = await fetchJson<{ list: ThsRawRecord[] }>(THS.DATA, {
    headers: THS_HEADERS,
  });

  return (data.list ?? []).map(mapThsRecord);
}

function mapThsRecord(raw: ThsRawRecord): BondZhCovInfoThsRecord {
  return {
    bondCode: raw.bond_code ?? "",
    bondName: raw.bond_nm ?? "",
    subscribeDate: parseDate(raw.sub_date),
    subscribeCode: raw.sub_code ?? null,
    allotmentCode: raw.original_stock_cd ?? null,
    allotmentPerShare: toNumeric(raw.per_share_allocation),
    plannedIssueSize: toNumeric(raw.plan_issue_volume),
    actualIssueSize: toNumeric(raw.actual_issue_volume),
    ballotPublishDate: parseDate(raw.draw_pub_date),
    ballotNumber: raw.draw_lucky_nm ?? null,
    listingDate: parseDate(raw.listing_date),
    stockCode: raw.stock_code ?? "",
    stockName: raw.stock_nm ?? "",
    convertPrice: toNumeric(raw.convert_price),
    maturityDate: parseDate(raw.maturity_date),
    winRate: toNumeric(raw.draw_lucky_rate),
  };
}
