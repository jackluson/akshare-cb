[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhHsCovDaily

# Function: bondZhHsCovDaily()

> **bondZhHsCovDaily**(`symbol`): `Promise`\<[`BondCovDailyRecord`](../interfaces/BondCovDailyRecord.md)[]\>

Defined in: [src/sources/sina.ts:101](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/sina.ts#L101)

新浪财经-债券-沪深可转债历史日线
Returns daily K-line data for a given convertible bond symbol.

## Parameters

### symbol

`string`

Bond symbol with market prefix, e.g. `"sz128039"`

## Returns

`Promise`\<[`BondCovDailyRecord`](../interfaces/BondCovDailyRecord.md)[]\>

Array of [BondCovDailyRecord](../interfaces/BondCovDailyRecord.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const daily = await bondZhHsCovDaily("sz128039");
console.log(daily[0].close);
```
