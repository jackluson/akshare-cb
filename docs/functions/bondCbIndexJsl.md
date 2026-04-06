[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbIndexJsl

# Function: bondCbIndexJsl()

> **bondCbIndexJsl**(): `Promise`\<[`BondCbIndexJslRecordRaw`](../interfaces/BondCbIndexJslRecordRaw.md)\>

Defined in: [src/sources/jisilu.ts:48](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/jisilu.ts#L48)

集思录-可转债等权指数
Returns the Jisilu convertible bond equal-weight index history (raw column-based format).

## Returns

`Promise`\<[`BondCbIndexJslRecordRaw`](../interfaces/BondCbIndexJslRecordRaw.md)\>

Column-based raw data [BondCbIndexJslRecordRaw](../interfaces/BondCbIndexJslRecordRaw.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const raw = await bondCbIndexJsl();
console.log(raw.price_dt[0]); // date array
```
