/**
 * SOAP notes generation orchestration service
 */

import type { GenerateSoapNotesResponse } from "../types/soap.ts";
import type { ServiceResponse } from "../types/common.ts";
import type { Logger } from "../utils/logger.ts";
import type { AnthropicService } from "./anthropic.service.ts";
import type { PromptsService } from "./prompts.service.ts";

export class SoapService {
  private anthropicService: AnthropicService;
  private promptsService: PromptsService;
  private logger: Logger;

  constructor(
    anthropicService: AnthropicService,
    promptsService: PromptsService,
    logger: Logger
  ) {
    this.anthropicService = anthropicService;
    this.promptsService = promptsService;
    this.logger = logger;
  }

  async generateSoapNotes(
    transcription: string
  ): Promise<ServiceResponse<GenerateSoapNotesResponse>> {
    try {
      this.logger.info("Starting SOAP notes generation from raw transcription");
      const systemPrompt = this.promptsService.getSoapSystemPrompt();

      // Generate all SOAP sections in parallel
      this.logger.info("Starting parallel SOAP generation");

      const startTime = Date.now();

      try {
        const [
          subjectiveResult,
          objectiveResult,
          assessmentResult,
          planResult,
        ] = await Promise.all([
          this.generateSection("subjective", transcription, systemPrompt),
          this.generateSection("objective", transcription, systemPrompt),
          this.generateSection("assessment", transcription, systemPrompt),
          this.generateSection("plan", transcription, systemPrompt),
        ]);

        const endTime = Date.now();
        this.logger.info(`All SOAP sections generated in parallel`, {
          durationMs: endTime - startTime,
        });

        // Check if all sections succeeded
        if (
          !subjectiveResult.success ||
          !objectiveResult.success ||
          !assessmentResult.success ||
          !planResult.success
        ) {
          this.logger.warn(
            "Some parallel requests failed, falling back to sequential processing"
          );
          return await this.generateSequentially(transcription, systemPrompt);
        }

        return {
          success: true,
          data: {
            subjective: subjectiveResult.data!.trim(),
            objective: objectiveResult.data!.trim(),
            assessment: assessmentResult.data!.trim(),
            plan: planResult.data!.trim(),
          },
        };
      } catch (error) {
        this.logger.warn(
          "Parallel processing failed, falling back to sequential",
          { error }
        );
        return await this.generateSequentially(transcription, systemPrompt);
      }
    } catch (error) {
      this.logger.error("Unexpected error in SOAP generation", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async generateSequentially(
    transcription: string,
    systemPrompt: string
  ): Promise<ServiceResponse<GenerateSoapNotesResponse>> {
    this.logger.info("Starting sequential SOAP generation");

    try {
      const subjective = await this.logger.time(
        "subjective-sequential",
        async () => {
          return await this.generateSection(
            "subjective",
            transcription,
            systemPrompt,
            1
          );
        }
      );

      if (!subjective.success) {
        return {
          success: false,
          error: `Subjective generation failed: ${subjective.error}`,
        };
      }

      const objective = await this.logger.time(
        "objective-sequential",
        async () => {
          return await this.generateSection(
            "objective",
            transcription,
            systemPrompt,
            1
          );
        }
      );

      if (!objective.success) {
        return {
          success: false,
          error: `Objective generation failed: ${objective.error}`,
        };
      }

      const assessment = await this.logger.time(
        "assessment-sequential",
        async () => {
          return await this.generateSection(
            "assessment",
            transcription,
            systemPrompt,
            1
          );
        }
      );

      if (!assessment.success) {
        return {
          success: false,
          error: `Assessment generation failed: ${assessment.error}`,
        };
      }

      const plan = await this.logger.time("plan-sequential", async () => {
        return await this.generateSection(
          "plan",
          transcription,
          systemPrompt,
          1
        );
      });

      if (!plan.success) {
        return {
          success: false,
          error: `Plan generation failed: ${plan.error}`,
        };
      }

      return {
        success: true,
        data: {
          subjective: subjective.data!.trim(),
          objective: objective.data!.trim(),
          assessment: assessment.data!.trim(),
          plan: plan.data!.trim(),
        },
      };
    } catch (error) {
      this.logger.error("Sequential processing also failed", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Sequential processing failed",
      };
    }
  }

  private async generateSection(
    section: "subjective" | "objective" | "assessment" | "plan",
    transcription: string,
    systemPrompt: string,
    maxRetries?: number
  ): Promise<ServiceResponse<string>> {
    const userPrompt = this.getSectionPrompt(section, transcription);

    this.logger.debug(`Generating ${section} section`);

    const result = await this.anthropicService.callWithRetry(
      systemPrompt,
      userPrompt,
      maxRetries
    );

    if (!result.success) {
      this.logger.error(`Failed to generate ${section} section`, null, {
        error: result.error,
      });
    } else {
      this.logger.debug(`Successfully generated ${section} section`);
    }

    return result;
  }

  private getSectionPrompt(section: string, transcription: string): string {
    switch (section) {
      case "subjective":
        return this.promptsService.getSubjectivePrompt(transcription);
      case "objective":
        return this.promptsService.getObjectivePrompt(transcription);
      case "assessment":
        return this.promptsService.getAssessmentPrompt(transcription);
      case "plan":
        return this.promptsService.getPlanPrompt(transcription);
      default:
        throw new Error(`Unknown SOAP section: ${section}`);
    }
  }
}
