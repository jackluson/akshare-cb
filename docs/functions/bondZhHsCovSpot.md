[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhHsCovSpot

# Function: bondZhHsCovSpot()

> **bondZhHsCovSpot**(): `Promise`\<[`BondCovSpotRecord`](../interfaces/BondCovSpotRecord.md)[]\>

Defined in: [src/sources/sina.ts:46](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/sina.ts#L46)

新浪财经-债券-沪深可转债实时行情
Returns real-time spot data for all SSE/SZSE convertible bonds.
Uses paginated GET; 80 items per page.

## Returns

`Promise`\<[`BondCovSpotRecord`](../interfaces/BondCovSpotRecord.md)[]\>

Array of [BondCovSpotRecord](../interfaces/BondCovSpotRecord.md) — dynamic fields from Sina API

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const spot = await bondZhHsCovSpot();
console.log(spot[0].symbol);
```
