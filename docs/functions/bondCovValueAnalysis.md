[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCovValueAnalysis

# Function: bondCovValueAnalysis()

> **bondCovValueAnalysis**(`symbol`): `Promise`\<[`BondCovValueAnalysisRecord`](../interfaces/BondCovValueAnalysisRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:262](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L262)

东方财富-可转债价值分析
Returns historical value analysis data for a specific convertible bond.

## Parameters

### symbol

`string`

Bond code, e.g. `"127100"`

## Returns

`Promise`\<[`BondCovValueAnalysisRecord`](../interfaces/BondCovValueAnalysisRecord.md)[]\>

Array of [BondCovValueAnalysisRecord](../interfaces/BondCovValueAnalysisRecord.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const analysis = await bondCovValueAnalysis("127100");
console.log(analysis[0].closePrice);
```
