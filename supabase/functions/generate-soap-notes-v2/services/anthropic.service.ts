/**
 * Anthropic API service with retry logic and error handling
 */

import type { Config } from "../config/index.ts";
import type {
  AnthropicRequest,
  AnthropicResponse,
  AnthropicError,
} from "../types/anthropic.ts";
import type { ServiceResponse } from "../types/common.ts";
import type { Logger } from "../utils/logger.ts";

export class AnthropicService {
  private config: Config["anthropic"];
  private logger: Logger;

  constructor(config: Config["anthropic"], logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async callWithRetry(
    systemPrompt: string,
    userPrompt: string,
    maxRetries?: number
  ): Promise<ServiceResponse<string>> {
    const retries = maxRetries ?? this.config.retries.maxRetries;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        this.logger.debug(
          `Making Anthropic API call (attempt ${attempt + 1}/${retries + 1})`
        );

        const result = await this.makeApiCall(systemPrompt, userPrompt);

        if (result.success) {
          this.logger.info("Anthropic API call successful", {
            attempt: attempt + 1,
          });
          return result;
        }

        // If this is the last attempt, return the error
        if (attempt === retries) {
          return result;
        }

        // Calculate delay for next attempt
        const delay = Math.min(
          this.config.retries.baseDelay * Math.pow(2, attempt),
          this.config.retries.maxDelay
        );

        this.logger.warn(`API call failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          error: result.error,
        });

        await this.delay(delay);
      } catch (error) {
        this.logger.error(
          `Unexpected error in API call attempt ${attempt + 1}`,
          error
        );

        if (attempt === retries) {
          return {
            success: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }

        // Calculate delay for next attempt
        const delay = Math.min(
          this.config.retries.baseDelay * Math.pow(2, attempt),
          this.config.retries.maxDelay
        );

        await this.delay(delay);
      }
    }

    return {
      success: false,
      error: "Maximum retry attempts exceeded",
    };
  }

  private async makeApiCall(
    systemPrompt: string,
    userPrompt: string
  ): Promise<ServiceResponse<string>> {
    const requestBody: AnthropicRequest = {
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": this.config.apiVersion,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.safeParseJson<AnthropicError>(response);

        this.logger.error("Anthropic API error", null, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        const retryAfter = this.parseRetryAfter(
          response.headers.get("retry-after")
        );

        return {
          success: false,
          error: `HTTP ${response.status}: ${errorData?.error?.message || response.statusText}`,
          retryAfter,
        };
      }

      const data = await this.safeParseJson<AnthropicResponse>(response);

      if (!data?.content?.[0]?.text) {
        return {
          success: false,
          error: "Invalid response format from Anthropic API",
        };
      }

      return {
        success: true,
        data: data.content[0].text,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        this.logger.error("API call timed out", error);
        return {
          success: false,
          error: `Request timed out after ${this.config.timeout}ms`,
        };
      }

      this.logger.error("Network error in API call", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  private async safeParseJson<T>(response: Response): Promise<T | null> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      this.logger.warn("Failed to parse JSON response", { error });
      return null;
    }
  }

  private parseRetryAfter(retryAfterHeader: string | null): number | undefined {
    if (!retryAfterHeader) return undefined;

    const seconds = parseInt(retryAfterHeader, 10);
    return isNaN(seconds) ? undefined : seconds * 1000; // Convert to milliseconds
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
