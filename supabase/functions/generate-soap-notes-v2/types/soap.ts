/**
 * SOAP note related type definitions
 */

export interface SoapSection {
  content: string;
  generated: boolean;
  error?: string;
}

export interface SoapNotes {
  subjective: SoapSection;
  objective: SoapSection;
  assessment: SoapSection;
  plan: SoapSection;
}

export interface SoapGenerationJob {
  section: "subjective" | "objective" | "assessment" | "plan";
  transcription: string;
  template?: string;
}

export interface SoapPromptContext {
  transcription: string;
  template?: string;
}

export interface GenerateSoapNotesResponse {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}
