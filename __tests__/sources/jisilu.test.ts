import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  bondCbAdjLogsJsl,
  bondCbIndexJsl,
  bondCbJsl,
  bondCbRedeemJsl,
} from "../../src/sources/jisilu.ts";

// ---------------------------------------------------------------------------
// bondCbIndexJsl
// ---------------------------------------------------------------------------
describe("bondCbIndexJsl", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns records from parsed data", async () => {
    const fixture = JSON.stringify({
      data: [
        { close: "2100.5", volume: "1234567", date: "2024-01-15" },
        { close: "2098.3", volume: "987654", date: "2024-01-12" },
      ],
    });
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const records = await bondCbIndexJsl();

    expect(records).toHaveLength(2);
    expect(records[0]).toEqual({
      close: "2100.5",
      volume: "1234567",
      date: "2024-01-15",
    });
    expect(records[1]).toEqual({
      close: "2098.3",
      volume: "987654",
      date: "2024-01-12",
    });
  });

  it("returns empty array when data is missing", async () => {
    const fixture = JSON.stringify({});
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const records = await bondCbIndexJsl();

    expect(records).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// bondCbJsl
// ---------------------------------------------------------------------------
describe("bondCbJsl", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes cookie in headers and maps all 22 fields", async () => {
    const cell = {
      bond_id: "128013",
      bond_nm: "江银转债",
      price: "105.500",
      increase_rt: "1.23",
      stock_id: "002807",
      stock_nm: "江阴银行",
      sprice: "3.85",
      sincrease_rt: "-0.52",
      pb: "0.72",
      convert_price: "5.50",
      convert_value: "70.00",
      premium_rt: "50.71",
      rating_cd: "AA-",
      put_convert_price: "3.85",
      force_redeem_price: "7.15",
      convert_amt_ratio: "12.35",
      maturity_dt: "2025-01-15",
      year_left: "1.89",
      curr_iss_amt: "15.60",
      volume: "3210.45",
      turnover_rt: "2.15",
      ytm_rt: "-3.21",
      dblow: "156.21",
    };

    const fixture = JSON.stringify({
      rows: [{ cell }],
    });
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const cookie = "kbz=cookies_matter";
    const records = await bondCbJsl(cookie);

    // Verify cookie was passed in the fetch call headers
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchOptions = mockFetch.mock.calls[0][1] as RequestInit;
    const headers = fetchOptions.headers as Record<string, string>;
    expect(headers.cookie).toBe(cookie);

    // Verify 22 fields mapped correctly
    expect(records).toHaveLength(1);
    const r = records[0];
    expect(r.bondCode).toBe("128013");
    expect(r.bondName).toBe("江银转债");
    expect(r.price).toBe(105.5);
    expect(r.changeRate).toBe(1.23);
    expect(r.stockCode).toBe("002807");
    expect(r.stockName).toBe("江阴银行");
    expect(r.stockPrice).toBe(3.85);
    expect(r.stockChangeRate).toBe(-0.52);
    expect(r.stockPB).toBe(0.72);
    expect(r.convertPrice).toBe(5.5);
    expect(r.convertValue).toBe(70.0);
    expect(r.convertPremiumRate).toBe(50.71);
    expect(r.rating).toBe("AA-");
    expect(r.resaleTriggerPrice).toBe(3.85);
    expect(r.redeemTriggerPrice).toBe(7.15);
    expect(r.bondRatio).toBe(12.35);
    expect(r.maturityDate).toBe("2025-01-15");
    expect(r.remainingYears).toBe(1.89);
    expect(r.remainingSize).toBe(15.6);
    expect(r.turnover).toBe(3210.45);
    expect(r.turnoverRate).toBe(2.15);
    expect(r.ytm).toBe(-3.21);
    expect(r.doubleLow).toBe(156.21);

    // Confirm all fields are present
    const fieldCount = Object.keys(r).length;
    expect(fieldCount).toBe(23);
  });
});

// ---------------------------------------------------------------------------
// bondCbRedeemJsl
// ---------------------------------------------------------------------------
describe("bondCbRedeemJsl", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps redeem_icon codes to Chinese status text", async () => {
    const rows = [
      { cell: { redeem_icon: "R", bond_id: "113001", bond_nm: "转债R" } },
      { cell: { redeem_icon: "O", bond_id: "113002", bond_nm: "转债O" } },
      { cell: { redeem_icon: "G", bond_id: "113003", bond_nm: "转债G" } },
      { cell: { redeem_icon: "B", bond_id: "113004", bond_nm: "转债B" } },
    ];

    const fixture = JSON.stringify({ rows });
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const records = await bondCbRedeemJsl();

    expect(records).toHaveLength(4);
    expect(records[0].redeemStatus).toBe("已公告强赎");
    expect(records[1].redeemStatus).toBe("公告要强赎");
    expect(records[2].redeemStatus).toBe("公告不强赎");
    expect(records[3].redeemStatus).toBe("已满足强赎条件");
  });

  it("strips '%' from redeem_price_ratio before numeric conversion", async () => {
    const cell = {
      bond_id: "128013",
      bond_nm: "江银转债",
      price: "105.50",
      stock_id: "002807",
      stock_nm: "江阴银行",
      orig_iss_amt: "20.00",
      curr_iss_amt: "15.60",
      convert_dt: "2019-07-18",
      delist_dt: "2025-01-15",
      maturity_dt: "2025-01-15",
      convert_price: "5.50",
      redeem_price_ratio: "130%",
      force_redeem_price: "7.15",
      sprice: "3.85",
      real_force_redeem_price: "106.50",
      redeem_count: "15/30",
      redeem_tc: "若公司A股股票连续三十个交易日中...",
      redeem_icon: "B",
    };

    const fixture = JSON.stringify({ rows: [{ cell }] });
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const records = await bondCbRedeemJsl();

    // '%' stripped, resulting in numeric 130
    expect(records[0].redeemTriggerRatio).toBe(130);
  });

  it("maps all 18 fields correctly", async () => {
    const cell = {
      bond_id: "128013",
      bond_nm: "江银转债",
      price: "105.50",
      stock_id: "002807",
      stock_nm: "江阴银行",
      orig_iss_amt: "20.00",
      curr_iss_amt: "15.60",
      convert_dt: "2019-07-18",
      delist_dt: "2025-01-15",
      maturity_dt: "2025-01-15",
      convert_price: "5.50",
      redeem_price_ratio: "130%",
      force_redeem_price: "7.15",
      sprice: "3.85",
      real_force_redeem_price: "106.50",
      redeem_count: "15/30",
      redeem_tc: "若公司A股股票连续三十个交易日中...",
      redeem_icon: "B",
    };

    const fixture = JSON.stringify({ rows: [{ cell }] });
    mockFetch.mockResolvedValueOnce(new Response(fixture, { status: 200 }));

    const records = await bondCbRedeemJsl();

    expect(records).toHaveLength(1);
    const r = records[0];
    expect(r.bondCode).toBe("128013");
    expect(r.bondName).toBe("江银转债");
    expect(r.price).toBe(105.5);
    expect(r.stockCode).toBe("002807");
    expect(r.stockName).toBe("江阴银行");
    expect(r.totalSize).toBe(20.0);
    expect(r.remainingSize).toBe(15.6);
    expect(r.convertStartDate).toBe("2019-07-18");
    expect(r.lastTradeDate).toBe("2025-01-15");
    expect(r.maturityDate).toBe("2025-01-15");
    expect(r.convertPrice).toBe(5.5);
    expect(r.redeemTriggerRatio).toBe(130);
    expect(r.redeemTriggerPrice).toBe(7.15);
    expect(r.stockPrice).toBe(3.85);
    expect(r.redeemPrice).toBe(106.5);
    expect(r.redeemDayCount).toBe("15/30");
    expect(r.redeemClause).toBe("若公司A股股票连续三十个交易日中...");
    expect(r.redeemStatus).toBe("已满足强赎条件");

    // Confirm all 18 fields are present
    const fieldCount = Object.keys(r).length;
    expect(fieldCount).toBe(18);
  });
});

// ---------------------------------------------------------------------------
// bondCbAdjLogsJsl
// ---------------------------------------------------------------------------
describe("bondCbAdjLogsJsl", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses records from HTML table with Chinese headers", async () => {
    const html =
      "<table><tr><th>下修前转股价</th><th>下修后转股价</th><th>下修底价</th><th>股东大会日</th><th>新转股价生效日期</th></tr>" +
      "<tr><td>5.50</td><td>4.80</td><td>4.50</td><td>2023-06-15</td><td>2023-06-20</td></tr></table>";
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const records = await bondCbAdjLogsJsl("128013");

    expect(records).toHaveLength(1);
    const r = records[0];
    expect(r.beforePrice).toBe(5.5);
    expect(r.afterPrice).toBe(4.8);
    expect(r.bottomPrice).toBe(4.5);
    expect(r.meetingDate).toBe("2023-06-15");
    expect(r.effectiveDate).toBe("2023-06-20");
  });

  it("returns empty array when no table in response", async () => {
    const html = "<html><body><p>No data available</p></body></html>";
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const records = await bondCbAdjLogsJsl("128013");

    expect(records).toEqual([]);
  });

  it("maps fields correctly for multiple rows", async () => {
    const html =
      "<table><tr><th>下修前转股价</th><th>下修后转股价</th><th>下修底价</th><th>股东大会日</th><th>新转股价生效日期</th></tr>" +
      "<tr><td>10.00</td><td>8.50</td><td>8.00</td><td>2022-03-10</td><td>2022-03-15</td></tr>" +
      "<tr><td>8.50</td><td>7.20</td><td>6.80</td><td>2023-01-20</td><td>2023-01-25</td></tr></table>";
    mockFetch.mockResolvedValueOnce(new Response(html, { status: 200 }));

    const records = await bondCbAdjLogsJsl("128013");

    expect(records).toHaveLength(2);
    expect(records[0].beforePrice).toBe(10.0);
    expect(records[0].afterPrice).toBe(8.5);
    expect(records[0].bottomPrice).toBe(8.0);
    expect(records[0].meetingDate).toBe("2022-03-10");
    expect(records[0].effectiveDate).toBe("2022-03-15");

    expect(records[1].beforePrice).toBe(8.5);
    expect(records[1].afterPrice).toBe(7.2);
    expect(records[1].bottomPrice).toBe(6.8);
    expect(records[1].meetingDate).toBe("2023-01-20");
    expect(records[1].effectiveDate).toBe("2023-01-25");
  });
});
