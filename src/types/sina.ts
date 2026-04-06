/** 新浪-沪深可转债实时行情 (对应 Python: bond_zh_hs_cov_spot) */
export interface BondCovSpotRecord {
  [key: string]: unknown;
}

/** 新浪-可转债历史日线 (对应 Python: bond_zh_hs_cov_daily) */
export interface BondCovDailyRecord {
  /** 日期 */
  date: string;
  /** 开盘价 */
  open: number | null;
  /** 最高价 */
  high: number | null;
  /** 收盘价 */
  close: number | null;
  /** 最低价 */
  low: number | null;
  /** 成交量 */
  volume: number | null;
}

/** 新浪-可转债详情资料 (对应 Python: bond_cb_profile_sina) */
export interface BondCbProfileItem {
  /** 项目名 */
  item: string;
  /** 项目值 */
  value: string;
}

/** 新浪-可转债概况摘要 (对应 Python: bond_cb_summary_sina) */
export type BondCbSummaryItem = BondCbProfileItem;
