/** 集思录-可转债等权指数 (对应 Python: bond_cb_index_jsl) */
export interface BondCbIndexJslRecordRaw {
  // [key: string]: unknown;
  price_dt: string[];
  price: string[];
  amount: number[];
  volume: number[];
  count: number[];
  increase_val: number[];
  increase_rt: number[];
  avg_price: number[];
  mid_price: number[];
  mid_convert_value: number[];
  avg_dblow: number[];
  avg_premium_rt: number[];
  mid_premium_rt: number[];
  avg_ytm_rt: number[];
  temperature: number[];
  turnover_rt: number[];
  price_90: number[];
  price_90_100: number[];
  price_100_110: number[];
  price_110_120: number[];
  price_120_130: number[];
  price_130: number[];
  idx_price: number[];
  increase_rt_90: number[];
  increase_rt_90_100: number[];
  increase_rt_100_110: number[];
  increase_rt_110_120: number[];
  increase_rt_120_130: number[];
  increase_rt_130: number[];
  idx_increase_rt: number[];
}

export interface BondCbIndexJslRecord {
  price_dt: string;
  price: number | null;
  amount: number | null;
  volume: number | null;
  count: number | null;
  increase_val: number | null;
  increase_rt: number | null;
  avg_price: number | null;
  mid_price: number | null;
  mid_convert_value: number | null;
  avg_dblow: number | null;
  avg_premium_rt: number | null;
  mid_premium_rt: number | null;
  avg_ytm_rt: number | null;
  temperature: number | null;
  turnover_rt: number | null;
  price_90: number | null;
  price_90_100: number | null;
  price_100_110: number | null;
  price_110_120: number | null;
  price_120_130: number | null;
  price_130: number | null;
  idx_price: number | null;
  increase_rt_90: number | null;
  increase_rt_90_100: number | null;
  increase_rt_100_110: number | null;
  increase_rt_110_120: number | null;
  increase_rt_120_130: number | null;
  increase_rt_130: number | null;
  idx_increase_rt: number | null;
}

/** 集思录-可转债列表 (对应 Python: bond_cb_jsl) */
export interface BondCbJslRecord {
  /** 代码 */
  bondCode: string;
  /** 转债名称 */
  bondName: string;
  /** 现价 */
  price: number | null;
  /** 涨跌幅 (%) */
  changeRate: number | null;
  /** 正股代码 */
  stockCode: string;
  /** 正股名称 */
  stockName: string;
  /** 正股价 */
  stockPrice: number | null;
  /** 正股涨跌 (%) */
  stockChangeRate: number | null;
  /** 正股PB */
  stockPB: number | null;
  /** 转股价 */
  convertPrice: number | null;
  /** 转股价值 */
  convertValue: number | null;
  /** 转股溢价率 (%) */
  convertPremiumRate: number | null;
  /** 债券评级 */
  rating: string | null;
  /** 回售触发价 */
  resaleTriggerPrice: number | null;
  /** 强赎触发价 */
  redeemTriggerPrice: number | null;
  /** 转债占比 (%) */
  bondRatio: number | null;
  /** 到期时间 */
  maturityDate: string | null;
  /** 剩余年限 */
  remainingYears: number | null;
  /** 剩余规模 (亿元) */
  remainingSize: number | null;
  /** 成交额 (万元) */
  turnover: number | null;
  /** 换手率 (%) */
  turnoverRate: number | null;
  /** 到期税前收益 (%) */
  ytm: number | null;
  /** 双低 */
  doubleLow: number | null;
}

/** 强赎状态枚举 */
export type RedeemStatus = "已公告强赎" | "公告要强赎" | "公告不强赎" | "已满足强赎条件" | "";

/** 集思录-可转债强赎 (对应 Python: bond_cb_redeem_jsl) */
export interface BondCbRedeemJslRecord {
  /** 代码 */
  bondCode: string;
  /** 名称 */
  bondName: string;
  /** 现价 */
  price: number | null;
  /** 正股代码 */
  stockCode: string;
  /** 正股名称 */
  stockName: string;
  /** 规模 (亿元) */
  totalSize: number | null;
  /** 剩余规模 (亿元) */
  remainingSize: number | null;
  /** 转股起始日 */
  convertStartDate: string | null;
  /** 最后交易日 */
  lastTradeDate: string | null;
  /** 到期日 */
  maturityDate: string | null;
  /** 转股价 */
  convertPrice: number | null;
  /** 强赎触发比 (%) */
  redeemTriggerRatio: number | null;
  /** 强赎触发价 */
  redeemTriggerPrice: number | null;
  /** 正股价 */
  stockPrice: number | null;
  /** 强赎价 */
  redeemPrice: number | null;
  /** 强赎天计数 */
  redeemDayCount: string | null;
  /** 强赎条款 */
  redeemClause: string | null;
  /** 强赎状态 */
  redeemStatus: RedeemStatus;
}

/** 集思录-转股价调整记录 (对应 Python: bond_cb_adj_logs_jsl) */
export interface BondCbAdjLogsJslRecord {
  /** 下修前转股价 */
  beforePrice: number | null;
  /** 下修后转股价 */
  afterPrice: number | null;
  /** 下修底价 */
  bottomPrice: number | null;
  /** 股东大会日 */
  meetingDate: string | null;
  /** 新转股价生效日期 */
  effectiveDate: string | null;
}
