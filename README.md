# akshare-cb

[English](./README-EN.md)

TypeScript/Node.js 可转债数据接口库。用 TypeScript 重写了 Python [akshare](https://github.com/akfamily/akshare) 库中的可转债相关接口，提供 **17 个函数**，覆盖 **5 个数据源**。

> [雪球网数据增强助手，专为可转债投资者服务](https://anchor-data.cn/snowball-enhanced)

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
pnpm docs
# 然后查看 docs/ 目录下的 Markdown 文件
```

[查看 API 文档 →](https://github.com/jackluson/akshare-cb/blob/main/docs/globals.md)

### 函数概览

| 数据源       | 函数                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **东方财富** | `bondZhCov`, `bondCovComparison`, `bondZhCovInfo`, `bondCovValueAnalysis`, `bondZhHsCovMin`, `bondZhHsCovPreMin` |
| **新浪财经** | `bondZhHsCovSpot`, `bondZhHsCovDaily`, `bondCbProfileSina`, `bondCbSummarySina`                                  |
| **集思录**   | `bondCbIndexJsl`, `bondCbJsl`, `bondCbRedeemJsl`, `bondCbAdjLogsJsl`                                             |
| **同花顺**   | `bondZhCovInfoThs`                                                                                               |
| **巨潮资讯** | `bondCovIssueCninfo`, `bondCovStockIssueCninfo`                                                                  |

## 全局配置

使用 `configure()` 在调用业务 API 前统一设置请求头、超时、重试和 hooks。可多次调用，每次合并上一次配置。

```typescript
import { configure, bondZhCov } from 'akshare-cb';

configure({
  headers: { 'User-Agent': 'my-app/1.0' },
  timeout: 30_000,
  retry: { limit: 5 },
});

const bonds = await bondZhCov();
```

### 配置项 (`AkshareCbConfig`)

| 参数       | 类型                         | 说明                                       |
| ---------- | ---------------------------- | ------------------------------------------ |
| `headers`  | `Record<string, string>`     | 自定义请求头，与默认头合并                 |
| `timeout`  | `number`                     | 请求超时时间（毫秒），默认 `60_000`        |
| `retry`    | `{ limit?: number }`         | 重试次数，默认 `3`                         |
| `hooks`    | 见下方                       | ky hooks，用于拦截请求/响应                |

### Hooks 示例

```typescript
import { configure } from 'akshare-cb';
import UserAgent from 'user-agents';

const ua = new UserAgent();

configure({
  headers: { 'User-Agent': ua.toString() },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        console.log(`→ ${request.method} ${request.url}`);
      },
    ],
    afterResponse: [
      ({ response }) => {
        console.log(`← ${response.status} ${response.url}`);
        return response;
      },
    ],
  },
});
```

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
pnpm docs

# 运行全部检查
pnpm run check
```

## 许可证

MIT

