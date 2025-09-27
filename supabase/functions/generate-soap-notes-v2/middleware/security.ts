/**
 * Security middleware for adding security headers and validating requests
 */

import { ValidationError } from "../utils/errors.ts";
import type { Config } from "../config/index.ts";
import type { Logger } from "../utils/logger.ts";

export class SecurityMiddleware {
  private config: Config["request"];
  private logger: Logger;

  constructor(config: Config["request"], logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  validateRequest(request: Request): void {
    // Validate HTTP method
    if (request.method !== "POST") {
      throw new ValidationError("Only POST method is allowed");
    }

    // Validate content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new ValidationError("Content-Type must be application/json");
    }

    // Validate content length
    const contentLength = request.headers.get("content-length");
    if (contentLength) {
      const length = parseInt(contentLength, 10);
      if (length > this.config.maxBodySize) {
        throw new ValidationError(
          `Request body too large. Maximum size: ${this.config.maxBodySize} bytes`
        );
      }
    }

    this.logger.debug("Request validation passed", {
      method: request.method,
      contentType,
      contentLength,
    });
  }

  async validateRequestBody(request: Request): Promise<unknown> {
    try {
      // Set up timeout for reading the body
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const text = await request.text();
      clearTimeout(timeoutId);

      // Validate body size
      if (text.length > this.config.maxBodySize) {
        throw new ValidationError(
          `Request body too large. Maximum size: ${this.config.maxBodySize} bytes`
        );
      }

      // Parse JSON
      const body = JSON.parse(text);

      this.logger.debug("Request body parsed successfully", {
        bodySize: text.length,
      });

      return body;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      if (error instanceof SyntaxError) {
        throw new ValidationError("Invalid JSON in request body");
      }

      this.logger.error("Failed to parse request body", error);
      throw new ValidationError("Failed to parse request body");
    }
  }

  addSecurityHeaders(response: Response): Response {
    const securityHeaders = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy": "default-src 'none'",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    };

    // Clone the response and add security headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...securityHeaders,
      },
    });

    return newResponse;
  }

  sanitizeInput(input: string): string {
    // Basic XSS prevention - remove potential script content
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }
}
