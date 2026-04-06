import { ParseError } from "../errors.js";

/**
 * Parse JSON leniently — handles non-standard JSON such as
 * unquoted keys, trailing commas, single-quoted strings, etc.
 * Replaces Python's demjson.decode().
 */
export function lenientJsonParse<T = unknown>(text: string): T {
  // Try standard JSON.parse first
  try {
    return JSON.parse(text) as T;
  } catch {
    // fall through to lenient parsing
  }

  let cleaned = text.trim();

  // Remove JSONP wrapper: callback({...}) or callback([...])
  const jsonpMatch = cleaned.match(/^[a-zA-Z_$][\w$]*\s*\(([\s\S]*)\)\s*;?\s*$/);
  if (jsonpMatch) {
    cleaned = jsonpMatch[1].trim();
  }

  // Remove trailing comma before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // Quote unquoted keys: {key: ...} or , key: ...
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_$][\w$]*)\s*:/g, '$1"$2":');

  // Replace single-quoted strings with double-quoted
  cleaned = cleaned.replace(/'([^']*)'/g, '"$1"');

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new ParseError(
      `Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`,
      text.slice(0, 500),
    );
  }
}
