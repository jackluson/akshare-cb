[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbRedeemJsl

# Function: bondCbRedeemJsl()

> **bondCbRedeemJsl**(): `Promise`\<[`BondCbRedeemJslRecord`](../interfaces/BondCbRedeemJslRecord.md)[]\>

Defined in: [src/sources/jisilu.ts:233](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/jisilu.ts#L233)

集思录-可转债强赎
Returns forced redemption data for all convertible bonds.

## Returns

`Promise`\<[`BondCbRedeemJslRecord`](../interfaces/BondCbRedeemJslRecord.md)[]\>

Array of [BondCbRedeemJslRecord](../interfaces/BondCbRedeemJslRecord.md) (18 fields)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const redeem = await bondCbRedeemJsl();
console.log(redeem[0].redeemStatus); // "已公告强赎" | "公告要强赎" | ...
```
