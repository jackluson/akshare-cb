/** 同花顺-可转债申购数据 (对应 Python: bond_zh_cov_info_ths) */
export interface BondZhCovInfoThsRecord {
  /** 债券代码 */
  bondCode: string;
  /** 债券简称 */
  bondName: string;
  /** 申购日期 (YYYY-MM-DD) */
  subscribeDate: string | null;
  /** 申购代码 */
  subscribeCode: string | null;
  /** 原股东配售码 */
  allotmentCode: string | null;
  /** 每股获配额 */
  allotmentPerShare: number | null;
  /** 计划发行量 (亿元) */
  plannedIssueSize: number | null;
  /** 实际发行量 (亿元) */
  actualIssueSize: number | null;
  /** 中签公布日 (YYYY-MM-DD) */
  ballotPublishDate: string | null;
  /** 中签号 */
  ballotNumber: string | null;
  /** 上市日期 (YYYY-MM-DD) */
  listingDate: string | null;
  /** 正股代码 */
  stockCode: string;
  /** 正股简称 */
  stockName: string;
  /** 转股价格 */
  convertPrice: number | null;
  /** 到期时间 (YYYY-MM-DD) */
  maturityDate: string | null;
  /** 中签率 (%) */
  winRate: number | null;
}
