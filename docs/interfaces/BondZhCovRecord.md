[**akshare-cb v0.4.0**](../README.md)

***

[akshare-cb](../globals.md) / BondZhCovRecord

# Interface: BondZhCovRecord

Defined in: [src/types/eastmoney.ts:20](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L20)

东方财富-可转债列表 (对应 Python: bond_zh_cov)

## Properties

### allotmentCode

> **allotmentCode**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:137](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L137)

配售代码 (CORRECODEO)

***

### allotmentDate

> **allotmentDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:46](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L46)

原股东配售-股权登记日

***

### allotmentName

> **allotmentName**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:140](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L140)

配售简称 (CORRECODE_NAME_ABBRO)

***

### allotmentPerShare

> **allotmentPerShare**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:48](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L48)

原股东配售-每股配售额

***

### ballotDate

> **ballotDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:52](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L52)

中签号发布日

***

### bondCode

> **bondCode**: `string`

Defined in: [src/types/eastmoney.ts:22](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L22)

债券代码

***

### bondCombineCode

> **bondCombineCode**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:92](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L92)

债券组合代码 (BOND_COMBINE_CODE)

***

### bondDuration

> **bondDuration**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:77](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L77)

债券期限（年，源字段 BOND_EXPIRE） (BOND_EXPIRE)

***

### bondName

> **bondName**: `string`

Defined in: [src/types/eastmoney.ts:24](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L24)

债券简称

***

### bondPrice

> **bondPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:42](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L42)

债现价；行情缺失时沿用兼容默认值 100

***

### bondPriceNew

> **bondPriceNew**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:197](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L197)

债券价格备用字段，保留源值 (CURRENT_BOND_PRICENEW)

***

### cashflowDate

> **cashflowDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:179](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L179)

现金流支付日 (CASHFLOW_DATE)

***

### ceaseDate

> **ceaseDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:65](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L65)

停止交易日期 (YYYY-MM-DD)

***

### convertPremiumRate

> **convertPremiumRate**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:44](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L44)

转股溢价率 (%)

***

### convertPrice

> **convertPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:38](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L38)

转股价

***

### convertStartDate

> **convertStartDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:146](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L146)

开始转股日 (TRANSFER_START_DATE)

***

### convertValue

> **convertValue**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:40](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L40)

转股价值

***

### couponRate

> **couponRate**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:182](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L182)

本期票面利率（%） (COUPON_IR)

***

### creditRating

> **creditRating**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:58](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L58)

信用评级

***

### delistDate

> **delistDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:61](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L61)

退市日期 (YYYY-MM-DD)

***

### executeEndDate

> **executeEndDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:131](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L131)

执行截止日 (EXECUTE_END_DATE)

***

### expireDate

> **expireDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:63](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L63)

到期日期 (YYYY-MM-DD)

***

### firstProfit

> **firstProfit**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:209](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L209)

首日收益源值（FIRST_PROFIT） (FIRST_PROFIT)

***

### initialConvertPrice

> **initialConvertPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:143](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L143)

初始转股价 (INITIAL_TRANSFER_PRICE)

***

### interestBeginDate

> **interestBeginDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:173](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L173)

本期计息开始日 (IB_START_DATE)

***

### interestEndDate

> **interestEndDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:176](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L176)

本期计息结束日 (IB_END_DATE)

***

### interestRateExplain

> **interestRateExplain**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:89](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L89)

各年票面利率说明 (INTEREST_RATE_EXPLAIN)

***

### isConvertStock

> **isConvertStock**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:200](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L200)

转股标识，保留源值（是/否） (IS_CONVERT_STOCK)

***

### isRedeem

> **isRedeem**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:203](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L203)

赎回标识，保留源值（是/否），不用于判断当前强赎状态 (IS_REDEEM)

***

### isSellback

> **isSellback**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:206](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L206)

回售标识，保留源值（是/否），不用于判断当前回售状态 (IS_SELLBACK)

***

### issueObject

> **issueObject**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:104](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L104)

发行对象 (ISSUE_OBJECT)

***

### issuePrice

> **issuePrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:95](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L95)

发行价格 (ISSUE_PRICE)

***

### issueSize

> **issueSize**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:50](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L50)

发行规模 (亿元)

***

### issueType

> **issueType**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:188](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L188)

发行方式代码，保留逗号分隔源值 (ISSUE_TYPE)

***

### issueTypeName

> **issueTypeName**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:185](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L185)

发行方式说明 (PARAM_NAME)

***

### issueYear

> **issueYear**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:83](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L83)

发行年份 (ISSUE_YEAR)

***

### listingDate

> **listingDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:56](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L56)

上市时间 (YYYY-MM-DD)

***

### market

> **market**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:161](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L161)

行情市场标识，保留源值 (MARKET)

***

### parValue

> **parValue**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:101](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L101)

票面金额 (PAR_VALUE)

***

### paydayNew

> **paydayNew**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:194](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L194)

付息日备用字段，保留源值 (PAYDAYNEW)

***

### payInterestDay

> **payInterestDay**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:86](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L86)

付息月日（MM-DD） (PAY_INTEREST_DAY)

***

### pbRatio

> **pbRatio**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:170](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L170)

正股市净率 (PBV_RATIO)

***

### ratingAgency

> **ratingAgency**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:155](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L155)

评级机构 (PARTY_NAME)

***

### recordDateSh

> **recordDateSh**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:67](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L67)

赎回登记日 (RECORD_DATE_SH)，非原股东配售登记日

***

### redeemClause

> **redeemClause**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:152](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L152)

赎回条款 (REDEEM_CLAUSE)

***

### redeemExecutePrice

> **redeemExecutePrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:122](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L122)

赎回执行价格 (EXECUTE_PRICE_SH)

***

### redeemExecuteReason

> **redeemExecuteReason**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:191](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L191)

赎回执行原因代码，保留源值 (EXECUTE_REASON_SH)

***

### redeemNoticeDate

> **redeemNoticeDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:116](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L116)

赎回公告日 (NOTICE_DATE_SH)

***

### redeemStartDate

> **redeemStartDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:125](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L125)

赎回执行起始日 (EXECUTE_START_DATESH)

***

### redeemTriggerPrice

> **redeemTriggerPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:167](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L167)

强赎触发价 (REDEEM_TRIG_PRICE)

***

### redeemType

> **redeemType**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:107](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L107)

赎回类型代码，保留源值 (REDEEM_TYPE)

***

### remark

> **remark**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:98](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L98)

发行说明 (REMARK)

***

### resaleClause

> **resaleClause**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:149](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L149)

回售条款 (RESALE_CLAUSE)

***

### resaleExecutePrice

> **resaleExecutePrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:119](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L119)

回售执行价格 (EXECUTE_PRICE_HS)

***

### resaleExecuteReason

> **resaleExecuteReason**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:110](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L110)

回售执行原因代码，保留源值 (EXECUTE_REASON_HS)

***

### resaleNoticeDate

> **resaleNoticeDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:113](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L113)

回售公告日 (NOTICE_DATE_HS)

***

### resaleStartDate

> **resaleStartDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:128](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L128)

回售执行起始日 (EXECUTE_START_DATEHS)

***

### resaleTriggerPrice

> **resaleTriggerPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:164](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L164)

回售触发价 (RESALE_TRIG_PRICE)

***

### securityId

> **securityId**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:71](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L71)

带交易所后缀的债券代码 (SECUCODE)

***

### stockCode

> **stockCode**: `string`

Defined in: [src/types/eastmoney.ts:32](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L32)

正股代码

***

### stockName

> **stockName**: `string`

Defined in: [src/types/eastmoney.ts:34](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L34)

正股简称

***

### stockPrice

> **stockPrice**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:36](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L36)

正股价

***

### stockPriceHq

> **stockPriceHq**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:158](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L158)

正股行情价格备用字段，保留源值 (CONVERT_STOCK_PRICEHQ)

***

### subscribeCode

> **subscribeCode**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:28](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L28)

申购代码

***

### subscribeDate

> **subscribeDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:26](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L26)

申购日期 (YYYY-MM-DD)

***

### subscribeDateTime

> **subscribeDateTime**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:212](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L212)

申购日期时间（YYYY-MM-DD HH:mm:ss，保留源时间） (PUBLIC_START_DATE_HOURS)

***

### subscribeLimit

> **subscribeLimit**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:30](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L30)

申购上限（千元，ONLINE_GENERAL_AAU 原值；除以 10 为网页展示的万元）

***

### subscribeName

> **subscribeName**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:134](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L134)

申购简称 (CORRECODE_NAME_ABBR)

***

### tradeMarket

> **tradeMarket**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:74](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L74)

交易市场代码 (TRADE_MARKET)

***

### transferEndDate

> **transferEndDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:69](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L69)

转股截止日期

***

### valueDate

> **valueDate**: `string` \| `null`

Defined in: [src/types/eastmoney.ts:80](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L80)

起息日 (VALUE_DATE)

***

### winRate

> **winRate**: `number` \| `null`

Defined in: [src/types/eastmoney.ts:54](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L54)

中签率 (%)
