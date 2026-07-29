import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { badRequest } from "./error";

// ============================================================
// Multer config for CSV / XLSX / JSON uploads
// Stored in memory (small analyzer files) — no disk writes.
// ============================================================

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_MIME = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/json",
  "text/plain",   // some browsers send this for .csv
]);

const ALLOWED_EXT = /\.(csv|xlsx|xls|json)$/i;

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const okMime = ALLOWED_MIME.has(file.mimetype);
  const okExt  = ALLOWED_EXT.test(file.originalname);

  if (!okMime && !okExt) {
    cb(badRequest(`Unsupported file type: ${file.mimetype || file.originalname}. Use CSV, XLSX, or JSON.`));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

// Convenience: single field named "file"
export const uploadSingle = upload.single("file");