import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  bondCovComparison,
  bondCovValueAnalysis,
  bondZhCov,
  bondZhCovInfo,
  bondZhHsCovMin,
  bondZhHsCovPreMin,
} from "../../src/sources/eastmoney.ts";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("bondZhCov", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns records from paginated response (mock first page with pages: 1)", async () => {
    const mockData = [
      {
        SECURITY_CODE: "123456",
        SECURITY_NAME_ABBR: "测试转债",
        PUBLIC_START_DATE: "2024-01-15",
        APPLY_CODE: "073456",
        SUBSCRIPTION_LIMIT: 1000,
        CONVERT_STOCK_CODE: "600001",
        CONVERT_STOCK_NAME: "测试正股",
        CONVERT_STOCK_PRICE: 10.5,
        TRANSFER_PRICE: 11.0,
        TRANSFER_VALUE: 95.45,
        CURRENT_BOND_PRICE: 105.2,
        TRANSFER_PREMIUM_RATIO: 10.18,
        ALLOTMENT_DATE: "2024-01-10",
        ALLOTMENT_PER_SHARE: 2.5,
        ISSUE_SIZE: 50,
        WINNING_NUMBER_PUBLISH_DATE: "2024-01-18",
        WIN_RATE: 0.015,
        LISTING_DATE: "2024-02-01",
        RATING: "AA+",
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          pages: 1,
          data: mockData,
        },
      }),
    );

    const result = await bondZhCov();
    expect(result).toHaveLength(1);
    expect(result[0].bondCode).toBe("123456");
    expect(result[0].bondName).toBe("测试转债");
  });

  it("returns empty array when no result", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));

    const result = await bondZhCov();
    expect(result).toEqual([]);
  });

  it("verifies field mapping (SECURITY_CODE->bondCode, SECURITY_NAME_ABBR->bondName, etc.)", async () => {
    const mockData = [
      {
        SECURITY_CODE: "128001",
        SECURITY_NAME_ABBR: "平银转债",
        PUBLIC_START_DATE: "2019-01-21 00:00:00",
        APPLY_CODE: "072001",
        SUBSCRIPTION_LIMIT: 500,
        CONVERT_STOCK_CODE: "000001",
        CONVERT_STOCK_NAME: "平安银行",
        CONVERT_STOCK_PRICE: 12.34,
        TRANSFER_PRICE: 13.56,
        TRANSFER_VALUE: 91.0,
        CURRENT_BOND_PRICE: 108.5,
        TRANSFER_PREMIUM_RATIO: 19.23,
        ALLOTMENT_DATE: "2019-01-16",
        ALLOTMENT_PER_SHARE: 3.0,
        ISSUE_SIZE: 260,
        WINNING_NUMBER_PUBLISH_DATE: "2019-01-23",
        WIN_RATE: 0.08,
        LISTING_DATE: "2019-02-18",
        RATING: "AAA",
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          pages: 1,
          data: mockData,
        },
      }),
    );

    const result = await bondZhCov();
    expect(result).toHaveLength(1);

    const record = result[0];
    expect(record.bondCode).toBe("128001");
    expect(record.bondName).toBe("平银转债");
    expect(record.subscribeDate).toBe("2019-01-21");
    expect(record.subscribeCode).toBe("072001");
    expect(record.subscribeLimit).toBe(500);
    expect(record.stockCode).toBe("000001");
    expect(record.stockName).toBe("平安银行");
    expect(record.stockPrice).toBe(12.34);
    expect(record.convertPrice).toBe(13.56);
    expect(record.convertValue).toBe(91.0);
    expect(record.bondPrice).toBe(108.5);
    expect(record.convertPremiumRate).toBe(19.23);
    expect(record.allotmentDate).toBe("2019-01-16");
    expect(record.allotmentPerShare).toBe(3.0);
    expect(record.issueSize).toBe(260);
    expect(record.ballotDate).toBe("2019-01-23");
    expect(record.winRate).toBe(0.08);
    expect(record.listingDate).toBe("2019-02-18");
    expect(record.creditRating).toBe("AAA");
  });
});

describe("bondCovComparison", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns records from paginated push2 API", async () => {
    const mockDiff = [
      {
        f1: 1,
        f12: "113050",
        f14: "南银转债",
        f2: 112.5,
        f3: 0.45,
        f234: "601009",
        f236: "南京银行",
        f231: 9.82,
        f232: -0.31,
        f237: 10.0,
        f238: 98.2,
        f239: 14.56,
        f240: 42.13,
        f241: 80.0,
        f242: 130.0,
        f26: 108.5,
        f229: 79.15,
        f243: "2021-03-01",
        f227: "2021-03-15",
      },
      {
        f1: 2,
        f12: "127045",
        f14: "牧原转债",
        f2: 135.8,
        f3: -1.22,
        f234: "002714",
        f236: "牧原股份",
        f231: 42.55,
        f232: 0.88,
        f237: 40.0,
        f238: 106.38,
        f239: 27.65,
        f240: 60.22,
        f241: 85.0,
        f242: 140.0,
        f26: 105.0,
        f229: 84.8,
        f243: "2021-09-01",
        f227: "2021-09-10",
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          total: 2,
          diff: mockDiff,
        },
      }),
    );

    const result = await bondCovComparison();
    expect(result).toHaveLength(2);
    expect(result[0].bondCode).toBe("113050");
    expect(result[1].bondCode).toBe("127045");
  });

  it("verifies field mapping (f12->bondCode, f14->bondName, f2->bondPrice, f237->convertPrice, etc.)", async () => {
    const mockDiff = [
      {
        f1: 1,
        f12: "113050",
        f14: "南银转债",
        f2: 112.5,
        f3: 0.45,
        f234: "601009",
        f236: "南京银行",
        f231: 9.82,
        f232: -0.31,
        f237: 10.0,
        f238: 98.2,
        f239: 14.56,
        f240: 42.13,
        f241: 80.0,
        f242: 130.0,
        f26: 108.5,
        f229: 79.15,
        f243: "2021-03-01",
        f227: "2021-03-15",
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          total: 1,
          diff: mockDiff,
        },
      }),
    );

    const result = await bondCovComparison();
    expect(result).toHaveLength(1);

    const record = result[0];
    expect(record.index).toBe(1);
    expect(record.bondCode).toBe("113050");
    expect(record.bondName).toBe("南银转债");
    expect(record.bondPrice).toBe(112.5);
    expect(record.bondChangeRate).toBe(0.45);
    expect(record.stockCode).toBe("601009");
    expect(record.stockName).toBe("南京银行");
    expect(record.stockPrice).toBe(9.82);
    expect(record.stockChangeRate).toBe(-0.31);
    expect(record.convertPrice).toBe(10.0);
    expect(record.convertValue).toBe(98.2);
    expect(record.convertPremiumRate).toBe(14.56);
    expect(record.bondPremiumRate).toBe(42.13);
    expect(record.resaleTriggerPrice).toBe(80.0);
    expect(record.redeemTriggerPrice).toBe(130.0);
    expect(record.maturityRedeemPrice).toBe(108.5);
    expect(record.pureBondValue).toBe(79.15);
    expect(record.convertStartDate).toBe("2021-03-01");
    expect(record.listingDate).toBe("2021-03-15");
    expect(record.subscribeDate).toBeNull();
  });
});

describe("bondZhCovInfo", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns data for basic indicator", async () => {
    const mockData = [
      {
        SECURITY_CODE: "128001",
        SECURITY_NAME_ABBR: "平银转债",
        CONVERT_STOCK_CODE: "000001",
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondZhCovInfo("128001", "basic");
    expect(result).toHaveLength(1);
    expect(result[0].SECURITY_CODE).toBe("128001");
  });

  it("returns data for ballot indicator", async () => {
    const mockData = [{ SECURITY_CODE: "128001", BALLOT_NUM: "123456" }];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondZhCovInfo("128001", "ballot");
    expect(result).toHaveLength(1);
    expect(result[0].BALLOT_NUM).toBe("123456");
  });

  it("returns data for fundraising indicator", async () => {
    const mockData = [{ SECURITY_CODE: "128001", PROJECT_NAME: "Project A", INVEST_AMOUNT: 500 }];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondZhCovInfo("128001", "fundraising");
    expect(result).toHaveLength(1);
    expect(result[0].PROJECT_NAME).toBe("Project A");
  });

  it("returns data for dates indicator", async () => {
    const mockData = [{ SECURITY_CODE: "128001", LISTING_DATE: "2019-02-18" }];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondZhCovInfo("128001", "dates");
    expect(result).toHaveLength(1);
    expect(result[0].LISTING_DATE).toBe("2019-02-18");
  });

  it("returns empty for unknown indicator", async () => {
    // bondZhCovInfo accepts BondCovInfoIndicator which is a union type,
    // but the function checks indicatorMap and returns [] for unknowns.
    // We bypass the type system with a cast to test the runtime behavior.
    const result = await bondZhCovInfo("128001", "unknown" as "basic");
    expect(result).toEqual([]);
  });

  it("returns empty when no data", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {},
      }),
    );

    const result = await bondZhCovInfo("128001", "basic");
    expect(result).toEqual([]);
  });
});

describe("bondCovValueAnalysis", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns value analysis records", async () => {
    // The mapValueAnalysis function uses Object.values(raw) and reads
    // values by positional index: [0]=date, [1]=closePrice, [2]=convertValue,
    // [3]=pureBondValue, [4]=bondPremiumRate, [5]=convertPremiumRate
    const mockData = [
      {
        DATE: "2024-01-15",
        CLOSE_PRICE: 110.5,
        CONVERT_VALUE: 98.3,
        PURE_BOND_VALUE: 85.2,
        BOND_PREMIUM_RATE: 29.69,
        CONVERT_PREMIUM_RATE: 12.41,
      },
      {
        DATE: "2024-01-16",
        CLOSE_PRICE: 112.0,
        CONVERT_VALUE: 99.1,
        PURE_BOND_VALUE: 85.3,
        BOND_PREMIUM_RATE: 31.3,
        CONVERT_PREMIUM_RATE: 13.01,
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondCovValueAnalysis("123456");
    expect(result).toHaveLength(2);
  });

  it("verifies field mapping from positional values array", async () => {
    // Object.values order depends on insertion order. The source code reads:
    // values[0]=date, values[1]=closePrice, values[2]=convertValue,
    // values[3]=pureBondValue, values[4]=bondPremiumRate, values[5]=convertPremiumRate
    const mockData = [
      {
        DATE: "2024-01-15",
        CLOSE_PRICE: 110.5,
        CONVERT_VALUE: 98.3,
        PURE_BOND_VALUE: 85.2,
        BOND_PREMIUM_RATE: 29.69,
        CONVERT_PREMIUM_RATE: 12.41,
      },
    ];

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {
          data: mockData,
        },
      }),
    );

    const result = await bondCovValueAnalysis("123456");
    expect(result).toHaveLength(1);

    const record = result[0];
    expect(record.date).toBe("2024-01-15");
    expect(record.closePrice).toBe(110.5);
    expect(record.convertValue).toBe(98.3);
    expect(record.pureBondValue).toBe(85.2);
    expect(record.bondPremiumRate).toBe(29.69);
    expect(record.convertPremiumRate).toBe(12.41);
  });

  it("returns empty when no data", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        result: {},
      }),
    );

    const result = await bondCovValueAnalysis("123456");
    expect(result).toEqual([]);
  });
});

describe("bondZhHsCovMin", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("for period 1: returns trend line data (comma-separated strings)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          trends: [
            "2024-01-15 09:30,110.5,110.3,110.8,110.1,1000,110300",
            "2024-01-15 09:31,110.3,110.6,110.7,110.2,800,88480",
            "2024-01-15 09:32,110.6,110.4,110.9,110.3,1200,132480",
          ],
        },
      }),
    );

    const result = await bondZhHsCovMin("sh113050", "1");
    expect(result).toHaveLength(3);

    const first = result[0];
    expect(first.time).toBe("2024-01-15 09:30");
    expect(first.open).toBe(110.5);
    expect(first.close).toBe(110.3);
    expect(first.high).toBe(110.8);
    expect(first.low).toBe(110.1);
    expect(first.volume).toBe(1000);
    expect(first.amount).toBe(110300);
  });

  it("for other periods: returns kline data (comma-separated strings)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          klines: [
            "2024-01-15,110.5,111.0,111.5,110.0,5000,555000,1.23,0.5,0.55,2.3",
            "2024-01-16,111.0,112.0,112.5,110.5,6000,669000,1.78,0.9,1.0,2.8",
          ],
        },
      }),
    );

    const result = await bondZhHsCovMin("sh113050", "15");
    expect(result).toHaveLength(2);

    const first = result[0];
    expect(first.time).toBe("2024-01-15");
    expect(first.open).toBe(110.5);
    expect(first.close).toBe(111.0);
    expect(first.high).toBe(111.5);
    expect(first.low).toBe(110.0);
    expect(first.volume).toBe(5000);
    expect(first.amount).toBe(555000);
    expect(first.amplitude).toBe(1.23);
    expect(first.changeRate).toBe(0.5);
    expect(first.changeAmount).toBe(0.55);
    expect(first.turnoverRate).toBe(2.3);
  });

  it("returns empty for invalid market prefix", async () => {
    const result = await bondZhHsCovMin("XX113050", "15");
    expect(result).toEqual([]);
  });

  it("verifies date filtering works", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          klines: [
            "2024-01-10,110.0,111.0,112.0,109.5,3000,331500,2.2,1.0,1.1,1.5",
            "2024-01-15,111.0,112.0,113.0,110.5,4000,446000,2.1,0.9,1.0,2.0",
            "2024-01-20,112.0,113.0,114.0,111.5,5000,562500,2.0,0.8,0.9,2.5",
          ],
        },
      }),
    );

    const result = await bondZhHsCovMin("sh113050", "15", "", "2024-01-12", "2024-01-18");
    expect(result).toHaveLength(1);
    expect(result[0].time).toBe("2024-01-15");
  });
});

describe("bondZhHsCovPreMin", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns pre-market trend data", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {
          trends: [
            "2024-01-15 09:15,110.0,110.2,110.5,109.8,500,55000",
            "2024-01-15 09:20,110.2,110.4,110.6,110.0,300,33120",
          ],
        },
      }),
    );

    const result = await bondZhHsCovPreMin("sh113050");
    expect(result).toHaveLength(2);

    const first = result[0];
    expect(first.time).toBe("2024-01-15 09:15");
    expect(first.open).toBe(110.0);
    expect(first.close).toBe(110.2);
    expect(first.high).toBe(110.5);
    expect(first.low).toBe(109.8);
    expect(first.volume).toBe(500);
    expect(first.amount).toBe(55000);
  });

  it("returns empty for invalid market prefix", async () => {
    const result = await bondZhHsCovPreMin("XX113050");
    expect(result).toEqual([]);
  });

  it("returns empty when no trends data", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: {},
      }),
    );

    const result = await bondZhHsCovPreMin("sh113050");
    expect(result).toEqual([]);
  });
});
