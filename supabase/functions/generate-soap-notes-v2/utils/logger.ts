/**
 * Structured logging utilities
 */

import type { LogContext } from "../types/common.ts";

export class Logger {
  private correlationId: string;

  constructor(correlationId: string) {
    this.correlationId = correlationId;
  }

  private createLogEntry(
    level: LogContext["level"],
    message: string,
    data?: Record<string, unknown>
  ): LogContext {
    return {
      correlationId: this.correlationId,
      function: "generate-soap-notes",
      level,
      timestamp: new Date().toISOString(),
      data: {
        message,
        ...data,
      },
    };
  }

  info(message: string, data?: Record<string, unknown>) {
    const logEntry = this.createLogEntry("info", message, data);
    console.log(JSON.stringify(logEntry));
  }

  warn(message: string, data?: Record<string, unknown>) {
    const logEntry = this.createLogEntry("warn", message, data);
    console.warn(JSON.stringify(logEntry));
  }

  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    const logEntry = this.createLogEntry("error", message, {
      ...data,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });
    console.error(JSON.stringify(logEntry));
  }

  debug(message: string, data?: Record<string, unknown>) {
    const logEntry = this.createLogEntry("debug", message, data);
    console.debug(JSON.stringify(logEntry));
  }

  // Performance timing utility
  time<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    this.debug(`Starting operation: ${operation}`);

    return fn().then(
      (result) => {
        const duration = performance.now() - startTime;
        this.info(`Operation completed: ${operation}`, {
          durationMs: duration,
        });
        return result;
      },
      (error) => {
        const duration = performance.now() - startTime;
        this.error(`Operation failed: ${operation}`, error, {
          durationMs: duration,
        });
        throw error;
      }
    );
  }
}

export function generateCorrelationId(): string {
  return `soap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
