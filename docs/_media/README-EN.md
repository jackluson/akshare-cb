# akshare-cb

[中文文档](./README.md)

TypeScript/Node.js library for Chinese convertible bond (可转债) data. Re-implements the convertible bond interfaces from the Python [akshare](https://github.com/akfamily/akshare) library, providing **17 functions** across **5 data sources**.

## Installation

```bash
pnpm add akshare-cb
# or
npm install akshare-cb
```

Requires Node.js >= 22.

## Quick Start

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

## API Reference

Full API documentation with parameter details, return types, and examples is auto-generated from source code JSDoc annotations using [TypeDoc](https://typedoc.org/).

To generate the docs locally:

```bash
pnpm run docs
# Then open docs/index.html in your browser
```

### Function Overview

| Data Source               | Functions                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **东方财富** (East Money) | `bondZhCov`, `bondCovComparison`, `bondZhCovInfo`, `bondCovValueAnalysis`, `bondZhHsCovMin`, `bondZhHsCovPreMin` |
| **新浪财经** (Sina)       | `bondZhHsCovSpot`, `bondZhHsCovDaily`, `bondCbProfileSina`, `bondCbSummarySina`                                  |
| **集思录** (Jisilu)       | `bondCbIndexJsl`, `bondCbJsl`, `bondCbRedeemJsl`, `bondCbAdjLogsJsl`                                             |
| **同花顺** (THS)          | `bondZhCovInfoThs`                                                                                               |
| **巨潮资讯** (cninfo)     | `bondCovIssueCninfo`, `bondCovStockIssueCninfo`                                                                  |

## Convertible bond list options (`bondZhCov`)

```typescript
// Fetch only page 2, matching the supplied curl request
const page = await bondZhCov({ pageSize: 50, pageNumber: 2 });
// Omit pageNumber to fetch every page
const bonds = await bondZhCov({ isSurvive: true, pageSize: 500, delay: 500 });
// Legacy calls remain supported
const surviving = await bondZhCov(true, 500);
```

| Option | Default | Description |
| --- | --- | --- |
| `isSurvive` | `false` | Apply existing survival filters; scoped to the selected page if specified |
| `delay` | Random 500–1500 | Delay between pages in milliseconds |
| `pageSize` | `500` | Positive integer page size |
| `pageNumber` | Omitted | Fetch only this page when specified; otherwise fetch all pages from page 1 |
| `sortColumns` | `PUBLIC_START_DATE,SECURITY_CODE` | Comma-separated East Money sort fields |
| `sortTypes` | `-1,-1` | One direction per field: `-1` descending, `1` ascending |
| `filter` | Omitted | Native filter expression, e.g. `(SECURITY_CODE="113702")` |

Requests use `RPT_BOND_CB_LIST`, `columns=ALL`, all eight quote columns, `quoteType=0`, and `source=client=WEB`. JSONP callbacks and browser cookies are unnecessary.

`BondZhCovRecord` now exposes 72 fields; see the [field reference](../interfaces/BondZhCovRecord.md). Additions include resale/redemption trigger prices, PB ratio, coupon rate, conversion start date, terms, and execution details. Existing subscription, stock name, issue size, allotment and ballot fields now map to the actual upstream names, with legacy aliases retained.

`subscribeLimit` preserves `ONLINE_GENERAL_AAU` in **thousand CNY** (divide by 10 for the website's ten-thousand-CNY display). `recordDateSh` is the **redemption record date**. Missing new fields return `null`; dates use `YYYY-MM-DD`, while `subscribeDateTime` preserves the upstream date and time. Source flags `isRedeem` / `isSellback` do not indicate current redemption/resale status. Missing `bondPrice` retains the legacy fallback of `100`.


## Error Handling

All errors extend from `AkshareError` (base class with `message` + `code`).

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
        console.error(`Network error (HTTP ${err.statusCode}): ${err.message}`);
    } else if (err instanceof ParseError) {
        console.error(`Parse error: ${err.message}`);
    } else if (err instanceof AuthenticationError) {
        console.error(`Auth error: ${err.message}`);
    }
}
```

## Type Definitions

All return types are fully typed. Import them as needed:

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

## Development

```bash
# Install dependencies
pnpm install

# Run tests (111 tests: 48 utility + 63 source)
pnpm test

# Type checking
pnpm run typecheck

# Lint + format (biome)
pnpm run lint

# Generate API docs
pnpm run docs

# Run all checks
pnpm run check
```

## License

MIT

