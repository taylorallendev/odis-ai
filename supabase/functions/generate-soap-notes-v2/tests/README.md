# Edge Function Test Suite

Comprehensive test suite for the `generate-soap-notes` Supabase Edge Function following the official Supabase testing guide patterns.

## Test Structure

```
tests/
├── README.md                           # This file
├── fixtures/
│   └── test-data.ts                    # Test data and mocks
├── integration/
│   └── edge-function.test.ts           # Enhanced integration tests
├── unit/
│   ├── anthropic.service.test.ts       # AnthropicService unit tests
│   ├── prompts.service.test.ts         # PromptsService unit tests
│   ├── soap.service.test.ts            # SoapService unit tests
│   ├── cors.middleware.test.ts         # CorsMiddleware unit tests
│   ├── security.middleware.test.ts     # SecurityMiddleware unit tests
│   ├── rate-limit.middleware.test.ts   # RateLimitMiddleware unit tests
│   ├── errors.test.ts                  # Error handling tests (existing)
│   └── validation.test.ts              # Validation tests (existing)
└── supabase-edge-function.test.ts      # Main Supabase client tests
```

## Test Types

### 1. Main Supabase Client Tests (`supabase-edge-function.test.ts`)

**Purpose**: Tests using the official Supabase client patterns as recommended in the [Supabase testing guide](https://supabase.com/docs/guides/functions/unit-test).

**Features**:
- Uses `createClient()` and `functions.invoke()` 
- Tests client connectivity
- Validates complete SOAP response structure
- Tests error handling for invalid inputs
- Performance and timeout testing
- CORS validation

**Key Test Cases**:
- Valid SOAP generation request
- Multiple invalid input scenarios
- Error response format validation
- Authorization header testing
- Performance characteristics

### 2. Enhanced Integration Tests (`integration/edge-function.test.ts`)

**Purpose**: Comprehensive integration testing using both Supabase client and direct HTTP calls.

**Features**:
- Function availability detection
- Direct HTTP testing with CORS
- Response header validation
- Error format consistency
- Complete workflow simulation
- Performance testing with large inputs

**Key Test Cases**:
- Supabase client invocation patterns
- Direct HTTP calls with proper headers
- Security header validation
- Large transcription processing
- End-to-end workflow simulation

### 3. Service Unit Tests (`unit/*service.test.ts`)

#### AnthropicService Tests
- API call retry logic with exponential backoff
- Error handling for network failures, timeouts, rate limits
- Request/response validation
- AbortController cleanup
- JSON parsing edge cases

#### PromptsService Tests
- System prompt generation for veterinary transcriptions
- Template consistency across SOAP sections
- Special character handling in transcriptions
- Empty input validation
- Prompt structure validation

#### SoapService Tests
- Parallel SOAP generation orchestration
- Sequential fallback processing
- Error handling across service layers
- Content trimming and validation

### 4. Middleware Unit Tests (`unit/*middleware.test.ts`)

#### CorsMiddleware Tests
- Preflight request detection and handling
- CORS header application to responses
- Multiple origin configurations
- Wildcard and specific origin support
- Header case sensitivity

#### SecurityMiddleware Tests
- Request method and content-type validation
- Request body size limits and parsing
- Security header application
- Input sanitization (XSS prevention)
- JSON validation and error handling

#### RateLimitMiddleware Tests
- Client identification (IP vs API key)
- Rate limit enforcement and reset logic
- Cleanup of expired entries
- Rate limit header application
- Multiple client isolation

## Running Tests

### Prerequisites

1. **Environment Setup**:
   ```bash
   # Create .env file in the function directory
   echo "SUPABASE_URL=http://localhost:54321" > .env
   echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" >> .env
   ```

2. **Local Supabase** (optional for integration tests):
   ```bash
   supabase start
   supabase functions serve
   ```

### Test Commands

Run all tests:
```bash
deno task test
```

Run specific test categories:
```bash
# Unit tests only
deno task test:unit

# Integration tests only
deno task test:integration

# Main Supabase client tests
deno task test:supabase

# Service-specific tests
deno task test:services

# Middleware-specific tests
deno task test:middleware
```

Test with coverage:
```bash
deno task test:coverage
```

Watch mode for development:
```bash
deno task test:watch
```

Run individual test files:
```bash
# Test specific service
deno test --allow-net --allow-env --allow-read tests/unit/anthropic.service.test.ts

# Test specific middleware
deno test --allow-net --allow-env --allow-read tests/unit/cors.middleware.test.ts
```

## Test Features

### Mocking Strategy

- **External Services**: AnthropicService calls are mocked to avoid external API dependencies
- **Network Requests**: Configurable mock responses for different scenarios
- **Time-based Logic**: Short timeouts for testing retry and rate limit logic
- **Error Simulation**: Controlled error injection for failure path testing

### Error Handling Patterns

Tests validate error handling for:
- Network connectivity issues
- API rate limiting and timeouts
- Invalid input validation
- JSON parsing failures
- Service orchestration failures
- Middleware security violations

### Test Data

The `fixtures/test-data.ts` file provides:
- Mock veterinary transcriptions
- Expected SOAP response structures
- Valid and invalid request examples
- Mock API responses from external services

### Supabase Testing Best Practices

Following the [official Supabase testing guide](https://supabase.com/docs/guides/functions/unit-test):

1. **Client Creation**: Uses `createClient()` with proper configuration
2. **Function Invocation**: Uses `client.functions.invoke()` method
3. **Environment Variables**: Loads configuration from `.env` files
4. **Error Handling**: Distinguishes between function errors and application errors
5. **Response Validation**: Validates both structure and content
6. **Performance Testing**: Includes reasonable timeout expectations

### CI/CD Integration

Tests are designed to run in CI environments:
- No external API dependencies (mocked)
- Environment variable defaults for local development
- Graceful handling of missing local Supabase instance
- Clear success/failure reporting
- Performance benchmarks

## Test Coverage Areas

### Core Functionality
- ✅ SOAP note generation (S.O.A.P sections)
- ✅ AI prompt generation and customization
- ✅ Transcription processing and sanitization

### External Integrations
- ✅ Anthropic API retry logic and error handling
- ✅ Network timeout and connection management
- ✅ Rate limiting and backoff strategies

### Security & Middleware
- ✅ Request validation and sanitization
- ✅ CORS header management
- ✅ Security header application
- ✅ Rate limiting per client
- ✅ Input size validation

### Error Scenarios
- ✅ Invalid transcription inputs
- ✅ Network failures and timeouts
- ✅ API rate limiting
- ✅ JSON parsing errors
- ✅ Service orchestration failures

### Performance
- ✅ Parallel SOAP generation
- ✅ Sequential fallback processing
- ✅ Large input handling
- ✅ Response time validation

## Contributing

When adding new tests:

1. **Follow Patterns**: Use existing test patterns for consistency
2. **Mock External Services**: Avoid dependencies on external APIs
3. **Test Error Cases**: Include both success and failure scenarios
4. **Update Documentation**: Add new test categories to this README
5. **Validate Coverage**: Ensure new functionality is properly tested

## Troubleshooting

### Common Issues

1. **Function Not Available**: Integration tests gracefully skip when the local function isn't running
2. **Import Errors**: Ensure all dependencies are listed in `deno.json`
3. **Permission Errors**: Tests require `--allow-net`, `--allow-env`, and `--allow-read` flags
4. **Timeout Issues**: AI-based tests have generous timeout limits (30-45 seconds)

### Debug Commands

```bash
# Run with verbose output
deno test --allow-net --allow-env --allow-read tests/ --verbose

# Run specific test with debugging
deno test --allow-net --allow-env --allow-read --inspect-brk tests/unit/anthropic.service.test.ts

# Check test file syntax
deno check tests/unit/anthropic.service.test.ts
```