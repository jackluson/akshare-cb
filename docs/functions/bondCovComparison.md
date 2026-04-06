[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCovComparison

# Function: bondCovComparison()

> **bondCovComparison**(): `Promise`\<[`BondCovComparisonRecord`](../interfaces/BondCovComparisonRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:136](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L136)

东方财富-可转债比价表
Returns convertible bond comparison table with price premium analysis.

## Returns

`Promise`\<[`BondCovComparisonRecord`](../interfaces/BondCovComparisonRecord.md)[]\>

Array of [BondCovComparisonRecord](../interfaces/BondCovComparisonRecord.md) with 20 fields per record

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const comparison = await bondCovComparison();
console.log(comparison[0].bondCode);
```
