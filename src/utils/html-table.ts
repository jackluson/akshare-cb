import * as cheerio from "cheerio";

export interface HtmlTable {
  headers: string[];
  rows: string[][];
}

/**
 * Parse all HTML tables from a page.
 * Replaces Python's pd.read_html().
 */
export function parseAllHtmlTables(html: string): HtmlTable[] {
  const $ = cheerio.load(html);
  const tables: HtmlTable[] = [];

  $("table").each((_index, tableEl) => {
    const table = parseSingleTable($, tableEl);
    if (table.headers.length > 0 && table.rows.length > 0) {
      tables.push(table);
    }
  });

  return tables;
}

/**
 * Parse a single HTML table by index.
 * Returns null if the table doesn't exist.
 */
export function parseHtmlTable(html: string, tableIndex = 0): HtmlTable | null {
  const tables = parseAllHtmlTables(html);
  return tables[tableIndex] ?? null;
}

/**
 * Parse an HTML table into an array of records (key-value pairs).
 * Uses the first row as headers.
 */
export function parseHtmlTableAsRecords(html: string, tableIndex = 0): Record<string, string>[] {
  const table = parseHtmlTable(html, tableIndex);
  if (!table) return [];

  return table.rows.map((row) => {
    const record: Record<string, string> = {};
    for (let i = 0; i < table.headers.length; i++) {
      const key = table.headers[i];
      record[key] = row[i] ?? "";
    }
    return record;
  });
}

/**
 * Parse a wide table (N columns) as multiple key-value pairs.
 * Splits columns into pairs: [col0, col1], [col2, col3], ...
 * Then merges all pairs into a single record.
 *
 * This handles the Sina bond summary pattern where 6 columns
 * represent 3 key-value pairs side by side.
 */
export function parseHtmlTableAsKVPairs(html: string, tableIndex = 0): Record<string, string> {
  const table = parseHtmlTable(html, tableIndex);
  if (!table || table.rows.length === 0) return {};

  const result: Record<string, string> = {};
  for (const row of table.rows) {
    for (let i = 0; i + 1 < row.length; i += 2) {
      const key = row[i].trim();
      const value = row[i + 1].trim();
      if (key) {
        result[key] = value;
      }
    }
  }
  return result;
}

function parseSingleTable($: cheerio.CheerioAPI, tableEl: Parameters<typeof $>[0]): HtmlTable {
  const $table = $(tableEl);

  // Extract headers from <thead><tr><th> or first <tr> with <th>
  const headers: string[] = [];
  const thElements = $table.find("thead th, thead td");
  if (thElements.length > 0) {
    thElements.each((_i, el) => {
      headers.push($(el).text().trim());
    });
  } else {
    // Try first row of tbody for th elements
    const firstRowTh = $table.find("tr").first().find("th, td");
    firstRowTh.each((_i, el) => {
      headers.push($(el).text().trim());
    });
  }

  // Extract rows
  const rows: string[][] = [];
  const rowSelector = headers.length > 0 && $table.find("thead").length > 0 ? "tbody tr" : "tr";

  let startIdx = 0;
  // Skip header row if it was found in the body (no thead)
  if ($table.find("thead").length === 0 && headers.length > 0) {
    startIdx = 1;
  }

  $table.find(rowSelector).each((_i, trEl) => {
    if (_i < startIdx) return;
    const cells: string[] = [];
    $(trEl)
      .find("td, th")
      .each((_j, cellEl) => {
        cells.push($(cellEl).text().trim());
      });
    if (cells.length > 0) {
      rows.push(cells);
    }
  });

  return { headers, rows };
}
