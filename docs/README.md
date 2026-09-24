**akshare-cb v0.1.0**

***

# akshare-cb

[English](_media/README-EN.md)

TypeScript/Node.js 可转债数据接口库。用 TypeScript 重写了 Python [akshare](https://github.com/akfamily/akshare) 库中的可转债相关接口，提供 **17 个函数**，覆盖 **5 个数据源**。

## 安装

```bash
pnpm add akshare-cb
# 或
npm install akshare-cb
```

需要 Node.js >= 22。

## 快速开始

```typescript
import { bondZhCov, bondCbIndexJsl, bondZhCovInfoThs } from 'akshare-cb';

// 东方财富-可转债列表
const bonds = await bondZhCov();
console.log(bonds[0]);
// { bondCode: "127100", bondName: "兴蓉转债", stockCode: "000596", ... }

// 集思录-可转债等权指数
const index = await bondCbIndexJsl();
console.log(index.price_dt[0]);

// 同花顺-可转债申购数据
const thsData = await bondZhCovInfoThs();
console.log(thsData[0]);
```

## API 文档

完整的 API 文档（参数说明、返回类型、使用示例）从源码 JSDoc 注释自动生成，使用 [TypeDoc](https://typedoc.org/)。

本地生成文档：

```bash
pnpm run docs
# 然后在编辑器中查看 docs/ 目录下的 Markdown 文件
```

### 函数概览

| 数据源       | 函数                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **东方财富** | `bondZhCov`, `bondCovComparison`, `bondZhCovInfo`, `bondCovValueAnalysis`, `bondZhHsCovMin`, `bondZhHsCovPreMin` |
| **新浪财经** | `bondZhHsCovSpot`, `bondZhHsCovDaily`, `bondCbProfileSina`, `bondCbSummarySina`                                  |
| **集思录**   | `bondCbIndexJsl`, `bondCbJsl`, `bondCbRedeemJsl`, `bondCbAdjLogsJsl`                                             |
| **同花顺**   | `bondZhCovInfoThs`                                                                                               |
| **巨潮资讯** | `bondCovIssueCninfo`, `bondCovStockIssueCninfo`                                                                  |

## 可转债列表查询 (`bondZhCov`)

```typescript
// 对应 curl：每页 50 条，只获取第 2 页
const page = await bondZhCov({ pageSize: 50, pageNumber: 2 });
// 不传 pageNumber 时自动获取全部分页
const bonds = await bondZhCov({ isSurvive: true, pageSize: 500, delay: 500 });
// 原调用方式继续有效
const surviving = await bondZhCov(true, 500);
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `isSurvive` | `false` | 应用现有存续筛选规则；指定页码时仅筛选该页 |
| `delay` | 随机 500–1500 | 自动翻页间隔，毫秒 |
| `pageSize` | `500` | 每页条数，正整数 |
| `pageNumber` | 未指定 | 正整数；指定时仅返回该页，否则从第 1 页取完全部数据 |
| `sortColumns` | `PUBLIC_START_DATE,SECURITY_CODE` | 东方财富排序字段，逗号分隔 |
| `sortTypes` | `-1,-1` | 与排序字段逐一对应；`-1` 降序，`1` 升序 |
| `filter` | 未指定 | 东方财富原生筛选表达式，例如 `(SECURITY_CODE="113702")` |

请求固定使用 `reportName=RPT_BOND_CB_LIST`、`columns=ALL`、8 个 `quoteColumns` 行情字段、`quoteType=0` 和 `source=client=WEB`。省略浏览器 JSONP `callback`，直接读取 JSON；无需复制 curl 中的 Cookie。

返回的 `BondZhCovRecord` 包含 72 个字段，完整说明见 [返回字段文档](interfaces/BondZhCovRecord.md)。新增字段包括 `resaleTriggerPrice`（回售触发价）、`redeemTriggerPrice`（强赎触发价）、`pbRatio`（正股市净率）、`couponRate`（本期票息）、`convertStartDate`、赎回/回售条款及执行信息。

现有字段已适配实际响应：`CORRECODE → subscribeCode`、`SECURITY_SHORT_NAME → stockName`、`ACTUAL_ISSUE_SCALE → issueSize`、`SECURITY_START_DATE → allotmentDate`、`FIRST_PER_PREPLACING → allotmentPerShare`、`BOND_START_DATE → ballotDate`、`ONLINE_GENERAL_LWR → winRate`，同时保留旧源字段名兼容。

`ONLINE_GENERAL_AAU → subscribeLimit` 保留接口原值，单位为**千元**（东方财富网页除以 10 后显示万元）；`recordDateSh` 是**赎回登记日**。新增字段缺失时为 `null`；日期统一为 `YYYY-MM-DD`，`subscribeDateTime` 保留源日期时间。`isRedeem` / `isSellback` 保留源字符串，不代表当前强赎或回售状态。`bondPrice` 缺失时仍沿用旧行为返回 `100`。


## 错误处理

所有错误均继承自 `AkshareError`（基类包含 `message` + `code`）。

```typescript
import {
    AkshareError,
    NetworkError,
    ParseError,
    ValidationError,
    AuthenticationError,
} from 'akshare-cb';

try {
    const data = await bondCovIssueCninfo('2024-01-01', '2024-12-31');
} catch (err) {
    if (err instanceof NetworkError) {
        console.error(`网络错误 (HTTP ${err.statusCode}): ${err.message}`);
    } else if (err instanceof ParseError) {
        console.error(`解析错误: ${err.message}`);
    } else if (err instanceof AuthenticationError) {
        console.error(`认证错误: ${err.message}`);
    }
}
```

## 类型定义

所有返回类型均有完整的 TypeScript 类型定义，按需导入即可：

```typescript
import type {
    BondZhCovRecord,
    BondCovComparisonRecord,
    BondCovValueAnalysisRecord,
    BondCovMinRecord,
    BondCbProfileItem,
    BondCbSummaryItem,
    BondCbIndexJslRecord,
    BondCbJslRecord,
    BondCbRedeemJslRecord,
    RedeemStatus,
    BondCbAdjLogsJslRecord,
    BondZhCovInfoThsRecord,
    BondCovIssueCninfoRecord,
    BondCovStockIssueCninfoRecord,
} from 'akshare-cb';
```

## 开发

```bash
# 安装依赖
pnpm install

# 运行测试 (111 个测试: 48 工具函数 + 63 数据源)
pnpm test

# 类型检查
pnpm run typecheck

# 代码检查 + 格式化 (biome)
pnpm run lint

# 生成 API 文档
pnpm run docs

# 运行全部检查
pnpm run check
```

## 许可证

MIT
