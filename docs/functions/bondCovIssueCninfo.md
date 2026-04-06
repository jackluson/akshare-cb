[**akshare-cb v0.1.0**](../README.md)

***

[akshare-cb](../globals.md) / bondCovIssueCninfo

# Function: bondCovIssueCninfo()

> **bondCovIssueCninfo**(`startDate`, `endDate`): `Promise`\<[`BondCovIssueCninfoRecord`](../interfaces/BondCovIssueCninfoRecord.md)[]\>

Defined in: [src/sources/cninfo.ts:74](https://github.com/jackluson/akshare-cb/blob/abad5c6e1d8680afcfe618ea5b67252cf488abba/src/sources/cninfo.ts#L74)

巨潮资讯-可转债发行
Returns convertible bond issuance data for a date range.
Uses AES-128-CBC encrypted token for API authentication (auto-generated).

## Parameters

### startDate

`string`

Start date, e.g. `"2024-01-01"` or `"20240101"`

### endDate

`string`

End date, e.g. `"2024-12-31"` or `"20241231"`

## Returns

`Promise`\<[`BondCovIssueCninfoRecord`](../interfaces/BondCovIssueCninfoRecord.md)[]\>

Array of [BondCovIssueCninfoRecord](../interfaces/BondCovIssueCninfoRecord.md) (28 fields)

## Throws

[NetworkError](../classes/NetworkError.md) on HTTP failures

## Throws

[ParseError](../classes/ParseError.md) on JSON parse failures

## Example

```typescript
const issues = await bondCovIssueCninfo("2024-01-01", "2024-12-31");
```
