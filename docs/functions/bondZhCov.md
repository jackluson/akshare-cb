[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhCov

# Function: bondZhCov()

> **bondZhCov**(`isSurvive?`, `delay?`): `Promise`\<[`BondZhCovRecord`](../interfaces/BondZhCovRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:35](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L35)

东方财富-可转债列表
Returns the full list of convertible bonds from East Money Data Center.

## Parameters

### isSurvive?

`boolean` = `false`

### delay?

`number`

## Returns

`Promise`\<[`BondZhCovRecord`](../interfaces/BondZhCovRecord.md)[]\>

Array of [BondZhCovRecord](../interfaces/BondZhCovRecord.md) with 19 fields per record

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const bonds = await bondZhCov();
console.log(bonds[0].bondCode); // "127100"
```
