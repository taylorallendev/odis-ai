-- Migration: Consolidate templates table to enhanced structure
-- This migration ensures the templates table has the complete enhanced structure

-- Ensure all enhanced columns exist with proper defaults
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS output_format TEXT DEFAULT 'json' CHECK (output_format IN ('json', 'text', 'structured')),
ADD COLUMN IF NOT EXISTS validation_schema JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS key TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update column comments to reflect enhanced structure
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
COMMENT ON COLUMN templates.key IS 'Unique key to identify template programmatically';
COMMENT ON COLUMN templates.description IS 'Human-readable description of the template purpose';

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_templates_type_format ON templates(type, output_format);
CREATE INDEX IF NOT EXISTS idx_templates_metadata_gin ON templates USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_templates_key ON templates(key) WHERE key IS NOT NULL;

-- Update existing templates to have default output_format if not already set
UPDATE templates 
SET output_format = 'json' 
WHERE output_format IS NULL;

-- Update existing templates to have default metadata if empty
UPDATE templates 
SET metadata = COALESCE(metadata, '{}')
WHERE metadata IS NULL OR metadata = 'null'::jsonb;

-- Update existing templates to have default validation_schema if empty
UPDATE templates 
SET validation_schema = COALESCE(validation_schema, '{}')
WHERE validation_schema IS NULL OR validation_schema = 'null'::jsonb;

-- Ensure the validation function exists
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

-- Add constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'templates_content_valid'
  ) THEN
    ALTER TABLE templates 
    ADD CONSTRAINT templates_content_valid 
    CHECK (content IS NULL OR validate_template_content(content));
  END IF;
END $$;

-- Create or replace the enhanced view
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
  END AS tags,
  CASE 
    WHEN t.metadata ? 'version' THEN t.metadata->>'version'
    ELSE '1.0'
  END AS version
FROM templates t;

-- Grant permissions on the view
GRANT SELECT ON templates_enhanced TO authenticated;

-- Update the table comment to reflect the enhanced nature
COMMENT ON TABLE templates IS 'Enhanced templates table for universal template-to-Zod functionality. Stores templates for various use cases including email, SOAP notes, and other structured content with advanced validation and metadata support.';