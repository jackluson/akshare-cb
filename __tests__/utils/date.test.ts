import { describe, expect, it } from "vitest";
import { formatDate, formatFlexDate, parseDate, parseDateTime } from "../../src/utils/date.ts";

describe("parseDate", () => {
  it("parses ISO date string", () => {
    expect(parseDate("2024-01-15")).toBe("2024-01-15");
  });

  it("parses compact YYYYMMDD", () => {
    expect(parseDate("20240115")).toBe("2024-01-15");
  });

  it("parses DD/MM/YYYY", () => {
    expect(parseDate("15/01/2024")).toBe("2024-01-15");
  });

  it("returns null for null/undefined/empty", () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate("")).toBeNull();
    expect(parseDate("-")).toBeNull();
  });

  it("parses Date objects", () => {
    expect(parseDate(new Date(2024, 0, 15))).toBe("2024-01-15");
  });
});

describe("formatDate", () => {
  it("formats Date to YYYY-MM-DD", () => {
    expect(formatDate(new Date(2024, 5, 1))).toBe("2024-06-01");
  });

  it("pads month and day", () => {
    expect(formatDate(new Date(2024, 0, 5))).toBe("2024-01-05");
  });
});

describe("formatFlexDate", () => {
  it("converts YYYYMMDD to YYYY-MM-DD", () => {
    expect(formatFlexDate("20240115")).toBe("2024-01-15");
  });

  it("passes through already formatted dates", () => {
    expect(formatFlexDate("2024-01-15")).toBe("2024-01-15");
  });
});

describe("parseDateTime", () => {
  it("parses datetime strings", () => {
    const result = parseDateTime("2024-01-15 10:30:00");
    expect(result).toContain("2024-01-15");
    expect(result).toContain("10:30:00");
  });

  it("returns null for empty input", () => {
    expect(parseDateTime(null)).toBeNull();
    expect(parseDateTime("")).toBeNull();
  });
});
