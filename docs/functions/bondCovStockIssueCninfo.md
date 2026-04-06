[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCovStockIssueCninfo

# Function: bondCovStockIssueCninfo()

> **bondCovStockIssueCninfo**(): `Promise`\<[`BondCovStockIssueCninfoRecord`](../interfaces/BondCovStockIssueCninfoRecord.md)[]\>

Defined in: [src/sources/cninfo.ts:107](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/cninfo.ts#L107)

巨潮资讯-可转债转股
Returns convertible bond to stock conversion records.

## Returns

`Promise`\<[`BondCovStockIssueCninfoRecord`](../interfaces/BondCovStockIssueCninfoRecord.md)[]\>

Array of [BondCovStockIssueCninfoRecord](../interfaces/BondCovStockIssueCninfoRecord.md) (10 fields)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const conversions = await bondCovStockIssueCninfo();
```
