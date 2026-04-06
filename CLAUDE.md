# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run check        # full CI gate: typecheck + lint + test
pnpm run typecheck    # tsc --noEmit
pnpm run lint         # biome check src __tests__
pnpm run lint:fix     # biome check --write src __tests__
pnpm test             # vitest run (111 tests)
pnpm test:watch       # vitest in watch mode
pnpm test -- __tests__/sources/eastmoney.test.ts   # single test file
pnpm docs             # typedoc → docs/ (Markdown via typedoc-plugin-markdown)
pnpm run build        # tsc → dist/
```

## Architecture

This is a TypeScript/Node.js library (`akshare-cb`) that re-implements Python akshare's convertible bond (可转债) interfaces. 17 async functions across 5 data sources.

### Source layout

- **`src/sources/`** — one file per data source, each containing exported async functions that fetch and transform data
- **`src/types/`** — one file per data source defining return type interfaces with JSDoc field comments
- **`src/utils/`** — shared utilities (HTTP retry, JSON/HTML parsing, date/numeric conversion, JS VM runner)
- **`src/index.ts`** — barrel export of all functions, types, and error classes

### Data flow pattern

Every source function follows: HTTP request → parse response (JSON/HTML) → map raw fields to typed records via `toNumeric()` / `parseDate()`. Raw API field names (e.g. `SECURITY_CODE`, `f12`) are mapped to camelCase TypeScript fields (e.g. `bondCode`).

### Key utilities

- `http.ts` — `fetchJson()` / `fetchText()` with exponential backoff retry (3 attempts, handles 429/5xx)
- `pagination.ts` — auto-paginates East Money APIs (detects total pages, fetches with random delay)
- `lenient-json.ts` — handles non-standard JSON (unquoted keys, trailing commas, JSONP wrappers). Replaces Python's `demjson`
- `html-table.ts` — cheerio-based table parsing (`parseHtmlTableAsRecords`, `parseHtmlTableAsKVPairs`). Replaces `pd.read_html()`
- `js-runner.ts` — `runJsFunction()` using Node `vm` module. Replaces Python's `py_mini_racer`
- `numeric.ts` — `toNumeric()` returns `number | null`, strips commas/percentages. Replaces `pd.to_numeric(errors="coerce")`

### Data sources

| Source | Auth | Request type | Notes |
|--------|------|-------------|-------|
| 东方财富 (East Money) | None | JSON (datacenter/push2 APIs) | Pagination required |
| 新浪 (Sina) | None | JSON/HTML, encrypted K-line | `hk_js_decode.js` via vm runner |
| 集思录 (Jisilu) | Cookie for list | JSON/HTML | `lenientJsonParse` needed |
| 同花顺 (THS) | None | JSON | Simplest source |
| 巨潮资讯 (cninfo) | AES token (auto) | POST JSON | Token via `crypto.createCipheriv` |

### Error hierarchy

`AkshareError` (base, has `message` + `code`) → `NetworkError` (`statusCode`), `ParseError` (`raw`), `ValidationError` (`field`), `AuthenticationError`

### Testing pattern

Tests mock global `fetch` via `vi.stubGlobal("fetch", mockFetch)` and verify field mapping from fixture data. No real network calls in tests.

## Code style

- Biome with 2-space indent, double quotes, semicolons, trailing commas, line width 100
- `noNonNullAssertion: off`, `noExplicitAny: warn`
- `src/scripts/**` excluded from lint (contains obfuscated JS)
- TypeScript strict mode with `noUnusedLocals` / `noUnusedParameters`

## Bilingual README

- `README.md` — Chinese (primary)
- `README-EN.md` — English, linked from top of each file
