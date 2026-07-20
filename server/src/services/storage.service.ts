import fs from "fs";
import path from "path";

// Fallback local-JSON store so the app stays functional even if MongoDB
// is briefly unreachable. Not a replacement for Mongo — just a safety net
// for demo/offline reliability.

const DATA_DIR = path.join(__dirname, "../../.local-data");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function readLocal<T>(fileName: string): T[] {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function writeLocal<T>(fileName: string, data: T[]) {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function appendLocal<T>(fileName: string, entry: T) {
  const current = readLocal<T>(fileName);
  current.push(entry);
  writeLocal(fileName, current);
  return entry;
}