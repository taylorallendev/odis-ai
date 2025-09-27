/**
 * Common types used across the application
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  correlationId: string;
  timestamp: string;
}

export interface LogContext {
  correlationId: string;
  function: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  timeoutMs: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  retryAfter?: number;
}