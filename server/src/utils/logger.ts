// ============================================================
// Tiny colored logger — no external deps, works in all terminals.
//
//   logger.info("server up");
//   logger.warn("rate limit near");
//   logger.error("db down", err);
// ============================================================

const COLORS = {
  reset:   "\x1b[0m",
  gray:    "\x1b[90m",
  green:   "\x1b[32m",
  cyan:    "\x1b[36m",
  yellow:  "\x1b[33m",
  red:     "\x1b[31m",
  magenta: "\x1b[35m",
  bold:    "\x1b[1m",
} as const;

type Level = "debug" | "info" | "warn" | "error" | "success";

const LEVEL_STYLE: Record<Level, string> = {
  debug:   COLORS.gray,
  info:    COLORS.cyan,
  success: COLORS.green,
  warn:    COLORS.yellow,
  error:   COLORS.red,
};

function stamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function fmt(level: Level, msg: string): string {
  return `${COLORS.gray}${stamp()}${COLORS.reset} ${LEVEL_STYLE[level]}${COLORS.bold}[${level.toUpperCase()}]${COLORS.reset} ${msg}`;
}

export const logger = {
  debug(msg: string, meta?: unknown) {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.log(fmt("debug", msg), meta ?? "");
  },
  info(msg: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.log(fmt("info", msg), meta ?? "");
  },
  success(msg: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.log(fmt("success", msg), meta ?? "");
  },
  warn(msg: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.warn(fmt("warn", msg), meta ?? "");
  },
  error(msg: string, err?: unknown) {
    // eslint-disable-next-line no-console
    console.error(fmt("error", msg));
    if (err instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(`${COLORS.red}${err.stack ?? err.message}${COLORS.reset}`);
    } else if (err !== undefined) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
};