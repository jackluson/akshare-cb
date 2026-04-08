/**
 * Centralized URL registry for all data sources.
 */

export const EASTMONEY = {
  DATACENTER: "https://datacenter-web.eastmoney.com/api/data/v1/get",
  DATA_GET: "https://datacenter-web.eastmoney.com/api/data/get",
  PUSH_CLIST: "https://16.push2.eastmoney.com/api/qt/clist/get",
  STOCK_TRENDS: "https://push2.eastmoney.com/api/qt/stock/trends2/get",
  STOCK_KLINE: "https://push2his.eastmoney.com/api/qt/stock/kline/get",
} as const;

export const SINA = {
  SPOT_COUNT:
    "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeStockCountSimple",
  SPOT_DATA:
    "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeDataSimple",
  HIST: "https://finance.sina.com.cn/realstock/company/{symbol}/hisdata/klc_kl.js?d={date}",
  PROFILE: "https://money.finance.sina.com.cn/bond/info/{symbol}.html",
  SUMMARY: "https://money.finance.sina.com.cn/bond/quotes/{symbol}.html",
} as const;

export const JISILU = {
  INDEX: "https://www.jisilu.cn/webapi/cb/index_history/",
  CB_LIST: "https://www.jisilu.cn/data/cbnew/cb_list_new/",
  REDEEM: "https://www.jisilu.cn/data/cbnew/redeem_list/",
  ADJ_LOGS: "https://www.jisilu.cn/data/cbnew/adj_logs/",
} as const;

export const CNINFO = {
  BASE: "http://webapi.cninfo.com.cn",
  ISSUE: "http://webapi.cninfo.com.cn/api/sysapi/p_sysapi1123",
  STOCK_ISSUE: "http://webapi.cninfo.com.cn/api/sysapi/p_sysapi1124",
} as const;

export const THS = {
  DATA: "https://data.10jqka.com.cn/ipo/kzz/",
} as const;
