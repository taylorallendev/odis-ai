-- Migration: Enhance templates table for universal template-to-Zod functionality
-- This migration preserves backward compatibility while adding enhanced features

-- Add new columns to templates table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS output_format TEXT DEFAULT 'json' CHECK (output_format IN ('json', 'text', 'structured')),
ADD COLUMN IF NOT EXISTS validation_schema JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add comments describing the enhanced structure
COMMENT ON COLUMN templates.content IS 'Enhanced template structure supporting:
- sections[].elements[].inputType (text, textarea, number, select, checkbox, date, etc.)
- sections[].elements[].validation (min/max length, patterns, ranges)
- sections[].elements[].defaultValue
- sections[].elements[].options[] for select fields
- sections[].elements[].placeholder
- sections[].elements[].helpText
Backward compatible with existing templates';

COMMENT ON COLUMN templates.output_format IS 'Format for generated output: json (structured object), text (plain text), structured (formatted document)';

COMMENT ON COLUMN templates.validation_schema IS 'Optional Zod-compatible validation schema override for complex validation rules';

COMMENT ON COLUMN templates.metadata IS 'Additional template metadata: category, tags, version, dependencies, etc.';

-- Create indexes for faster template lookups
CREATE INDEX IF NOT EXISTS idx_templates_type_format ON templates(type, output_format);
CREATE INDEX IF NOT EXISTS idx_templates_metadata_gin ON templates USING gin(metadata);

-- Update existing templates to have default output_format if not already set
UPDATE templates 
SET output_format = 'json' 
WHERE output_format IS NULL;

-- Create a function to validate enhanced template structure
CREATE OR REPLACE FUNCTION validate_template_content(content JSONB) 
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic validation that template has sections array
  IF content IS NULL OR NOT (content ? 'sections') THEN
    RETURN FALSE;
  END IF;
  
  -- Validate sections array exists and is an array
  IF NOT (jsonb_typeof(content->'sections') = 'array') THEN
    RETURN FALSE;
  END IF;
  
  -- All sections must have id and title
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(content->'sections') AS section
    WHERE NOT (section ? 'id') OR NOT (section ? 'title')
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add a check constraint for content validation
ALTER TABLE templates 
ADD CONSTRAINT templates_content_valid 
CHECK (content IS NULL OR validate_template_content(content));

-- Create a view for enhanced template information
CREATE OR REPLACE VIEW templates_enhanced AS
SELECT 
  t.*,
  CASE 
    WHEN t.content IS NOT NULL AND t.content ? 'sections' THEN
      (
        SELECT COUNT(*)::int 
        FROM jsonb_array_elements(t.content->'sections') AS section
      )
    ELSE 0
  END AS section_count,
  CASE 
    WHEN t.content IS NOT NULL AND t.content ? 'sections' THEN
      (
        SELECT COUNT(*)::int 
        FROM jsonb_array_elements(t.content->'sections') AS section,
             jsonb_array_elements(COALESCE(section->'elements', '[]'::jsonb)) AS element
      )
    ELSE 0
  END AS element_count,
  CASE 
    WHEN t.metadata ? 'category' THEN t.metadata->>'category'
    ELSE 'general'
  END AS category,
  CASE 
    WHEN t.metadata ? 'tags' THEN t.metadata->'tags'
    ELSE '[]'::jsonb
  END AS tags
FROM templates t;

-- Grant permissions on the view
GRANT SELECT ON templates_enhanced TO authenticated;

-- Create example enhanced template for testing
INSERT INTO templates (
  name, 
  type, 
  content, 
  prompt,
  output_format,
  metadata
) VALUES (
  'Enhanced SOAP Template',
  'soap',
  '{
    "sections": [
      {
        "id": "subjective",
        "title": "Subjective",
        "elements": [
          {
            "name": "chief_complaint",
            "required": true,
            "dataPoint": "Primary reason for visit",
            "description": "Main concern or issue reported by owner",
            "inputType": "textarea",
            "placeholder": "Describe the primary concern...",
            "validation": {
              "minLength": 10,
              "maxLength": 500
            }
          },
          {
            "name": "duration",
            "required": true,
            "dataPoint": "Duration of symptoms",
            "description": "How long the issue has been present",
            "inputType": "text",
            "placeholder": "e.g., 3 days, 2 weeks",
            "validation": {
              "pattern": "^\\d+\\s+(day|days|week|weeks|month|months)s?$"
            }
          },
          {
            "name": "appetite",
            "required": false,
            "dataPoint": "Appetite status",
            "description": "Current eating habits",
            "inputType": "select",
            "options": ["Normal", "Decreased", "Increased", "None"],
            "defaultValue": "Normal"
          }
        ]
      },
      {
        "id": "objective",
        "title": "Objective",
        "elements": [
          {
            "name": "temperature",
            "required": false,
            "dataPoint": "Body temperature",
            "description": "Temperature in Fahrenheit",
            "inputType": "number",
            "validation": {
              "min": 95,
              "max": 110
            },
            "placeholder": "e.g., 101.5"
          },
          {
            "name": "weight",
            "required": false,
            "dataPoint": "Patient weight",
            "description": "Weight in pounds",
            "inputType": "number",
            "validation": {
              "min": 0.1,
              "max": 300
            }
          }
        ]
      },
      {
        "id": "assessment",
        "title": "Assessment",
        "elements": [
          {
            "name": "diagnosis",
            "required": true,
            "dataPoint": "Primary diagnosis",
            "description": "Main clinical diagnosis",
            "inputType": "text",
            "validation": {
              "minLength": 5
            }
          }
        ]
      },
      {
        "id": "plan",
        "title": "Plan",
        "elements": [
          {
            "name": "treatment",
            "required": true,
            "dataPoint": "Treatment plan",
            "description": "Recommended treatment and medications",
            "inputType": "textarea",
            "validation": {
              "minLength": 20
            }
          },
          {
            "name": "followup_date",
            "required": false,
            "dataPoint": "Follow-up appointment date",
            "description": "When to schedule next visit",
            "inputType": "date"
          }
        ]
      }
    ]
  }'::jsonb,
  'Generate a comprehensive SOAP note based on the veterinary examination data',
  'json',
  '{
    "category": "veterinary",
    "tags": ["soap", "examination", "comprehensive"],
    "version": "1.0",
    "created_by": "system"
  }'::jsonb
) ON CONFLICT DO NOTHING;