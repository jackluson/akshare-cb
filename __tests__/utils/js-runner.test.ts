import { describe, expect, it } from "vitest";
import { ParseError } from "../../src/errors.ts";
import { runJsFunctionFromString } from "../../src/utils/js-runner.ts";

describe("runJsFunctionFromString", () => {
  it("runs a simple JS function", () => {
    const script = `
      function add(a, b) { return a + b; }
    `;
    expect(runJsFunctionFromString(script, "add", 2, 3)).toBe(5);
  });

  it("runs a function that returns an object", () => {
    const script = `
      function getData() { return { key: "value", count: 42 }; }
    `;
    const result = runJsFunctionFromString<Record<string, unknown>>(script, "getData");
    expect(result).toEqual({ key: "value", count: 42 });
  });

  it("runs a function that returns an array", () => {
    const script = `
      function getRange(n) {
        var result = [];
        for (var i = 0; i < n; i++) result.push(i);
        return result;
      }
    `;
    const result = runJsFunctionFromString<number[]>(script, "getRange", 5);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });

  it("throws ParseError for missing function", () => {
    const script = "var x = 1;";
    expect(() => runJsFunctionFromString(script, "nonexistent")).toThrow(ParseError);
  });

  it("throws ParseError for invalid script", () => {
    expect(() => runJsFunctionFromString("{{{invalid", "fn")).toThrow(ParseError);
  });

  it("provides Math and Date globals", () => {
    const script = `
      function compute() { return Math.floor(3.7); }
    `;
    expect(runJsFunctionFromString(script, "compute")).toBe(3);
  });
});
