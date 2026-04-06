/**
 * Parse a date value safely. Returns YYYY-MM-DD string or null.
 */
export function parseDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return formatDate(value);
  }
  const str = String(value).trim();
  if (!str || str === "-") return null;

  // Try ISO format: YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Try YYYYMMDD
  const compactMatch = str.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`;
  }

  // Try DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  // Fallback: try native parsing
  const parsed = Date.parse(str);
  if (!Number.isNaN(parsed)) {
    return formatDate(new Date(parsed));
  }

  return null;
}

/**
 * Format a Date to YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format a YYYYMMDD string to YYYY-MM-DD.
 */
export function formatFlexDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

/**
 * Parse a datetime value safely. Returns YYYY-MM-DD HH:mm:ss string or null.
 */
export function parseDateTime(value: unknown): string | null {
  if (value == null || value === "") return null;
  const str = String(value).trim();
  if (!str) return null;

  const parsed = Date.parse(str);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    return `${formatDate(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  }
  return null;
}
