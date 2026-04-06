[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhCovInfoThs

# Function: bondZhCovInfoThs()

> **bondZhCovInfoThs**(): `Promise`\<[`BondZhCovInfoThsRecord`](../interfaces/BondZhCovInfoThsRecord.md)[]\>

Defined in: [src/sources/ths.ts:52](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/ths.ts#L52)

同花顺-数据中心-可转债
Returns convertible bond IPO and listing data from THS.

## Returns

`Promise`\<[`BondZhCovInfoThsRecord`](../interfaces/BondZhCovInfoThsRecord.md)[]\>

Array of [BondZhCovInfoThsRecord](../interfaces/BondZhCovInfoThsRecord.md) (16 fields)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const thsData = await bondZhCovInfoThs();
console.log(thsData[0].bondCode);
```
