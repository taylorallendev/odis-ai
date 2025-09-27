/**
 * Configuration management for the Edge Function
 */

export interface Config {
  anthropic: {
    apiKey: string;
    baseUrl: string;
    model: string;
    maxTokens: number;
    apiVersion: string;
    timeout: number;
    retries: {
      maxRetries: number;
      baseDelay: number;
      maxDelay: number;
    };
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    requestsPerMinute: number;
    windowMs: number;
  };
  request: {
    maxBodySize: number;
    timeout: number;
  };
}

export function getConfig(): Config {
  const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
  
  if (!anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  return {
    anthropic: {
      apiKey: anthropicApiKey,
      baseUrl: "https://api.anthropic.com/v1",
      model: "claude-sonnet-4-20250514",
      maxTokens: 2000,
      apiVersion: "2023-06-01",
      timeout: 300000, // 5 minutes
      retries: {
        maxRetries: 2,
        baseDelay: 1000,
        maxDelay: 8000,
      },
    },
    cors: {
      allowedOrigins: ["*"], // Configure based on your needs
      allowedMethods: ["POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    rateLimit: {
      requestsPerMinute: 60,
      windowMs: 60000,
    },
    request: {
      maxBodySize: 1024 * 1024, // 1MB
      timeout: 300000, // 5 minutes
    },
  };
}