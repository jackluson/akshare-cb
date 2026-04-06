/**
 * Safely convert a value to a number.
 * Returns null if the value cannot be converted (replaces pd.to_numeric with errors="coerce").
 */
export function toNumeric(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }
  const str = String(value).trim().replace(/,/g, "").replace(/%/g, "");
  if (str === "" || str === "-") return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
}
