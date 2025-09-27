/**
 * Enhanced Template System Types
 * 
 * This file contains TypeScript types for the universal template system
 * that supports dynamic Zod schema generation and content generation.
 */

// Base element input types
export type ElementInputType = 
  | 'text'
  | 'textarea' 
  | 'number'
  | 'boolean'
  | 'checkbox'
  | 'date'
  | 'select'
  | 'radio'
  | 'email'
  | 'url'
  | 'password'
  | 'tel'
  | 'range'
  | 'color'
  | 'file';

// Validation rules for form elements
export interface ElementValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  custom?: {
    rule: string;
    message: string;
  }[];
}

// Enhanced template element structure
export interface TemplateElement {
  name: string;
  required?: boolean;
  dataPoint: string;
  description?: string;
  
  // Enhanced fields for universal generation
  inputType?: ElementInputType;
  validation?: ElementValidation;
  defaultValue?: any;
  options?: string[]; // For select/radio fields
  placeholder?: string;
  helpText?: string;
  
  // Conditional logic
  dependsOn?: string; // Element name this depends on
  showWhen?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

// Template section structure
export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  elements: TemplateElement[];
  
  // Enhanced fields
  collapsible?: boolean;
  defaultExpanded?: boolean;
  order?: number;
}

// Complete template content structure
export interface TemplateContent {
  sections: TemplateSection[];
  
  // Global template settings
  settings?: {
    allowPartialSubmission?: boolean;
    autoSave?: boolean;
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  };
}

// Output format options
export type OutputFormat = 'json' | 'text' | 'structured';

// Template metadata
export interface TemplateMetadata {
  category?: string;
  tags?: string[];
  version?: string;
  created_by?: string;
  dependencies?: string[];
  estimated_time?: number; // minutes
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Enhanced template record
export interface Template {
  id: string;
  name: string;
  type: string;
  content: TemplateContent | null;
  prompt?: string;
  model?: string;
  output_format?: OutputFormat;
  validation_schema?: Record<string, any>;
  metadata?: TemplateMetadata;
  created_at?: string;
  updated_at?: string;
}

// Template with computed fields from view
export interface TemplateEnhanced extends Template {
  section_count: number;
  element_count: number;
  category: string;
  tags: any[];
}

// Request/response types for the edge function
export interface GenerateFromTemplateRequest {
  template_id: string;
  input_data?: string;
  transcription?: string;
  case_id?: string;
  output_format?: OutputFormat;
  include_context?: boolean;
}

export interface GenerateFromTemplateResponse {
  id?: string;
  template_id: string;
  template_type: string;
  output_format: OutputFormat;
  content: any;
  metadata: {
    validation_schema_generated: boolean;
    context_included: boolean;
  };
}

// Error response
export interface GenerateFromTemplateError {
  error: string;
  details?: string;
}

// Client-side form data structure
export interface FormData {
  [sectionId: string]: {
    [elementName: string]: any;
  };
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: {
    [sectionId: string]: {
      [elementName: string]: string[];
    };
  };
  warnings?: {
    [sectionId: string]: {
      [elementName: string]: string[];
    };
  };
}

// Template builder types for admin interface
export interface TemplateBuilder {
  template: Partial<Template>;
  sections: TemplateSection[];
  currentSection?: string;
  currentElement?: string;
  isDirty: boolean;
  errors: string[];
}

// Pre-defined template types
export type TemplateType = 
  | 'soap'
  | 'email'
  | 'discharge'
  | 'intake'
  | 'invoice'
  | 'report'
  | 'assessment'
  | 'form'
  | 'document'
  | 'custom';

// Template type configuration
export interface TemplateTypeConfig {
  type: TemplateType;
  name: string;
  description: string;
  defaultSections: Partial<TemplateSection>[];
  suggestedElements: Partial<TemplateElement>[];
  promptTemplate?: string;
  outputFormat: OutputFormat;
  category: string;
}

// Predefined template configurations
export const TEMPLATE_TYPE_CONFIGS: Record<TemplateType, TemplateTypeConfig> = {
  soap: {
    type: 'soap',
    name: 'SOAP Notes',
    description: 'Subjective, Objective, Assessment, Plan medical documentation',
    defaultSections: [
      { id: 'subjective', title: 'Subjective' },
      { id: 'objective', title: 'Objective' },
      { id: 'assessment', title: 'Assessment' },
      { id: 'plan', title: 'Plan' }
    ],
    suggestedElements: [
      { name: 'chief_complaint', inputType: 'textarea', required: true },
      { name: 'temperature', inputType: 'number' },
      { name: 'diagnosis', inputType: 'text', required: true },
      { name: 'treatment', inputType: 'textarea', required: true }
    ],
    promptTemplate: 'Generate a SOAP note based on the veterinary examination data',
    outputFormat: 'json',
    category: 'medical'
  },
  
  email: {
    type: 'email',
    name: 'Email Template',
    description: 'Professional email communication template',
    defaultSections: [
      { id: 'header', title: 'Email Header' },
      { id: 'body', title: 'Email Body' },
      { id: 'footer', title: 'Email Footer' }
    ],
    suggestedElements: [
      { name: 'subject', inputType: 'text', required: true },
      { name: 'recipient', inputType: 'email', required: true },
      { name: 'content', inputType: 'textarea', required: true },
      { name: 'signature', inputType: 'textarea' }
    ],
    promptTemplate: 'Generate a professional email based on the provided information',
    outputFormat: 'structured',
    category: 'communication'
  },
  
  discharge: {
    type: 'discharge',
    name: 'Discharge Instructions',
    description: 'Post-treatment care instructions for pet owners',
    defaultSections: [
      { id: 'medications', title: 'Medications' },
      { id: 'care_instructions', title: 'Home Care' },
      { id: 'followup', title: 'Follow-up' },
      { id: 'emergency', title: 'Emergency Instructions' }
    ],
    suggestedElements: [
      { name: 'medication_name', inputType: 'text' },
      { name: 'dosage', inputType: 'text' },
      { name: 'frequency', inputType: 'select', options: ['Once daily', 'Twice daily', 'Three times daily'] },
      { name: 'activity_level', inputType: 'select', options: ['Normal', 'Restricted', 'Cage rest'] }
    ],
    promptTemplate: 'Generate clear discharge instructions for pet owners',
    outputFormat: 'structured',
    category: 'medical'
  },
  
  intake: {
    type: 'intake',
    name: 'Patient Intake',
    description: 'New patient registration and history form',
    defaultSections: [
      { id: 'patient_info', title: 'Patient Information' },
      { id: 'owner_info', title: 'Owner Information' },
      { id: 'history', title: 'Medical History' },
      { id: 'current_concern', title: 'Current Concern' }
    ],
    suggestedElements: [
      { name: 'pet_name', inputType: 'text', required: true },
      { name: 'species', inputType: 'select', options: ['Dog', 'Cat', 'Bird', 'Other'] },
      { name: 'age', inputType: 'number' },
      { name: 'weight', inputType: 'number' }
    ],
    promptTemplate: 'Process patient intake information and organize it systematically',
    outputFormat: 'json',
    category: 'administrative'
  },
  
  invoice: {
    type: 'invoice',
    name: 'Invoice',
    description: 'Service billing and invoice generation',
    defaultSections: [
      { id: 'services', title: 'Services Provided' },
      { id: 'medications', title: 'Medications' },
      { id: 'totals', title: 'Totals' }
    ],
    suggestedElements: [
      { name: 'service_name', inputType: 'text' },
      { name: 'quantity', inputType: 'number' },
      { name: 'unit_price', inputType: 'number' },
      { name: 'total', inputType: 'number' }
    ],
    promptTemplate: 'Generate a detailed invoice based on services provided',
    outputFormat: 'structured',
    category: 'financial'
  },
  
  report: {
    type: 'report',
    name: 'Medical Report',
    description: 'Comprehensive medical report for referrals or records',
    defaultSections: [
      { id: 'summary', title: 'Case Summary' },
      { id: 'findings', title: 'Clinical Findings' },
      { id: 'recommendations', title: 'Recommendations' }
    ],
    suggestedElements: [
      { name: 'case_summary', inputType: 'textarea', required: true },
      { name: 'key_findings', inputType: 'textarea' },
      { name: 'prognosis', inputType: 'select', options: ['Good', 'Fair', 'Guarded', 'Poor'] }
    ],
    promptTemplate: 'Generate a comprehensive medical report',
    outputFormat: 'structured',
    category: 'medical'
  },
  
  assessment: {
    type: 'assessment',
    name: 'Clinical Assessment',
    description: 'Structured clinical evaluation and assessment',
    defaultSections: [
      { id: 'evaluation', title: 'Clinical Evaluation' },
      { id: 'scoring', title: 'Assessment Scores' },
      { id: 'conclusion', title: 'Conclusion' }
    ],
    suggestedElements: [
      { name: 'assessment_type', inputType: 'text' },
      { name: 'score', inputType: 'number' },
      { name: 'notes', inputType: 'textarea' }
    ],
    promptTemplate: 'Perform clinical assessment based on provided criteria',
    outputFormat: 'json',
    category: 'medical'
  },
  
  form: {
    type: 'form',
    name: 'General Form',
    description: 'Generic form template for various purposes',
    defaultSections: [
      { id: 'section1', title: 'Section 1' }
    ],
    suggestedElements: [
      { name: 'field1', inputType: 'text' },
      { name: 'field2', inputType: 'textarea' }
    ],
    promptTemplate: 'Process form data according to the template structure',
    outputFormat: 'json',
    category: 'general'
  },
  
  document: {
    type: 'document',
    name: 'Document Template',
    description: 'Formatted document generation template',
    defaultSections: [
      { id: 'header', title: 'Document Header' },
      { id: 'content', title: 'Document Content' },
      { id: 'footer', title: 'Document Footer' }
    ],
    suggestedElements: [
      { name: 'title', inputType: 'text', required: true },
      { name: 'content', inputType: 'textarea', required: true },
      { name: 'author', inputType: 'text' }
    ],
    promptTemplate: 'Generate a formatted document based on the template',
    outputFormat: 'structured',
    category: 'documentation'
  },
  
  custom: {
    type: 'custom',
    name: 'Custom Template',
    description: 'User-defined custom template',
    defaultSections: [],
    suggestedElements: [],
    outputFormat: 'json',
    category: 'custom'
  }
};

// Utility type for template creation
export type CreateTemplateRequest = Omit<Template, 'id' | 'created_at' | 'updated_at'>;

// Utility type for template updates
export type UpdateTemplateRequest = Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>;