/** 东方财富可转债列表查询选项。省略 pageNumber 时自动获取全部分页。 */
export interface BondZhCovOptions {
  /** 仅返回符合现有存续筛选规则的债券，默认 false；指定页码时仅筛选该页 */
  isSurvive?: boolean;
  /** 自动翻页间隔（毫秒），默认每次随机 500–1500 */
  delay?: number;
  /** 每页条数，默认 500 */
  pageSize?: number;
  /** 指定单页（从 1 开始）；省略则获取全部分页 */
  pageNumber?: number;
  /** 东方财富排序字段，逗号分隔，默认 PUBLIC_START_DATE,SECURITY_CODE */
  sortColumns?: string;
  /** 与排序字段逐一对应，-1 降序、1 升序，默认 -1,-1 */
  sortTypes?: string;
  /** 东方财富原生筛选表达式，例如 (SECURITY_CODE="113702") */
  filter?: string;
}

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
  /** 申购上限（千元，ONLINE_GENERAL_AAU 原值；除以 10 为网页展示的万元） */
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
  /** 债现价；行情缺失时沿用兼容默认值 100 */
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
  /** 赎回登记日 (RECORD_DATE_SH)，非原股东配售登记日 */
  recordDateSh: string | null;
  /** 转股截止日期 */
  transferEndDate: string | null;
  /** 带交易所后缀的债券代码 (SECUCODE) */
  securityId: string | null;

  /** 交易市场代码 (TRADE_MARKET) */
  tradeMarket: string | null;

  /** 债券期限（年，源字段 BOND_EXPIRE） (BOND_EXPIRE) */
  bondDuration: number | null;

  /** 起息日 (VALUE_DATE) */
  valueDate: string | null;

  /** 发行年份 (ISSUE_YEAR) */
  issueYear: string | null;

  /** 付息月日（MM-DD） (PAY_INTEREST_DAY) */
  payInterestDay: string | null;

  /** 各年票面利率说明 (INTEREST_RATE_EXPLAIN) */
  interestRateExplain: string | null;

  /** 债券组合代码 (BOND_COMBINE_CODE) */
  bondCombineCode: string | null;

  /** 发行价格 (ISSUE_PRICE) */
  issuePrice: number | null;

  /** 发行说明 (REMARK) */
  remark: string | null;

  /** 票面金额 (PAR_VALUE) */
  parValue: number | null;

  /** 发行对象 (ISSUE_OBJECT) */
  issueObject: string | null;

  /** 赎回类型代码，保留源值 (REDEEM_TYPE) */
  redeemType: string | null;

  /** 回售执行原因代码，保留源值 (EXECUTE_REASON_HS) */
  resaleExecuteReason: string | null;

  /** 回售公告日 (NOTICE_DATE_HS) */
  resaleNoticeDate: string | null;

  /** 赎回公告日 (NOTICE_DATE_SH) */
  redeemNoticeDate: string | null;

  /** 回售执行价格 (EXECUTE_PRICE_HS) */
  resaleExecutePrice: number | null;

  /** 赎回执行价格 (EXECUTE_PRICE_SH) */
  redeemExecutePrice: number | null;

  /** 赎回执行起始日 (EXECUTE_START_DATESH) */
  redeemStartDate: string | null;

  /** 回售执行起始日 (EXECUTE_START_DATEHS) */
  resaleStartDate: string | null;

  /** 执行截止日 (EXECUTE_END_DATE) */
  executeEndDate: string | null;

  /** 申购简称 (CORRECODE_NAME_ABBR) */
  subscribeName: string | null;

  /** 配售代码 (CORRECODEO) */
  allotmentCode: string | null;

  /** 配售简称 (CORRECODE_NAME_ABBRO) */
  allotmentName: string | null;

  /** 初始转股价 (INITIAL_TRANSFER_PRICE) */
  initialConvertPrice: number | null;

  /** 开始转股日 (TRANSFER_START_DATE) */
  convertStartDate: string | null;

  /** 回售条款 (RESALE_CLAUSE) */
  resaleClause: string | null;

  /** 赎回条款 (REDEEM_CLAUSE) */
  redeemClause: string | null;

  /** 评级机构 (PARTY_NAME) */
  ratingAgency: string | null;

  /** 正股行情价格备用字段，保留源值 (CONVERT_STOCK_PRICEHQ) */
  stockPriceHq: number | null;

  /** 行情市场标识，保留源值 (MARKET) */
  market: string | null;

  /** 回售触发价 (RESALE_TRIG_PRICE) */
  resaleTriggerPrice: number | null;

  /** 强赎触发价 (REDEEM_TRIG_PRICE) */
  redeemTriggerPrice: number | null;

  /** 正股市净率 (PBV_RATIO) */
  pbRatio: number | null;

  /** 本期计息开始日 (IB_START_DATE) */
  interestBeginDate: string | null;

  /** 本期计息结束日 (IB_END_DATE) */
  interestEndDate: string | null;

  /** 现金流支付日 (CASHFLOW_DATE) */
  cashflowDate: string | null;

  /** 本期票面利率（%） (COUPON_IR) */
  couponRate: number | null;

  /** 发行方式说明 (PARAM_NAME) */
  issueTypeName: string | null;

  /** 发行方式代码，保留逗号分隔源值 (ISSUE_TYPE) */
  issueType: string | null;

  /** 赎回执行原因代码，保留源值 (EXECUTE_REASON_SH) */
  redeemExecuteReason: string | null;

  /** 付息日备用字段，保留源值 (PAYDAYNEW) */
  paydayNew: string | null;

  /** 债券价格备用字段，保留源值 (CURRENT_BOND_PRICENEW) */
  bondPriceNew: number | null;

  /** 转股标识，保留源值（是/否） (IS_CONVERT_STOCK) */
  isConvertStock: string | null;

  /** 赎回标识，保留源值（是/否），不用于判断当前强赎状态 (IS_REDEEM) */
  isRedeem: string | null;

  /** 回售标识，保留源值（是/否），不用于判断当前回售状态 (IS_SELLBACK) */
  isSellback: string | null;

  /** 首日收益源值（FIRST_PROFIT） (FIRST_PROFIT) */
  firstProfit: number | null;

  /** 申购日期时间（YYYY-MM-DD HH:mm:ss，保留源时间） (PUBLIC_START_DATE_HOURS) */
  subscribeDateTime: string | null;
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
