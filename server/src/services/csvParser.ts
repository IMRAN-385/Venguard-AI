import Papa from "papaparse";
import { badRequest } from "../middleware/error";

// ============================================================
// CSV / JSON parsing for the Data Analyzer (Agent 04)
//
// XLSX support is intentionally deferred — client can export
// XLSX → CSV, which keeps deps light and this file testable.
// ============================================================

export interface ParsedFinancials {
  headers: string[];
  rows:    Record<string, string | number>[];
  format:  "csv" | "json";
  rowCount: number;
}

/**
 * Parse an uploaded file buffer into normalized rows.
 */
export function parseFile(file: Express.Multer.File): ParsedFinancials {
  const name  = file.originalname.toLowerCase();
  const isJson = name.endsWith(".json") || file.mimetype === "application/json";

  if (isJson) return parseJson(file.buffer.toString("utf8"));
  return parseCsv(file.buffer.toString("utf8"));
}

// ------------------------------------------------------------
function parseCsv(text: string): ParsedFinancials {
  const result = Papa.parse<Record<string, string>>(text, {
    header:            true,
    skipEmptyLines:    true,
    dynamicTyping:     true,
    transformHeader:   (h) => h.trim(),
  });

  if (result.errors.length > 0) {
    throw badRequest(`CSV parse error on row ${result.errors[0].row}: ${result.errors[0].message}`);
  }

  const rows    = (result.data as Record<string, string | number>[]).filter(nonEmpty);
  const headers = result.meta.fields ?? Object.keys(rows[0] ?? {});

  return { headers, rows, rowCount: rows.length, format: "csv" };
}

// ------------------------------------------------------------
function parseJson(text: string): ParsedFinancials {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw badRequest(`Invalid JSON: ${(err as Error).message}`);
  }

  const rows = Array.isArray(parsed)
    ? (parsed as Record<string, string | number>[])
    : Array.isArray((parsed as { rows?: unknown }).rows)
      ? ((parsed as { rows: Record<string, string | number>[] }).rows)
      : [parsed as Record<string, string | number>];

  const headers = rows[0] ? Object.keys(rows[0]) : [];
  return { headers, rows: rows.filter(nonEmpty), rowCount: rows.length, format: "json" };
}

// ------------------------------------------------------------
function nonEmpty(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => v !== null && v !== undefined && v !== "");
}