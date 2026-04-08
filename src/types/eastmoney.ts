/** 东方财富-可转债列表 (对应 Python: bond_zh_cov) */
export interface BondZhCovRecord {
  /** 债券代码 */
  bondCode: string;
  /** 债券简称 */
  bondName: string;
  /** 申购日期 (YYYY-MM-DD) */
  subscribeDate: string | null;
  /** 申购代码 */
  subscribeCode: string | null;
  /** 申购上限 (万张) */
  subscribeLimit: number | null;
  /** 正股代码 */
  stockCode: string;
  /** 正股简称 */
  stockName: string;
  /** 正股价 */
  stockPrice: number | null;
  /** 转股价 */
  convertPrice: number | null;
  /** 转股价值 */
  convertValue: number | null;
  /** 债现价 */
  bondPrice: number | null;
  /** 转股溢价率 (%) */
  convertPremiumRate: number | null;
  /** 原股东配售-股权登记日 */
  allotmentDate: string | null;
  /** 原股东配售-每股配售额 */
  allotmentPerShare: number | null;
  /** 发行规模 (亿元) */
  issueSize: number | null;
  /** 中签号发布日 */
  ballotDate: string | null;
  /** 中签率 (%) */
  winRate: number | null;
  /** 上市时间 (YYYY-MM-DD) */
  listingDate: string | null;
  /** 信用评级 */
  creditRating: string | null;

  /** 退市日期 (YYYY-MM-DD) */
  delistDate: string | null;
  /** 到期日期 (YYYY-MM-DD) */
  expireDate: string | null;
  /** 停止交易日期 (YYYY-MM-DD) */
  ceaseDate: string | null;
  /** 股东配售股权登记日 */
  recordDateSh: string | null;
  /** 转股截止日期 */
  transferEndDate: string | null;
}

/** 东方财富-可转债比价表 (对应 Python: bond_cov_comparison) */
export interface BondCovComparisonRecord {
  /** 序号 */
  index: number;
  /** 转债代码 */
  bondCode: string;
  /** 转债名称 */
  bondName: string;
  /** 转债最新价 */
  bondPrice: number | null;
  /** 转债涨跌幅 (%) */
  bondChangeRate: number | null;
  /** 正股代码 */
  stockCode: string;
  /** 正股名称 */
  stockName: string;
  /** 正股最新价 */
  stockPrice: number | null;
  /** 正股涨跌幅 (%) */
  stockChangeRate: number | null;
  /** 转股价 */
  convertPrice: number | null;
  /** 转股价值 */
  convertValue: number | null;
  /** 转股溢价率 (%) */
  convertPremiumRate: number | null;
  /** 纯债溢价率 (%) */
  bondPurePremiumRate: number | null;
  /** 回售触发价 */
  resaleTriggerPrice: number | null;
  /** 强赎触发价 */
  redeemTriggerPrice: number | null;
  /** 到期赎回价 */
  maturityRedeemPrice: number | null;
  /** 纯债价值 */
  pureBondValue: number | null;
  /** 开始转股日 */
  convertStartDate: string | null;
  /** 上市日期 */
  listingDate: string | null;
  /** 申购日期 */
  subscribeDate: string | null;
  /** 发行起始 */
  issueStartDate: string | null;
}

/** bondZhCovInfo indicator 类型 */
export type BondCovInfoIndicator = "basic" | "ballot" | "fundraising" | "dates";

/** 东方财富-可转债详情-基本信息 (对应 Python: bond_zh_cov_info indicator="基本信息") */
export interface BondCovInfoBasicRecord {
  [key: string]: unknown;
}

/** 东方财富-可转债价值分析 (对应 Python: bond_zh_cov_value_analysis) */
export interface BondCovValueAnalysisRecord {
  /** 日期 */
  date: string;
  /** 收盘价 */
  closePrice: number | null;
  /** 纯债价值 */
  pureBondValue: number | null;
  /** 转股价值 */
  convertValue: number | null;
  /** 纯债溢价率 (%) */
  bondPremiumRate: number | null;
  /** 转股溢价率 (%) */
  convertPremiumRate: number | null;
}

/** 东方财富-可转债分钟线 (对应 Python: bond_zh_hs_cov_min) */
export interface BondCovMinRecord {
  /** 时间 */
  time: string;
  /** 开盘 */
  open: number | null;
  /** 收盘 */
  close: number | null;
  /** 最高 */
  high: number | null;
  /** 最低 */
  low: number | null;
  /** 成交量 */
  volume: number | null;
  /** 成交额 */
  amount: number | null;
  /** 振幅 (仅 5/15/30/60 分钟) */
  amplitude?: number | null;
  /** 涨跌幅 (仅 5/15/30/60 分钟) */
  changeRate?: number | null;
  /** 涨跌额 (仅 5/15/30/60 分钟) */
  changeAmount?: number | null;
  /** 换手率 (仅 5/15/30/60 分钟) */
  turnoverRate?: number | null;
}
