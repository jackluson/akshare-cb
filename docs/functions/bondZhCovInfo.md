[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondZhCovInfo

# Function: bondZhCovInfo()

> **bondZhCovInfo**(`symbol`, `indicator?`): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [src/sources/eastmoney.ts:204](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/eastmoney.ts#L204)

东方财富-可转债详情
Returns detailed information for a specific convertible bond.

## Parameters

### symbol

`string`

Bond code, e.g. `"127100"`

### indicator?

[`BondCovInfoIndicator`](../type-aliases/BondCovInfoIndicator.md) = `"basic"`

Data type: `"basic"` = basic info, `"ballot"` = ballot data,
  `"fundraising"` = fundraising details, `"dates"` = key dates

## Returns

`Promise`\<`Record`\<`string`, `unknown`\>[]\>

Array of raw records whose structure depends on `indicator`

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const basic = await bondZhCovInfo("127100", "basic");
const ballot = await bondZhCovInfo("127100", "ballot");
```
