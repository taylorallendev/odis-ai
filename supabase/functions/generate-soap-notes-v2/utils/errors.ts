/**
 * Custom error classes and error handling utilities
 */

export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  readonly correlationId: string;
  readonly timestamp: string;

  constructor(message: string, correlationId: string) {
    super(message);
    this.name = this.constructor.name;
    this.correlationId = correlationId;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
    };
  }
}

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(`Validation failed: ${message}`, crypto.randomUUID());
  }
}

export class AnthropicAPIError extends BaseError {
  readonly statusCode: number;
  readonly code = "ANTHROPIC_API_ERROR";
  readonly retryAfter?: number;

  constructor(
    message: string,
    statusCode: number,
    correlationId: string,
    retryAfter?: number
  ) {
    super(`Anthropic API error: ${message}`, correlationId);
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }
}

export class SoapGenerationError extends BaseError {
  readonly statusCode = 500;
  readonly code = "SOAP_GENERATION_ERROR";

  constructor(message: string, correlationId: string) {
    super(`SOAP generation failed: ${message}`, correlationId);
  }
}

export class TimeoutError extends BaseError {
  readonly statusCode = 504;
  readonly code = "TIMEOUT_ERROR";

  constructor(message: string, correlationId: string) {
    super(`Operation timed out: ${message}`, correlationId);
  }
}

export class RateLimitError extends BaseError {
  readonly statusCode = 429;
  readonly code = "RATE_LIMIT_ERROR";
  readonly retryAfter?: number;

  constructor(message: string, correlationId: string, retryAfter?: number) {
    super(`Rate limit exceeded: ${message}`, correlationId);
    this.retryAfter = retryAfter;
  }
}

export function createErrorResponse(
  error: unknown,
  correlationId: string
): Response {
  if (error instanceof BaseError) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Correlation-ID": correlationId,
    };

    // Add retry-after header if applicable
    if ("retryAfter" in error && error.retryAfter) {
      headers["Retry-After"] = error.retryAfter.toString();
    }

    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        correlationId: error.correlationId,
        timestamp: error.timestamp,
      }),
      {
        status: error.statusCode,
        headers,
      }
    );
  }

  // Handle unknown errors
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  return new Response(
    JSON.stringify({
      error: errorMessage,
      code: "INTERNAL_ERROR",
      correlationId,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
    }
  );
}
