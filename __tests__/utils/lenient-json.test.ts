import { describe, expect, it } from "vitest";
import { ParseError } from "../../src/errors.ts";
import { lenientJsonParse } from "../../src/utils/lenient-json.ts";

describe("lenientJsonParse", () => {
  it("parses standard JSON", () => {
    expect(lenientJsonParse('{"key": "value"}')).toEqual({ key: "value" });
  });

  it("parses standard JSON array", () => {
    expect(lenientJsonParse("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  it("parses JSON with trailing commas", () => {
    expect(lenientJsonParse('{"a": 1, "b": 2,}')).toEqual({ a: 1, b: 2 });
    expect(lenientJsonParse("[1, 2, 3,]")).toEqual([1, 2, 3]);
  });

  it("parses JSON with unquoted keys", () => {
    expect(lenientJsonParse('{key: "value"}')).toEqual({ key: "value" });
  });

  it("parses JSON with single-quoted strings", () => {
    expect(lenientJsonParse("{'key': 'value'}")).toEqual({ key: "value" });
  });

  it("strips JSONP wrapper", () => {
    expect(lenientJsonParse('callback({"key": "value"})')).toEqual({ key: "value" });
    expect(lenientJsonParse('jQuery123({"key": "value"});')).toEqual({ key: "value" });
  });

  it("handles mixed issues", () => {
    const input = "callback({key: 'value', items: [1,2,3],})";
    expect(lenientJsonParse(input)).toEqual({ key: "value", items: [1, 2, 3] });
  });

  it("throws ParseError for truly invalid input", () => {
    expect(() => lenientJsonParse("not json at all {{{")).toThrow(ParseError);
  });

  it("handles empty trimmed whitespace", () => {
    expect(() => lenientJsonParse("  ")).toThrow();
  });
});
