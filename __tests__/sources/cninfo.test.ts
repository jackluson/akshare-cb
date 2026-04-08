import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bondCovIssueCninfo, bondCovStockIssueCninfo } from "../../src/sources/cninfo.ts";
import { getCallHeaders, getCallUrl } from "../helpers";

describe("bondCovIssueCninfo", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const issueRawRecord = {
    SECCODE: "127060",
    SECNAME: "本钢转债",
    DECLAREDATE: "2020-06-29 00:00:00",
    F002D: "2020-07-02 00:00:00",
    F003D: "2020-07-02 00:00:00",
    F005N: 68.0,
    F006N: 68.0,
    F007N: 100.0,
    F008N: 100.0,
    F001V: "070060",
    F009V: "优先配售和网上定价发行相结合",
    F010V: "原股东优先配售",
    F011V: "",
    F012V: "余额包销",
    F013V: "用于偿还有息负债及补充流动资金",
    F003N: 5.03,
    F027D: "2021-01-06 00:00:00",
    F053D: "2026-07-02 00:00:00",
    F054D: "2020-07-02 00:00:00",
    F055V: "070060",
    F056V: "本钢发债",
    F057N: 10000,
    F058N: 10,
    F059N: 1,
    F060D: "2020-07-07 00:00:00",
    F061D: "2020-07-02 00:00:00",
    F062N: 100.0,
    F063D: "2020-07-01 00:00:00",
    F064D: "2020-07-02 00:00:00",
    F017V: "深交所",
    BONDNAME: "本钢板材可转换公司债券",
  };

  it("returns mapped records from POST response", async () => {
    const responseBody = { records: [issueRawRecord] };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), { status: 200 }));

    const result = await bondCovIssueCninfo("20200101", "20201231");

    expect(result).toHaveLength(1);
    expect(result[0].bondCode).toBe("127060");
    expect(result[0].bondName).toBe("本钢转债");
    expect(result[0].announceDate).toBe("2020-06-29");
    expect(result[0].issueStartDate).toBe("2020-07-02");
    expect(result[0].issueEndDate).toBe("2020-07-02");
    expect(result[0].plannedIssueAmount).toBe(68.0);
    expect(result[0].actualIssueAmount).toBe(68.0);
    expect(result[0].faceValue).toBe(100.0);
    expect(result[0].issuePrice).toBe(100.0);
    expect(result[0].issueMethod).toBe("优先配售和网上定价发行相结合");
    expect(result[0].issueTarget).toBe("原股东优先配售");
    expect(result[0].issueScope).toBe("");
    expect(result[0].underwritingMethod).toBe("余额包销");
    expect(result[0].fundraisingPurpose).toBe("用于偿还有息负债及补充流动资金");
    expect(result[0].initialConvertPrice).toBe(5.03);
    expect(result[0].convertStartDate).toBe("2021-01-06");
    expect(result[0].convertEndDate).toBe("2026-07-02");
    expect(result[0].onlineSubscribeDate).toBe("2020-07-02");
    expect(result[0].onlineSubscribeCode).toBe("070060");
    expect(result[0].onlineSubscribeShortName).toBe("本钢发债");
    expect(result[0].onlineSubscribeMax).toBe(10000);
    expect(result[0].onlineSubscribeMin).toBe(10);
    expect(result[0].onlineSubscribeUnit).toBe(1);
    expect(result[0].onlineBallotPublishDate).toBe("2020-07-07");
    expect(result[0].prioritySubscribeDate).toBe("2020-07-02");
    expect(result[0].allotmentPrice).toBe(100.0);
    expect(result[0].rightsRecordDate).toBe("2020-07-01");
    expect(result[0].priorityPaymentDate).toBe("2020-07-02");
    expect(result[0].convertCode).toBe("070060");
    expect(result[0].market).toBe("深交所");
    expect(result[0].bondFullName).toBe("本钢板材可转换公司债券");
  });

  it("returns empty array when records is missing", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

    const result = await bondCovIssueCninfo("20250101", "20251231");

    expect(result).toEqual([]);
  });

  it("verifies key field mappings from raw record", async () => {
    const responseBody = { records: [issueRawRecord] };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), { status: 200 }));

    const result = await bondCovIssueCninfo("20200101", "20201231");
    const record = result[0];

    // SECCODE -> bondCode
    expect(record.bondCode).toBe("127060");
    // SECNAME -> bondName
    expect(record.bondName).toBe("本钢转债");
    // DECLAREDATE -> announceDate
    expect(record.announceDate).toBe("2020-06-29");
    // F002D -> issueStartDate
    expect(record.issueStartDate).toBe("2020-07-02");
    // F003D -> issueEndDate
    expect(record.issueEndDate).toBe("2020-07-02");
    // F005N -> plannedIssueAmount
    expect(record.plannedIssueAmount).toBe(68.0);
    // F006N -> actualIssueAmount
    expect(record.actualIssueAmount).toBe(68.0);
    // F007N -> faceValue
    expect(record.faceValue).toBe(100.0);
    // F008N -> issuePrice
    expect(record.issuePrice).toBe(100.0);
    // F001V -> convertCode
    expect(record.convertCode).toBe("070060");
    // F003N -> initialConvertPrice
    expect(record.initialConvertPrice).toBe(5.03);
  });

  it("verifies Accept-Enckey header is set (AES token)", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ records: [] }), { status: 200 }));

    await bondCovIssueCninfo("20200101", "20201231");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const headers = getCallHeaders(mockFetch);

    expect(headers).toHaveProperty("accept-enckey");
    expect(typeof headers["accept-enckey"]).toBe("string");
    expect(headers["accept-enckey"].length).toBeGreaterThan(0);
  });

  it("passes startDate and endDate as sdate and edate params", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ records: [] }), { status: 200 }));

    await bondCovIssueCninfo("20200101", "20201231");

    const calledUrl = getCallUrl(mockFetch);
    expect(calledUrl).toContain("sdate=2020-01-01");
    expect(calledUrl).toContain("edate=2020-12-31");
  });

  it("handles records with null numeric and date fields", async () => {
    const partialRecord = {
      SECCODE: "123456",
      SECNAME: "测试转债",
      DECLAREDATE: "2023-03-15 00:00:00",
      F002D: null,
      F003D: null,
      F005N: null,
      F006N: null,
      F007N: null,
      F008N: null,
      F001V: null,
      F003N: null,
    };
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ records: [partialRecord] }), { status: 200 }),
    );

    const result = await bondCovIssueCninfo("20230101", "20231231");
    const record = result[0];

    expect(record.bondCode).toBe("123456");
    expect(record.bondName).toBe("测试转债");
    expect(record.issueStartDate).toBeNull();
    expect(record.issueEndDate).toBeNull();
    expect(record.plannedIssueAmount).toBeNull();
    expect(record.actualIssueAmount).toBeNull();
    expect(record.faceValue).toBeNull();
    expect(record.issuePrice).toBeNull();
    expect(record.initialConvertPrice).toBeNull();
  });
});

describe("bondCovStockIssueCninfo", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const stockIssueRawRecord = {
    SECCODE: "113050",
    SECNAME: "南银转债",
    DECLAREDATE: "2024-09-10 00:00:00",
    F001V: "191549",
    F002V: "南银转股",
    F003N: 10.25,
    F004D: "2021-12-20 00:00:00",
    F005D: "2026-06-14 00:00:00",
    F017V: "南京银行",
    BONDNAME: "南京银行股份有限公司可转换公司债券",
  };

  it("returns mapped records from POST response", async () => {
    const responseBody = { records: [stockIssueRawRecord] };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), { status: 200 }));

    const result = await bondCovStockIssueCninfo();

    expect(result).toHaveLength(1);
    const record = result[0];

    expect(record.bondCode).toBe("113050");
    expect(record.bondName).toBe("南银转债");
    expect(record.announceDate).toBe("2024-09-10");
    expect(record.convertCode).toBe("191549");
    expect(record.convertShortName).toBe("南银转股");
    expect(record.convertPrice).toBe(10.25);
    expect(record.voluntaryConvertStartDate).toBe("2021-12-20");
    expect(record.voluntaryConvertEndDate).toBe("2026-06-14");
    expect(record.underlyingStock).toBe("南京银行");
    expect(record.bondFullName).toBe("南京银行股份有限公司可转换公司债券");
  });

  it("returns empty array when no records", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ records: [] }), { status: 200 }));

    const result = await bondCovStockIssueCninfo();

    expect(result).toEqual([]);
  });

  it("returns empty array when records field is absent", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "no data" }), { status: 200 }),
    );

    const result = await bondCovStockIssueCninfo();

    expect(result).toEqual([]);
  });

  it("verifies field mappings from raw record", async () => {
    const responseBody = { records: [stockIssueRawRecord] };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(responseBody), { status: 200 }));

    const result = await bondCovStockIssueCninfo();
    const record = result[0];

    // SECCODE -> bondCode
    expect(record.bondCode).toBe("113050");
    // SECNAME -> bondName
    expect(record.bondName).toBe("南银转债");
    // DECLAREDATE -> announceDate
    expect(record.announceDate).toBe("2024-09-10");
    // F001V -> convertCode
    expect(record.convertCode).toBe("191549");
    // F002V -> convertShortName
    expect(record.convertShortName).toBe("南银转股");
    // F003N -> convertPrice
    expect(record.convertPrice).toBe(10.25);
    // F004D -> voluntaryConvertStartDate
    expect(record.voluntaryConvertStartDate).toBe("2021-12-20");
    // F005D -> voluntaryConvertEndDate
    expect(record.voluntaryConvertEndDate).toBe("2026-06-14");
    // F017V -> underlyingStock
    expect(record.underlyingStock).toBe("南京银行");
    // BONDNAME -> bondFullName
    expect(record.bondFullName).toBe("南京银行股份有限公司可转换公司债券");
  });

  it("verifies Accept-Enckey header is set (AES token)", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ records: [] }), { status: 200 }));

    await bondCovStockIssueCninfo();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const headers = getCallHeaders(mockFetch);

    expect(headers).toHaveProperty("accept-enckey");
    expect(typeof headers["accept-enckey"]).toBe("string");
    expect(headers["accept-enckey"].length).toBeGreaterThan(0);
  });

  it("calls the correct API endpoint", async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ records: [] }), { status: 200 }));

    await bondCovStockIssueCninfo();

    const calledUrl = getCallUrl(mockFetch);
    expect(calledUrl).toBe("http://webapi.cninfo.com.cn/api/sysapi/p_sysapi1124");
  });

  it("handles records with null numeric and date fields", async () => {
    const partialRecord = {
      SECCODE: "110085",
      SECNAME: "中信转债",
      DECLAREDATE: "2023-05-20 00:00:00",
      F001V: "190085",
      F002V: "中信转股",
      F003N: null,
      F004D: null,
      F005D: null,
      F017V: "中信证券",
      BONDNAME: "中信证券股份有限公司可转换公司债券",
    };
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ records: [partialRecord] }), { status: 200 }),
    );

    const result = await bondCovStockIssueCninfo();
    const record = result[0];

    expect(record.bondCode).toBe("110085");
    expect(record.bondName).toBe("中信转债");
    expect(record.convertPrice).toBeNull();
    expect(record.voluntaryConvertStartDate).toBeNull();
    expect(record.voluntaryConvertEndDate).toBeNull();
  });
});
