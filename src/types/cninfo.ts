/** 巨潮资讯-可转债发行 (对应 Python: bond_cov_issue_cninfo) */
export interface BondCovIssueCninfoRecord {
  /** 债券代码 */
  bondCode: string;
  /** 债券简称 */
  bondName: string;
  /** 公告日期 (YYYY-MM-DD) */
  announceDate: string | null;
  /** 发行起始日 */
  issueStartDate: string | null;
  /** 发行终止日 */
  issueEndDate: string | null;
  /** 计划发行总量 (亿元) */
  plannedIssueAmount: number | null;
  /** 实际发行总量 (亿元) */
  actualIssueAmount: number | null;
  /** 发行面值 (元) */
  faceValue: number | null;
  /** 发行价格 (元) */
  issuePrice: number | null;
  /** 发行方式 */
  issueMethod: string | null;
  /** 发行对象 */
  issueTarget: string | null;
  /** 发行范围 */
  issueScope: string | null;
  /** 承销方式 */
  underwritingMethod: string | null;
  /** 募资用途说明 */
  fundraisingPurpose: string | null;
  /** 初始转股价格 (元) */
  initialConvertPrice: number | null;
  /** 转股开始日期 */
  convertStartDate: string | null;
  /** 转股终止日期 */
  convertEndDate: string | null;
  /** 网上申购日期 */
  onlineSubscribeDate: string | null;
  /** 网上申购代码 */
  onlineSubscribeCode: string | null;
  /** 网上申购简称 */
  onlineSubscribeShortName: string | null;
  /** 网上申购数量上限 */
  onlineSubscribeMax: number | null;
  /** 网上申购数量下限 */
  onlineSubscribeMin: number | null;
  /** 网上申购单位 */
  onlineSubscribeUnit: number | null;
  /** 网上申购中签结果公告日 */
  onlineBallotPublishDate: string | null;
  /** 优先申购日 */
  prioritySubscribeDate: string | null;
  /** 配售价格 (元) */
  allotmentPrice: number | null;
  /** 债权登记日 */
  rightsRecordDate: string | null;
  /** 优先申购缴款日 */
  priorityPaymentDate: string | null;
  /** 转股代码 */
  convertCode: string | null;
  /** 交易市场 */
  market: string | null;
  /** 债券名称 */
  bondFullName: string | null;
}

/** 巨潮资讯-可转债转股 (对应 Python: bond_cov_stock_issue_cninfo) */
export interface BondCovStockIssueCninfoRecord {
  /** 债券代码 */
  bondCode: string;
  /** 债券简称 */
  bondName: string;
  /** 公告日期 (YYYY-MM-DD) */
  announceDate: string | null;
  /** 转股代码 */
  convertCode: string;
  /** 转股简称 */
  convertShortName: string;
  /** 转股价格 (元) */
  convertPrice: number | null;
  /** 自愿转换期起始日 */
  voluntaryConvertStartDate: string | null;
  /** 自愿转换期终止日 */
  voluntaryConvertEndDate: string | null;
  /** 标的股票 */
  underlyingStock: string;
  /** 债券名称 */
  bondFullName: string;
}
