[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbProfileSina

# Function: bondCbProfileSina()

> **bondCbProfileSina**(`symbol`): `Promise`\<[`BondCbProfileItem`](../interfaces/BondCbProfileItem.md)[]\>

Defined in: [src/sources/sina.ts:154](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/sina.ts#L154)

新浪财经-债券-可转债详情资料
Returns detailed bond profile as key-value items.

## Parameters

### symbol

`string`

Bond symbol with market prefix, e.g. `"sz128039"`

## Returns

`Promise`\<[`BondCbProfileItem`](../interfaces/BondCbProfileItem.md)[]\>

Array of [BondCbProfileItem](../interfaces/BondCbProfileItem.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on HTML parse failures

## Example

```typescript
const profile = await bondCbProfileSina("sz128039");
console.log(profile[0]); // { item: "债券代码", value: "128039" }
```
