/**
 * Rate limiting middleware
 */

import { RateLimitError } from "../utils/errors.ts";
import type { Config } from "../config/index.ts";
import type { Logger } from "../utils/logger.ts";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimitMiddleware {
  private config: Config["rateLimit"];
  private logger: Logger;
  private static requestCounts = new Map<string, RateLimitEntry>();

  constructor(config: Config["rateLimit"], logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  checkRateLimit(request: Request): void {
    // Get client identifier (IP address or API key)
    const clientId = this.getClientId(request);
    const now = Date.now();

    // Clean up expired entries
    this.cleanupExpiredEntries(now);

    // Get or create rate limit entry for this client
    let entry = RateLimitMiddleware.requestCounts.get(clientId);

    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
      RateLimitMiddleware.requestCounts.set(clientId, entry);
    }

    // Check if the window has expired
    if (now >= entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    // Check if rate limit is exceeded
    if (entry.count >= this.config.requestsPerMinute) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      this.logger.warn("Rate limit exceeded", {
        clientId,
        count: entry.count,
        limit: this.config.requestsPerMinute,
        retryAfterSeconds: retryAfter,
      });

      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds`,
        crypto.randomUUID(),
        retryAfter
      );
    }

    // Increment the count
    entry.count++;

    this.logger.debug("Rate limit check passed", {
      clientId,
      count: entry.count,
      limit: this.config.requestsPerMinute,
      remaining: this.config.requestsPerMinute - entry.count,
    });
  }

  private getClientId(request: Request): string {
    // Try to get IP from headers (in production, this might come from a proxy)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = request.headers.get("cf-connecting-ip"); // Cloudflare

    // Use the first available IP
    const ip =
      forwarded?.split(",")[0]?.trim() || realIp || clientIp || "unknown";

    // You could also use API keys if available
    const apiKey = request.headers.get("authorization")?.split(" ")[1];

    return apiKey ? `api:${apiKey}` : `ip:${ip}`;
  }

  private cleanupExpiredEntries(now: number): void {
    // Clean up expired entries to prevent memory leaks
    for (const [
      clientId,
      entry,
    ] of RateLimitMiddleware.requestCounts.entries()) {
      if (now >= entry.resetTime && entry.count === 0) {
        RateLimitMiddleware.requestCounts.delete(clientId);
      }
    }
  }

  addRateLimitHeaders(response: Response, clientId?: string): Response {
    if (!clientId) return response;

    const entry = RateLimitMiddleware.requestCounts.get(clientId);
    if (!entry) return response;

    const remaining = Math.max(0, this.config.requestsPerMinute - entry.count);
    const resetTime = Math.ceil((entry.resetTime - Date.now()) / 1000);

    const rateLimitHeaders = {
      "X-RateLimit-Limit": this.config.requestsPerMinute.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": resetTime.toString(),
    };

    // Clone the response and add rate limit headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...rateLimitHeaders,
      },
    });

    return newResponse;
  }
}
