import { describe, expect, it } from "vitest";
import { parseAllHtmlTables, parseHtmlTable } from "../../src/utils/html-table.ts";

const SIMPLE_TABLE = `
<html><body>
<table>
  <thead><tr><th>Name</th><th>Value</th></tr></thead>
  <tbody>
    <tr><td>foo</td><td>123</td></tr>
    <tr><td>bar</td><td>456</td></tr>
  </tbody>
</table>
</body></html>
`;

const MULTI_TABLE = `
<html><body>
<table>
  <tr><th>A</th><th>B</th></tr>
  <tr><td>1</td><td>2</td></tr>
</table>
<table>
  <tr><th>X</th><th>Y</th><th>Z</th></tr>
  <tr><td>a</td><td>b</td><td>c</td></tr>
  <tr><td>d</td><td>e</td><td>f</td></tr>
</table>
</body></html>
`;

const HEADER_IN_BODY = `
<html><body>
<table>
  <tr><th>Col1</th><th>Col2</th></tr>
  <tr><td>val1</td><td>val2</td></tr>
</table>
</body></html>
`;

describe("parseAllHtmlTables", () => {
  it("parses a simple table", () => {
    const tables = parseAllHtmlTables(SIMPLE_TABLE);
    expect(tables).toHaveLength(1);
    expect(tables[0].headers).toEqual(["Name", "Value"]);
    expect(tables[0].rows).toEqual([
      ["foo", "123"],
      ["bar", "456"],
    ]);
  });

  it("parses multiple tables", () => {
    const tables = parseAllHtmlTables(MULTI_TABLE);
    expect(tables).toHaveLength(2);
    expect(tables[0].headers).toEqual(["A", "B"]);
    expect(tables[1].headers).toEqual(["X", "Y", "Z"]);
    expect(tables[1].rows).toHaveLength(2);
  });

  it("handles header row in tbody", () => {
    const tables = parseAllHtmlTables(HEADER_IN_BODY);
    expect(tables).toHaveLength(1);
    expect(tables[0].headers).toEqual(["Col1", "Col2"]);
    expect(tables[0].rows).toEqual([["val1", "val2"]]);
  });

  it("returns empty array for no tables", () => {
    const tables = parseAllHtmlTables("<html><body><p>no tables</p></body></html>");
    expect(tables).toHaveLength(0);
  });
});

describe("parseHtmlTable", () => {
  it("returns table by index", () => {
    const table = parseHtmlTable(MULTI_TABLE, 1);
    expect(table?.headers).toEqual(["X", "Y", "Z"]);
  });

  it("returns first table by default", () => {
    const table = parseHtmlTable(MULTI_TABLE);
    expect(table?.headers).toEqual(["A", "B"]);
  });

  it("returns null for non-existent index", () => {
    const table = parseHtmlTable(MULTI_TABLE, 99);
    expect(table).toBeNull();
  });
});
