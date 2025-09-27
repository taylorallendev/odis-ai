/**
 * Request validation using Zod schemas
 */

import { z } from "zod";

// Request validation schemas
export const generateSoapNotesRequestSchema = z.object({
  transcription: z
    .string()
    .min(1, "Transcription is required")
    .max(50000, "Transcription is too long")
    .refine(
      (val) => val.trim().length > 0,
      "Transcription cannot be empty or whitespace only"
    ),
});

// Response validation schemas
export const generateSoapNotesResponseSchema = z.object({
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.string(),
});

// Runtime validation helpers
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Validation failed: ${formattedErrors.join(", ")}`);
    }
    throw error;
  }
}

export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return {
        success: false,
        error: `Validation failed: ${formattedErrors.join(", ")}`,
      };
    }
    return {
      success: false,
      error: `Unexpected validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
