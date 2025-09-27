/**
 * Supabase Edge Function for generating SOAP notes from veterinary transcriptions
 *
 * This function processes non-diarized transcription text and generates structured
 * SOAP notes using AI. The transcription input is raw text without speaker segments.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Import configuration and utilities
import { getConfig } from "./config/index.ts";
import { generateCorrelationId, Logger } from "./utils/logger.ts";
import { createErrorResponse, ValidationError } from "./utils/errors.ts";
import {
  validateRequest,
  generateSoapNotesRequestSchema,
} from "./utils/validation.ts";

// Import services
import { AnthropicService } from "./services/anthropic.service.ts";
import { PromptsService } from "./services/prompts.service.ts";
import { SoapService } from "./services/soap.service.ts";

// Import middleware
import { CorsMiddleware } from "./middleware/cors.ts";
import { SecurityMiddleware } from "./middleware/security.ts";
import { RateLimitMiddleware } from "./middleware/rate-limit.ts";

// Import types
import type { GenerateSoapNotesRequest } from "./types/requests.ts";
import type { GenerateSoapNotesResponse } from "./types/soap.ts";

Deno.serve(async (req: Request): Promise<Response> => {
  const correlationId = generateCorrelationId();
  const logger = new Logger(correlationId);

  logger.info("SOAP notes generation request received", {
    method: req.method,
    url: req.url,
  });

  try {
    // Load configuration
    const config = getConfig();

    // Initialize middleware
    const corsMiddleware = new CorsMiddleware(config.cors);
    const securityMiddleware = new SecurityMiddleware(config.request, logger);
    const rateLimitMiddleware = new RateLimitMiddleware(
      config.rateLimit,
      logger
    );

    // Handle CORS preflight requests
    if (corsMiddleware.isPreflightRequest(req)) {
      logger.info("Handling CORS preflight request");
      return corsMiddleware.handlePreflight();
    }

    // Validate request method and headers
    securityMiddleware.validateRequest(req);

    // Check rate limits
    rateLimitMiddleware.checkRateLimit(req);

    // Parse and validate request body
    const requestBody = await securityMiddleware.validateRequestBody(req);
    const validatedRequest = validateRequest(
      generateSoapNotesRequestSchema,
      requestBody
    ) as GenerateSoapNotesRequest;

    // Sanitize the transcription input (note: input is not diarized)
    const sanitizedTranscription = securityMiddleware.sanitizeInput(
      validatedRequest.transcription
    );

    logger.info("Request validated successfully", {
      transcriptionLength: sanitizedTranscription.length,
    });

    // Initialize services
    const anthropicService = new AnthropicService(config.anthropic, logger);
    const promptsService = new PromptsService();
    const soapService = new SoapService(
      anthropicService,
      promptsService,
      logger
    );

    // Generate SOAP notes
    const result = await logger.time("soap-generation", async () => {
      return await soapService.generateSoapNotes(sanitizedTranscription);
    });

    if (!result.success) {
      logger.error("SOAP generation failed", null, { error: result.error });
      throw new ValidationError(result.error || "SOAP generation failed");
    }

    logger.info("SOAP notes generated successfully");

    // Create successful response
    const responseData: GenerateSoapNotesResponse = result.data!;
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
    });

    // Add middleware headers
    const corsResponse = corsMiddleware.addCorsHeaders(response);
    const secureResponse = securityMiddleware.addSecurityHeaders(corsResponse);

    return secureResponse;
  } catch (error) {
    logger.error("Request processing failed", error);

    const errorResponse = createErrorResponse(error, correlationId);

    // Add CORS headers to error responses
    try {
      const config = getConfig();
      const corsMiddleware = new CorsMiddleware(config.cors);
      return corsMiddleware.addCorsHeaders(errorResponse);
    } catch {
      return errorResponse;
    }
  }
});
