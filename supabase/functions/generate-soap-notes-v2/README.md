# Generate SOAP Notes Edge Function

A comprehensive, production-ready Supabase Edge Function for generating veterinary SOAP notes from transcription text using AI.

## Overview

This function processes raw transcription text from veterinary appointments and generates structured SOAP (Subjective, Objective, Assessment, Plan) notes using Anthropic's Claude AI. The function works directly with raw conversational text without requiring speaker diarization or pre-processing.

## Features

- **TypeScript-first**: Full type safety with comprehensive interfaces
- **Modular Architecture**: Clean separation of concerns with dedicated services
- **Error Handling**: Comprehensive error handling with custom error types
- **Security**: Rate limiting, input validation, and security headers
- **Observability**: Structured logging with correlation IDs
- **Resilience**: Retry logic with exponential backoff and fallback mechanisms
- **Testing**: Comprehensive unit and integration test suite

## Input Format

The function expects raw transcription text from veterinary appointments. The AI will extract relevant information and organize it into structured SOAP note sections.

```json
{
  "transcription": "The dog came in limping. Owner says it started 3 days ago. On examination, there's swelling in the front paw..."
}
```

## Response Format

```json
{
  "subjective": "Owner reports limping for 3 days...",
  "objective": "Swelling in front paw, temperature normal...",
  "assessment": "Possible soft tissue injury...",
  "plan": "Rest, anti-inflammatory medication..."
}
```

## Architecture

### Directory Structure

```
supabase/functions/generate-soap-notes/
├── index.ts                    # Main handler
├── types/                      # TypeScript type definitions
├── services/                   # Business logic services
├── utils/                      # Utility functions
├── middleware/                 # Request/response middleware
├── config/                     # Configuration management
└── tests/                      # Test suite
```

### Key Components

1. **AnthropicService**: Handles AI API calls with retry logic
2. **SoapService**: Orchestrates SOAP note generation
3. **PromptsService**: Contains all AI prompts for SOAP sections
4. **SecurityMiddleware**: Input validation and sanitization
5. **RateLimitMiddleware**: Request rate limiting
6. **CorsMiddleware**: CORS handling

## Environment Variables

Required environment variables:

```bash
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Development

### Running Tests

```bash
# Run all tests
deno task test

# Run unit tests only
deno task test:unit

# Run integration tests only
deno task test:integration
```

### Local Development

1. Start Supabase locally:
   ```bash
   supabase start
   ```

2. Deploy the function:
   ```bash
   supabase functions deploy generate-soap-notes
   ```

3. Test the function:
   ```bash
   curl -X POST 'http://localhost:54321/functions/v1/generate-soap-notes' \\
     -H 'Authorization: Bearer YOUR_ANON_KEY' \\
     -H 'Content-Type: application/json' \\
     -d '{"transcription": "Your transcription text here"}'
   ```

## Security Features

- **Input Validation**: Zod schemas validate all inputs
- **Rate Limiting**: Configurable per-IP rate limiting
- **Security Headers**: HSTS, CSP, XSS protection
- **Input Sanitization**: XSS prevention and content filtering
- **CORS**: Configurable cross-origin resource sharing

## Error Handling

The function includes comprehensive error handling:

- **ValidationError** (400): Invalid input data
- **RateLimitError** (429): Rate limit exceeded
- **AnthropicAPIError** (varies): AI service errors
- **TimeoutError** (504): Request timeout
- **SoapGenerationError** (500): SOAP generation failures

All errors include correlation IDs for tracing and structured error responses.

## Performance

- **Parallel Processing**: SOAP sections generated concurrently
- **Fallback Mechanism**: Sequential processing if parallel fails
- **Caching**: Response caching for repeated requests
- **Connection Pooling**: Efficient API client management

## Monitoring

The function provides comprehensive observability:

- **Structured Logging**: JSON logs with correlation IDs
- **Performance Metrics**: Timing for all operations
- **Error Tracking**: Detailed error information
- **Request Tracing**: Full request lifecycle tracking

## Deployment

Deploy to Supabase:

```bash
supabase functions deploy generate-soap-notes --project-ref YOUR_PROJECT_REF
```

Set environment variables:

```bash
supabase secrets set ANTHROPIC_API_KEY=your-key --project-ref YOUR_PROJECT_REF
```

## Configuration

The function uses environment-based configuration with sensible defaults:

- **API Timeouts**: 5 minutes default
- **Retry Logic**: 2 retries with exponential backoff
- **Rate Limits**: 60 requests per minute per IP
- **Request Size**: 1MB maximum body size

## Important Notes

1. **Input Format**: This function works with raw transcription text from veterinary appointments
2. **Content Analysis**: The AI extracts relevant information from conversational context
3. **SOAP Structure**: Generates standardized veterinary SOAP notes with proper medical terminology
4. **Fallback Mechanisms**: Multiple fallback strategies ensure reliability
5. **Production Ready**: Includes all necessary security and monitoring features

## Migration from Original

The refactored function maintains 100% compatibility with the original while adding:

- Type safety and validation
- Better error handling
- Security enhancements
- Performance optimizations
- Comprehensive testing
- Production-ready monitoring

All original functionality is preserved, and the same input/output format is maintained.