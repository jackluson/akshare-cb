[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhHsCovMin

# Function: bondZhHsCovMin()

> **bondZhHsCovMin**(`symbol`, `period?`, `adjust?`, `startDate?`, `endDate?`): `Promise`\<[`BondCovMinRecord`](../interfaces/BondCovMinRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:319](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L319)

东方财富-可转债分钟行情
Returns intraday minute-level market data for a convertible bond.

## Parameters

### symbol

`string`

Market prefix + code, e.g. `"sz128039"`, `"sh113050"`

### period?

`string` = `"15"`

Minute period: `"1"` = tick, `"5"` / `"15"` / `"30"` / `"60"` = kline.
  Defaults to `"15"`.

### adjust?

`string` = `""`

Adjustment method: `""` = none, `"qfq"` = forward, `"hfq"` = backward.
  Defaults to `""`.

### startDate?

`string` = `"1979-09-01 09:32:00"`

Filter start time. Defaults to `"1979-09-01 09:32:00"`.

### endDate?

`string` = `"2222-01-01 09:32:00"`

Filter end time. Defaults to `"2222-01-01 09:32:00"`.

## Returns

`Promise`\<[`BondCovMinRecord`](../interfaces/BondCovMinRecord.md)[]\>

Array of [BondCovMinRecord](../interfaces/BondCovMinRecord.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const ticks = await bondZhHsCovMin("sz128039", "1");
const kline = await bondZhHsCovMin("sz128039", "15");
```
