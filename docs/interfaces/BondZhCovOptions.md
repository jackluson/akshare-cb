[**akshare-cb v0.4.0**](../README.md)

***

[akshare-cb](../globals.md) / BondZhCovOptions

# Interface: BondZhCovOptions

Defined in: [src/types/eastmoney.ts:2](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L2)

东方财富可转债列表查询选项。省略 pageNumber 时自动获取全部分页。

## Properties

### delay?

> `optional` **delay?**: `number`

Defined in: [src/types/eastmoney.ts:6](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L6)

自动翻页间隔（毫秒），默认每次随机 500–1500

***

### filter?

> `optional` **filter?**: `string`

Defined in: [src/types/eastmoney.ts:16](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L16)

东方财富原生筛选表达式，例如 (SECURITY_CODE="113702")

***

### isSurvive?

> `optional` **isSurvive?**: `boolean`

Defined in: [src/types/eastmoney.ts:4](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L4)

仅返回符合现有存续筛选规则的债券，默认 false；指定页码时仅筛选该页

***

### pageNumber?

> `optional` **pageNumber?**: `number`

Defined in: [src/types/eastmoney.ts:10](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L10)

指定单页（从 1 开始）；省略则获取全部分页

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/types/eastmoney.ts:8](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L8)

每页条数，默认 500

***

### sortColumns?

> `optional` **sortColumns?**: `string`

Defined in: [src/types/eastmoney.ts:12](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L12)

东方财富排序字段，逗号分隔，默认 PUBLIC_START_DATE,SECURITY_CODE

***

### sortTypes?

> `optional` **sortTypes?**: `string`

Defined in: [src/types/eastmoney.ts:14](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/types/eastmoney.ts#L14)

与排序字段逐一对应，-1 降序、1 升序，默认 -1,-1
