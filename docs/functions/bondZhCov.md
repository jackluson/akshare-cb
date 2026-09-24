[**akshare-cb v0.4.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhCov

# Function: bondZhCov()

> **bondZhCov**(`isSurviveOrOptions?`, `delay?`): `Promise`\<[`BondZhCovRecord`](../interfaces/BondZhCovRecord.md)[]\>

Defined in: [src/sources/eastmoney.ts:51](https://github.com/jackluson/akshare-cb/blob/c8e178e2dcfb9ea380a6ce21b775d06cca34c2e2/src/sources/eastmoney.ts#L51)

东方财富-可转债列表
Returns the full list of convertible bonds from East Money Data Center.

## Parameters

### isSurviveOrOptions?

`boolean` \| [`BondZhCovOptions`](../interfaces/BondZhCovOptions.md)

Legacy survival flag, or [BondZhCovOptions](../interfaces/BondZhCovOptions.md).

### delay?

`number`

Legacy pagination delay in milliseconds (boolean form only).

## Returns

`Promise`\<[`BondZhCovRecord`](../interfaces/BondZhCovRecord.md)[]\>

Normalized records. Fetches all pages unless options.pageNumber is specified.
Requests ALL columns and the eight quote fields with quoteType=0; no JSONP callback is needed.

## Throws

[ValidationError](../classes/ValidationError.md) on invalid pagination, delay, or sorting options

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const bonds = await bondZhCov();
console.log(bonds[0].bondCode); // "127100"
const page = await bondZhCov({ pageSize: 50, pageNumber: 2 });
const surviving = await bondZhCov(true, 500); // Existing calls remain supported.
```
