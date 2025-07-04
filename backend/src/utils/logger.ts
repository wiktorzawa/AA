interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: unknown;
}

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private currentLevel: LogLevel;

  constructor() {
    this.currentLevel = (process.env.LOG_LEVEL as LogLevel) || "info";
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): void {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
    };

    if (data !== undefined) {
      logEntry.data = data;
    }

    const output = JSON.stringify(logEntry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }

  debug(message: string, data?: unknown): void {
    this.formatMessage("debug", message, data);
  }

  info(message: string, data?: unknown): void {
    this.formatMessage("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.formatMessage("warn", message, data);
  }

  error(message: string, data?: unknown): void {
    this.formatMessage("error", message, data);
  }
}

export const logger = new Logger();
