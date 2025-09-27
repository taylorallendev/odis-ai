import { PromptTemplate } from "npm:@langchain/core/prompts";
import { TemplateToZodGenerator } from "./template-to-zod-generator.ts";

/**
 * LangChain-compatible prompt templates for different template types
 */
export class TemplatePrompts {
  
  /**
   * Base system prompt for all template types
   */
  static readonly SYSTEM_PROMPT = `You are a precise data extraction AI that converts unstructured input into structured output according to provided templates. 

CRITICAL INSTRUCTIONS:
- Always return valid JSON that exactly matches the expected schema
- Extract only factual information present in the input data
- Use precise terminology appropriate for the domain
- Include specific measurements, dosages, and instructions when available
- Do not add information not present in the source data
- Return ONLY the JSON object, no additional text or explanations`;

  /**
   * Generate template-specific prompt based on type
   */
  static generatePrompt(templateType: string, templateContent: any, inputData: string): PromptTemplate {
    const schemaDescription = TemplateToZodGenerator.getSchemaDescription(templateContent);
    
    switch (templateType.toLowerCase()) {
      case 'soap':
        return this.createSoapPrompt(templateContent, schemaDescription);
      case 'email':
        return this.createEmailPrompt(templateContent, schemaDescription);
      case 'discharge':
        return this.createDischargePrompt(templateContent, schemaDescription);
      case 'intake':
        return this.createIntakePrompt(templateContent, schemaDescription);
      default:
        return this.createGenericPrompt(templateContent, schemaDescription);
    }
  }

  /**
   * SOAP Note prompt template
   */
  private static createSoapPrompt(templateContent: any, schemaDescription: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`Extract and structure information from the provided veterinary data into a SOAP note format.

SOAP FOCUS AREAS:
- Subjective: Owner-reported concerns, history, and behavioral observations
- Objective: Physical examination findings, vital signs, and measurements
- Assessment: Clinical interpretations, diagnoses, and differential diagnoses
- Plan: Treatment recommendations, medications, and follow-up instructions

TEMPLATE STRUCTURE:
{template_structure}

EXPECTED OUTPUT SCHEMA:
{schema_description}

INPUT DATA:
{input_data}

Extract the information and return as a JSON object matching the schema exactly.`);
  }

  /**
   * Email prompt template
   */
  private static createEmailPrompt(templateContent: any, schemaDescription: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`Generate a professional email based on the template structure and input data.

EMAIL GUIDELINES:
- Use professional and appropriate tone for veterinary communication
- Ensure clarity and informativeness for the intended recipient
- Include all relevant information from the input data
- Follow proper email structure (subject, greeting, body, closing)

TEMPLATE STRUCTURE:
{template_structure}

EXPECTED OUTPUT SCHEMA:
{schema_description}

INPUT DATA:
{input_data}

Generate the email content and return as a JSON object matching the schema exactly.`);
  }

  /**
   * Discharge Instructions prompt template
   */
  private static createDischargePrompt(templateContent: any, schemaDescription: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`Generate comprehensive discharge instructions based on the template structure and patient information.

DISCHARGE INSTRUCTION FOCUS:
- Post-care instructions and activity restrictions
- Medication schedules with precise dosages and timing
- Warning signs and when to contact the clinic
- Follow-up appointment scheduling
- Dietary recommendations and restrictions

TEMPLATE STRUCTURE:
{template_structure}

EXPECTED OUTPUT SCHEMA:
{schema_description}

INPUT DATA:
{input_data}

Create clear, client-friendly discharge instructions and return as a JSON object matching the schema exactly.`);
  }

  /**
   * Intake Form prompt template
   */
  private static createIntakePrompt(templateContent: any, schemaDescription: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`Structure patient intake information based on the template and provided data.

INTAKE INFORMATION FOCUS:
- Patient demographics and identification
- Medical history and previous treatments
- Current presenting concerns and symptoms
- Owner contact information and preferences
- Emergency contact details

TEMPLATE STRUCTURE:
{template_structure}

EXPECTED OUTPUT SCHEMA:
{schema_description}

INPUT DATA:
{input_data}

Organize the intake information and return as a JSON object matching the schema exactly.`);
  }

  /**
   * Generic template prompt
   */
  private static createGenericPrompt(templateContent: any, schemaDescription: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`Extract and structure information from the input data according to the provided template.

TEMPLATE STRUCTURE:
{template_structure}

EXPECTED OUTPUT SCHEMA:
{schema_description}

INPUT DATA:
{input_data}

Structure the output according to the template and return as a JSON object matching the schema exactly.`);
  }
}