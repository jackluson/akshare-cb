import { describe, expect, it } from "vitest";
import { toNumeric } from "../../src/utils/numeric.ts";

describe("toNumeric", () => {
  it("returns number for numeric input", () => {
    expect(toNumeric(123)).toBe(123);
    expect(toNumeric(0)).toBe(0);
    expect(toNumeric(-5.5)).toBe(-5.5);
  });

  it("parses numeric strings", () => {
    expect(toNumeric("123")).toBe(123);
    expect(toNumeric("45.67")).toBe(45.67);
    expect(toNumeric("-10")).toBe(-10);
  });

  it("strips commas", () => {
    expect(toNumeric("1,234,567")).toBe(1234567);
    expect(toNumeric("1,000.50")).toBe(1000.5);
  });

  it("strips percent signs", () => {
    expect(toNumeric("50%")).toBe(50);
    expect(toNumeric("3.14%")).toBe(3.14);
  });

  it("returns null for null/undefined/empty", () => {
    expect(toNumeric(null)).toBeNull();
    expect(toNumeric(undefined)).toBeNull();
    expect(toNumeric("")).toBeNull();
  });

  it("returns null for NaN", () => {
    expect(toNumeric(Number.NaN)).toBeNull();
    expect(toNumeric("abc")).toBeNull();
    expect(toNumeric("N/A")).toBeNull();
  });

  it("handles edge cases", () => {
    expect(toNumeric("-")).toBeNull();
    expect(toNumeric("  42  ")).toBe(42);
  });
});
