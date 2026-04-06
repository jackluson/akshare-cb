[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbJsl

# Function: bondCbJsl()

> **bondCbJsl**(`cookie`): `Promise`\<[`BondCbJslRecord`](../interfaces/BondCbJslRecord.md)[]\>

Defined in: [src/sources/jisilu.ts:102](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/jisilu.ts#L102)

集思录-可转债列表
Returns all listed convertible bond data from Jisilu.
Requires a valid browser cookie for authentication.

## Parameters

### cookie

`string`

Browser cookie string for Jisilu authentication

## Returns

`Promise`\<[`BondCbJslRecord`](../interfaces/BondCbJslRecord.md)[]\>

Array of [BondCbJslRecord](../interfaces/BondCbJslRecord.md) (23 fields)

## Throws

[AuthenticationError](../classes/AuthenticationError.md) when cookie is missing or invalid

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const list = await bondCbJsl("your_cookie_string");
console.log(list[0].bondCode);
```
