/**
 * akshare-cb: TypeScript library for Chinese convertible bond data
 *
 * Re-implements the convertible bond (可转债) interfaces from the Python akshare library
 * for Node.js/TypeScript. Provides 17 functions across 5 data sources.
 */

// Errors
export {
  AkshareError,
  AuthenticationError,
  NetworkError,
  ParseError,
  ValidationError,
} from "./errors";
// cninfo (巨潮资讯) - 2 functions
export {
  bondCovIssueCninfo,
  bondCovStockIssueCninfo,
} from "./sources/cninfo";
// East Money (东方财富) - 6 functions
export {
  bondCovComparison,
  bondCovValueAnalysis,
  bondZhCov,
  bondZhCovInfo,
  bondZhHsCovMin,
  bondZhHsCovPreMin,
} from "./sources/eastmoney";
// Jisilu (集思录) - 4 functions
export {
  bondCbAdjLogsJsl,
  bondCbIndexJsl,
  bondCbJsl,
  bondCbRedeemJsl,
} from "./sources/jisilu";
// Sina Finance (新浪) - 4 functions
export {
  bondCbProfileSina,
  bondCbSummarySina,
  bondZhHsCovDaily,
  bondZhHsCovSpot,
} from "./sources/sina";
// THS (同花顺) - 1 function
export { bondZhCovInfoThs } from "./sources/ths";
export type { BondCovIssueCninfoRecord, BondCovStockIssueCninfoRecord } from "./types/cninfo";
// Types
export type {
  BondCovComparisonRecord,
  BondCovInfoIndicator,
  BondCovMinRecord,
  BondCovValueAnalysisRecord,
  BondZhCovRecord,
} from "./types/eastmoney";
export type {
  BondCbAdjLogsJslRecord,
  BondCbIndexJslRecord,
  BondCbIndexJslRecordRaw,
  BondCbJslRecord,
  BondCbRedeemJslRecord,
  RedeemStatus,
} from "./types/jisilu";
export type {
  BondCbProfileItem,
  BondCbSummaryItem,
  BondCovDailyRecord,
  BondCovSpotRecord,
} from "./types/sina";
export type { BondZhCovInfoThsRecord } from "./types/ths";
