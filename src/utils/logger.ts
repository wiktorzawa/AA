const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private currentLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.currentLevel = "info"; // Można ustawić przez localStorage lub zmienne środowiskowe
    this.isDevelopment = import.meta.env.DEV;
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

    if (this.isDevelopment) {
      // W trybie deweloperskim loguj do konsoli w czytelnym formacie
      const timestamp = new Date().toLocaleTimeString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      if (data) {
        console.groupCollapsed(`${prefix} ${message}`);
        console.log(data);
        console.groupEnd();
      } else {
        switch (level) {
          case "error":
            console.error(`${prefix} ${message}`);
            break;
          case "warn":
            console.warn(`${prefix} ${message}`);
            break;
          case "debug":
            console.debug(`${prefix} ${message}`);
            break;
          default:
            console.log(`${prefix} ${message}`);
        }
      }
    } else {
      // W produkcji można wysyłać logi do zewnętrznego serwisu
      // W przyszłości można dodać wysyłanie do serwisu logowania
      // const logEntry: LogEntry = { timestamp: new Date().toISOString(), level: level.toUpperCase(), message, ...(data && { data }) };
      // sendToLoggingService(logEntry);
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
