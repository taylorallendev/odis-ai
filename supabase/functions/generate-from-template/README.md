# Universal Template Generation Edge Function - LangChain Edition

## Overview

This edge function has been refactored to use LangChain with Claude for more reliable structured output generation. The function generates structured output from dynamic templates using advanced parsing and retry logic.

## Key Improvements

### 1. **LangChain Integration**
- Replaced direct Claude API calls with `@langchain/anthropic`
- Added structured output parsing with `StructuredOutputParser`
- Improved error handling and retry logic through LangChain

### 2. **Modular Architecture**
- **TemplateToZodGenerator**: Handles dynamic Zod schema generation from templates
- **TemplatePrompts**: Manages LangChain prompt templates for different template types
- **Main function**: Orchestrates the generation process

### 3. **Enhanced Reliability**
- LangChain's built-in retry logic with exponential backoff
- Structured output parsing for reliable JSON extraction
- Fallback mechanisms when structured parsing fails
- Better token usage tracking and rate limiting

## Architecture

```
┌─────────────────────────┐
│   Template Request      │
│  (template_id + data)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Fetch Template from    │
│      Database           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ TemplateToZodGenerator  │
│   Generate Schema       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│    TemplatePrompts      │
│  Generate Prompt Type   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     LangChain Chain     │
│  ChatAnthropic +        │
│  StructuredParser       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Validated Output      │
│    (JSON + Schema)      │
└─────────────────────────┘
```

## Dependencies

### Deno Imports
- `@langchain/anthropic@0.3.20` - Claude integration
- `@langchain/core@0.3.50` - Core LangChain functionality
- `zod@v3.22.4` - Schema validation

### Environment Variables
- `ANTHROPIC_API_KEY` - Required for Claude API access
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Usage

The API interface remains unchanged for backward compatibility:

```bash
curl -X POST 'http://localhost:54321/functions/v1/generate-from-template' \
  --header 'Content-Type: application/json' \
  --data '{
    "template_id": "uuid-here",
    "transcription": "Patient data...",
    "output_format": "json",
    "include_context": false
  }'
```

## Template Types Supported

1. **SOAP Notes** - Medical SOAP format
2. **Email** - Professional email generation  
3. **Discharge Instructions** - Post-care instructions
4. **Intake Forms** - Patient intake information
5. **Generic** - Flexible template processing

## Error Handling

The function includes multiple layers of error handling:

1. **LangChain Chain Execution** - Primary structured output generation
2. **Fallback Direct Model Call** - When structured parsing fails
3. **JSON Extraction** - Manual JSON parsing from response
4. **Default Content Wrapper** - Last resort content preservation

## Performance Improvements

- **Structured Output Parsing**: More reliable than regex-based JSON extraction
- **Built-in Retry Logic**: LangChain handles retries with exponential backoff
- **Better Token Management**: Optimized prompt templates and token usage
- **Reduced API Calls**: Single chain execution vs multiple validation calls

## Migration Notes

- **Backward Compatible**: Same API interface and response format
- **Enhanced Reliability**: Better error handling and retry logic
- **Improved Performance**: Faster structured output generation
- **Modular Design**: Easier to maintain and extend

## Testing

Test the function with various template types to ensure proper functionality:

```bash
# Test SOAP template
curl -X POST 'http://localhost:54321/functions/v1/generate-from-template' \
  --data '{"template_id": "soap-template-id", "transcription": "Patient exam data..."}'

# Test Email template  
curl -X POST 'http://localhost:54321/functions/v1/generate-from-template' \
  --data '{"template_id": "email-template-id", "input_data": "Email context..."}'
```