[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbSummarySina

# Function: bondCbSummarySina()

> **bondCbSummarySina**(`symbol`): `Promise`\<[`BondCbProfileItem`](../interfaces/BondCbProfileItem.md)[]\>

Defined in: [src/sources/sina.ts:187](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/sina.ts#L187)

新浪财经-债券-可转债概况摘要
Returns bond summary as key-value items.
Parses the 11th table (index 10) which has 6 columns = 3 key-value pairs side by side.

## Parameters

### symbol

`string`

Bond symbol with market prefix, e.g. `"sh155255"`

## Returns

`Promise`\<[`BondCbProfileItem`](../interfaces/BondCbProfileItem.md)[]\>

Array of [BondCbSummaryItem](../type-aliases/BondCbSummaryItem.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on HTML parse failures

## Example

```typescript
const summary = await bondCbSummarySina("sh155255");
```
