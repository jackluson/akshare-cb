[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhHsCovPreMin

# Function: bondZhHsCovPreMin()

> **bondZhHsCovPreMin**(`symbol`): `Promise`\<[`BondCovMinRecord`](../interfaces/BondCovMinRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:434](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L434)

东方财富-可转债盘前分钟行情
Returns pre-market intraday data for a convertible bond.

## Parameters

### symbol

`string`

Market prefix + code, e.g. `"sz128039"`

## Returns

`Promise`\<[`BondCovMinRecord`](../interfaces/BondCovMinRecord.md)[]\>

Array of [BondCovMinRecord](../interfaces/BondCovMinRecord.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const preMarket = await bondZhHsCovPreMin("sz128039");
```
