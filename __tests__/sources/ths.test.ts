import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bondZhCovInfoThs } from "../../src/sources/ths.ts";

describe("bondZhCovInfoThs", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const singleRawRecord = {
    sub_date: "2024-01-15",
    bond_code: "127100",
    bond_nm: "兴蓉转债",
    sub_code: "072596",
    original_stock_cd: "072596",
    per_share_allocation: "1.2345",
    plan_issue_volume: "500000.00",
    actual_issue_volume: "500000.00",
    draw_pub_date: "2024-01-16",
    draw_lucky_nm: "尾号 1234",
    listing_date: "2024-02-01",
    stock_code: "000596",
    stock_nm: "古井贡酒",
    convert_price: "245.50",
    maturity_date: "2029-12-31",
    draw_lucky_rate: "0.001234",
  };

  it("returns typed records from JSON { list: [...] }", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [singleRawRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();

    expect(result).toHaveLength(1);
    const record = result[0];
    expect(record.bondCode).toBe("127100");
    expect(record.bondName).toBe("兴蓉转债");
    expect(record.stockCode).toBe("000596");
    expect(record.stockName).toBe("古井贡酒");
  });

  it("returns empty array when list is empty", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ list: [] }), { status: 200 }));

    const result = await bondZhCovInfoThs();
    expect(result).toEqual([]);
  });

  it("returns empty array when list is missing from response", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

    const result = await bondZhCovInfoThs();
    expect(result).toEqual([]);
  });

  it("maps raw field names to camelCase field names", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [singleRawRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    // bond_code -> bondCode
    expect(record.bondCode).toBe("127100");
    // bond_nm -> bondName
    expect(record.bondName).toBe("兴蓉转债");
    // sub_date -> subscribeDate
    expect(record.subscribeDate).toBe("2024-01-15");
    // sub_code -> subscribeCode
    expect(record.subscribeCode).toBe("072596");
    // original_stock_cd -> allotmentCode
    expect(record.allotmentCode).toBe("072596");
    // per_share_allocation -> allotmentPerShare
    expect(record.allotmentPerShare).toBe(1.2345);
    // plan_issue_volume -> plannedIssueSize
    expect(record.plannedIssueSize).toBe(500000.0);
    // actual_issue_volume -> actualIssueSize
    expect(record.actualIssueSize).toBe(500000.0);
    // draw_pub_date -> ballotPublishDate
    expect(record.ballotPublishDate).toBe("2024-01-16");
    // draw_lucky_nm -> ballotNumber
    expect(record.ballotNumber).toBe("尾号 1234");
    // listing_date -> listingDate
    expect(record.listingDate).toBe("2024-02-01");
    // stock_code -> stockCode
    expect(record.stockCode).toBe("000596");
    // stock_nm -> stockName
    expect(record.stockName).toBe("古井贡酒");
    // convert_price -> convertPrice
    expect(record.convertPrice).toBe(245.5);
    // maturity_date -> maturityDate
    expect(record.maturityDate).toBe("2029-12-31");
    // draw_lucky_rate -> winRate
    expect(record.winRate).toBe(0.001234);
  });

  it("converts numeric string fields to numbers", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [singleRawRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.allotmentPerShare).toBeTypeOf("number");
    expect(record.plannedIssueSize).toBeTypeOf("number");
    expect(record.actualIssueSize).toBeTypeOf("number");
    expect(record.convertPrice).toBeTypeOf("number");
    expect(record.winRate).toBeTypeOf("number");
  });

  it("returns null for numeric fields when raw values are missing", async () => {
    const sparseRecord = {
      bond_code: "123456",
      bond_nm: "测试转债",
      stock_code: "000001",
      stock_nm: "平安银行",
    };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [sparseRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.allotmentPerShare).toBeNull();
    expect(record.plannedIssueSize).toBeNull();
    expect(record.actualIssueSize).toBeNull();
    expect(record.convertPrice).toBeNull();
    expect(record.winRate).toBeNull();
  });

  it("returns null for date fields when raw values are missing", async () => {
    const sparseRecord = {
      bond_code: "123456",
      bond_nm: "测试转债",
      stock_code: "000001",
      stock_nm: "平安银行",
    };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [sparseRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.subscribeDate).toBeNull();
    expect(record.ballotPublishDate).toBeNull();
    expect(record.listingDate).toBeNull();
    expect(record.maturityDate).toBeNull();
  });

  it("returns null for nullable string fields when raw values are missing", async () => {
    const sparseRecord = {
      bond_code: "123456",
      bond_nm: "测试转债",
      stock_code: "000001",
      stock_nm: "平安银行",
    };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [sparseRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.subscribeCode).toBeNull();
    expect(record.allotmentCode).toBeNull();
    expect(record.ballotNumber).toBeNull();
  });

  it("defaults non-nullable string fields to empty string when raw values are missing", async () => {
    const sparseRecord = {};

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [sparseRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.bondCode).toBe("");
    expect(record.bondName).toBe("");
    expect(record.stockCode).toBe("");
    expect(record.stockName).toBe("");
  });

  it("handles multiple records in the list", async () => {
    const secondRawRecord = {
      sub_date: "2024-03-10",
      bond_code: "123456",
      bond_nm: "希望转债",
      sub_code: "073456",
      original_stock_cd: "073456",
      per_share_allocation: "2.5678",
      plan_issue_volume: "300000.00",
      actual_issue_volume: "280000.00",
      draw_pub_date: "2024-03-11",
      draw_lucky_nm: "尾号 5678",
      listing_date: "2024-04-01",
      stock_code: "600000",
      stock_nm: "浦发银行",
      convert_price: "10.25",
      maturity_date: "2029-09-30",
      draw_lucky_rate: "0.005678",
    };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [singleRawRecord, secondRawRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();

    expect(result).toHaveLength(2);
    expect(result[0].bondCode).toBe("127100");
    expect(result[0].convertPrice).toBe(245.5);
    expect(result[1].bondCode).toBe("123456");
    expect(result[1].convertPrice).toBe(10.25);
    expect(result[1].winRate).toBe(0.005678);
  });

  it("parses dates in YYYY-MM-DD format correctly", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [singleRawRecord] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.subscribeDate).toBe("2024-01-15");
    expect(record.ballotPublishDate).toBe("2024-01-16");
    expect(record.listingDate).toBe("2024-02-01");
    expect(record.maturityDate).toBe("2029-12-31");
  });

  it("converts numeric strings with comma separators", async () => {
    const recordWithCommas = {
      ...singleRawRecord,
      plan_issue_volume: "1,000,000.50",
      convert_price: "1,234.56",
    };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ list: [recordWithCommas] }), { status: 200 }),
    );

    const result = await bondZhCovInfoThs();
    const record = result[0];

    expect(record.plannedIssueSize).toBe(1000000.5);
    expect(record.convertPrice).toBe(1234.56);
  });
});
