/**
 * CORS middleware for handling cross-origin requests
 */

import type { Config } from "../config/index.ts";

export class CorsMiddleware {
  private config: Config["cors"];

  constructor(config: Config["cors"]) {
    this.config = config;
  }

  handlePreflight(): Response {
    return new Response(null, {
      status: 204,
      headers: this.getCorsHeaders(),
    });
  }

  addCorsHeaders(response: Response): Response {
    const corsHeaders = this.getCorsHeaders();

    // Clone the response and add CORS headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...corsHeaders,
      },
    });

    return newResponse;
  }

  private getCorsHeaders(): Record<string, string> {
    return {
      "Access-Control-Allow-Origin": this.config.allowedOrigins.join(", "),
      "Access-Control-Allow-Methods": this.config.allowedMethods.join(", "),
      "Access-Control-Allow-Headers": this.config.allowedHeaders.join(", "),
      "Access-Control-Max-Age": "86400", // 24 hours
    };
  }

  isPreflightRequest(request: Request): boolean {
    return (
      request.method === "OPTIONS" &&
      request.headers.has("Access-Control-Request-Method")
    );
  }
}
