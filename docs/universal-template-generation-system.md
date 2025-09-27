# Universal Template Generation System

## Overview

The Universal Template Generation System is a powerful, scalable solution that can generate structured output from any dynamic template. It combines database-driven templates with AI-powered content generation and runtime validation.

## Key Features

- **Template-Agnostic**: Works with any template type (SOAP, discharge, intake, email, etc.)
- **Dynamic Zod Schema Generation**: Automatically creates validation schemas from template structure
- **Intelligent Type Inference**: Automatically determines field types from naming patterns
- **Multiple Output Formats**: JSON, text, or structured document formats
- **Context-Aware Generation**: Can include related case data for better accuracy
- **Retry Logic**: Built-in retry mechanism for API calls with exponential backoff
- **Backward Compatibility**: Preserves existing template structure while adding enhancements

## Architecture

### Components

1. **Database Layer**: Enhanced templates table with validation and metadata
2. **Edge Function**: Universal `generate-from-template` function
3. **Type System**: Comprehensive TypeScript types for all components
4. **Client Hooks**: React hooks for easy integration
5. **Validation Engine**: Dynamic Zod schema generation and validation

### Data Flow

```
Input Data/Transcription → Template Fetch → Schema Generation → Prompt Creation → Claude API → Validation → Output Formatting → Response
```

## Database Schema

### Enhanced Templates Table

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT,
  content JSONB,
  prompt TEXT,
  model TEXT,
  output_format TEXT DEFAULT 'json' CHECK (output_format IN ('json', 'text', 'structured')),
  validation_schema JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Template Content Structure

```typescript
interface TemplateContent {
  sections: [
    {
      id: string;           // Unique section identifier
      title: string;        // Display title
      elements: [
        {
          name: string;              // Field name
          required?: boolean;        // Field is required
          dataPoint: string;         // Description of data to extract
          description?: string;      // Help text
          
          // Enhanced fields
          inputType?: ElementInputType;    // 'text' | 'textarea' | 'number' | 'select' | etc.
          validation?: ElementValidation;  // Validation rules
          defaultValue?: any;              // Default value
          options?: string[];              // For select/radio fields
          placeholder?: string;            // Placeholder text
          helpText?: string;               // Additional help
        }
      ]
    }
  ]
}
```

## Usage Examples

### 1. Basic Generation from Transcription

```typescript
import { useUniversalGeneration } from '@/src/hooks/use-universal-generation';

const { generateFromTranscription, isLoading, response, error } = useUniversalGeneration({
  onSuccess: (result) => console.log('Generated:', result),
  onError: (err) => console.error('Error:', err)
});

await generateFromTranscription(
  'template-id-here',
  'The dog came in for a routine checkup. Owner reports normal eating and drinking.',
  'case-id-here',      // optional
  'json',              // output format
  true                 // include context
);
```

### 2. Direct Edge Function Call

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/generate-from-template' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "template_id": "5321b279-f228-40f0-846d-fd65853ccb76",
    "transcription": "The dog came in today for a routine checkup...",
    "output_format": "json",
    "include_context": true
  }'
```

### 3. Form Data Generation

```typescript
const formData = {
  subjective: {
    chief_complaint: "Limping on right front leg",
    duration: "3 days",
    appetite: "Normal"
  },
  objective: {
    temperature: 101.2,
    weight: 45.5
  }
};

await generateFromFormData('template-id', formData, 'structured');
```

## Template Types and Configurations

The system supports multiple pre-configured template types:

### SOAP Notes
- **Sections**: Subjective, Objective, Assessment, Plan
- **Output**: Structured JSON with medical terminology
- **Use Case**: Veterinary examination documentation

### Email Templates
- **Sections**: Header, Body, Footer
- **Output**: Formatted email content
- **Use Case**: Client communication

### Discharge Instructions
- **Sections**: Medications, Care Instructions, Follow-up, Emergency
- **Output**: Client-friendly structured document
- **Use Case**: Post-treatment care guidance

### Intake Forms
- **Sections**: Patient Info, Owner Info, History, Current Concern
- **Output**: Organized patient data
- **Use Case**: New patient registration

## Dynamic Schema Generation

The system automatically generates Zod validation schemas based on template structure:

```typescript
// Example: This template element...
{
  name: "temperature",
  inputType: "number",
  validation: { min: 95, max: 110 },
  required: true
}

// ...generates this Zod schema:
z.number().min(95).max(110)
```

### Intelligent Type Inference

When `inputType` is not specified, the system infers types from naming patterns:

- `email` → email validation
- `date`, `time` → date format validation
- `age`, `weight`, `count` → number type
- `notes`, `description` → textarea
- `active`, `enabled`, `is_*` → boolean/checkbox

## Output Formats

### JSON Format
```json
{
  "subjective": {
    "chief_complaint": "Limping on right front leg",
    "duration": "3 days"
  },
  "objective": {
    "temperature": 101.2,
    "pulse": "Normal"
  }
}
```

### Structured Format
```markdown
## Subjective

**Chief Complaint**: Limping on right front leg
**Duration**: 3 days

## Objective

**Temperature**: 101.2
**Pulse**: Normal
```

### Text Format
```
Plain text output with all data serialized as a readable string
```

## Error Handling and Validation

### Validation Levels

1. **Schema Validation**: Zod schema validation against generated structure
2. **Content Validation**: Template content structure validation
3. **API Validation**: Claude API response validation
4. **Fallback Handling**: Graceful degradation when validation fails

### Error Response Format

```typescript
{
  error: string;
  details?: string;
}
```

## Client Integration

### React Hook Usage

```typescript
// Fetch templates
const { templates, fetchTemplates } = useTemplates();

// Generate content
const { 
  generateFromTemplate, 
  isLoading, 
  response, 
  error 
} = useUniversalGeneration();

// Generation history
const { 
  generations, 
  fetchGenerations 
} = useGenerationHistory();
```

### TypeScript Types

All components are fully typed with comprehensive TypeScript interfaces:

- `Template` - Complete template structure
- `TemplateContent` - Template content schema
- `TemplateElement` - Individual form elements
- `GenerateFromTemplateRequest` - API request format
- `GenerateFromTemplateResponse` - API response format

## Configuration and Setup

### Environment Variables

```bash
ANTHROPIC_API_KEY=your_anthropic_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Database Migration

Run the provided migration to enhance your templates table:

```bash
supabase db push
```

### Edge Function Deployment

```bash
supabase functions deploy generate-from-template
```

## Advanced Features

### Context Inclusion

When `include_context: true`, the system automatically includes:
- Related transcriptions from the same case
- Previous SOAP notes
- Historical data for better context-aware generation

### Template Metadata

Templates support rich metadata:

```json
{
  "category": "veterinary",
  "tags": ["soap", "examination"],
  "version": "1.0",
  "estimated_time": 5,
  "difficulty": "easy"
}
```

### Conditional Logic

Templates can include conditional field display:

```typescript
{
  name: "medication_dosage",
  dependsOn: "requires_medication",
  showWhen: {
    field: "requires_medication",
    value: true,
    operator: "equals"
  }
}
```

## Performance Considerations

- **Parallel Processing**: Multiple API calls can be processed simultaneously
- **Caching**: Template schemas are generated once per template
- **Retry Logic**: Exponential backoff prevents API rate limiting
- **Validation Optimization**: Zod schemas are compiled once and reused

## Security

- **Input Sanitization**: All user inputs are validated before processing
- **API Key Management**: Secure handling of Claude API credentials
- **Row Level Security**: Supabase RLS policies protect template access
- **Validation**: Multi-layer validation prevents malicious input

## Monitoring and Logging

The system includes comprehensive logging:
- API call attempts and results
- Validation success/failure
- Error details and stack traces
- Performance metrics

## Best Practices

### Template Design
1. Use clear, descriptive field names
2. Include helpful descriptions and placeholders
3. Set appropriate validation rules
4. Organize fields logically in sections

### Error Handling
1. Always check for errors in client code
2. Provide fallback content when generation fails
3. Log errors for debugging
4. Show user-friendly error messages

### Performance
1. Use context inclusion judiciously
2. Cache templates on the client side
3. Implement proper loading states
4. Consider pagination for large result sets

## Troubleshooting

### Common Issues

1. **Template Not Found**: Verify template ID exists in database
2. **Validation Failures**: Check template structure and field types
3. **API Errors**: Verify Claude API key and quota
4. **Schema Generation**: Ensure template content follows expected format

### Debugging

Enable detailed logging in the edge function:
```typescript
console.log('Template:', template);
console.log('Generated Schema:', validationSchema);
console.log('Claude Response:', rawOutput);
```

## Future Enhancements

- **Template Versioning**: Support for template version history
- **Visual Template Builder**: Drag-and-drop template creation interface
- **Multi-Language Support**: Templates in different languages
- **Workflow Integration**: Connect templates to approval workflows
- **Analytics Dashboard**: Usage statistics and performance metrics

## Contributing

When extending the system:

1. Maintain backward compatibility
2. Add comprehensive TypeScript types
3. Include unit tests for new features
4. Update documentation
5. Follow existing code patterns

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in Supabase dashboard
3. Verify template structure and content
4. Test with simple examples first