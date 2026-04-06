[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCbAdjLogsJsl

# Function: bondCbAdjLogsJsl()

> **bondCbAdjLogsJsl**(`symbol`): `Promise`\<[`BondCbAdjLogsJslRecord`](../interfaces/BondCbAdjLogsJslRecord.md)[]\>

Defined in: [src/sources/jisilu.ts:345](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/jisilu.ts#L345)

集思录-转股价调整记录
Returns adjustment history for a convertible bond's conversion price.
Returns an empty array if no data is available.

## Parameters

### symbol

`string`

Bond code without market prefix, e.g. `"128013"`

## Returns

`Promise`\<[`BondCbAdjLogsJslRecord`](../interfaces/BondCbAdjLogsJslRecord.md)[]\>

Array of [BondCbAdjLogsJslRecord](../interfaces/BondCbAdjLogsJslRecord.md)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on HTML parse failures

## Example

```typescript
const adjLogs = await bondCbAdjLogsJsl("128013");
```
