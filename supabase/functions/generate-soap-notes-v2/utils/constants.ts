/**
 * Application constants
 */

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const ANTHROPIC_CONSTANTS = {
  BASE_URL: 'https://api.anthropic.com/v1',
  API_VERSION: '2023-06-01',
  DEFAULT_MODEL: 'claude-sonnet-4-20250514',
  DEFAULT_MAX_TOKENS: 2000,
  MESSAGES_ENDPOINT: '/messages',
} as const;

export const SOAP_SECTIONS = {
  SUBJECTIVE: 'subjective',
  OBJECTIVE: 'objective',
  ASSESSMENT: 'assessment',
  PLAN: 'plan',
} as const;

export const REQUEST_LIMITS = {
  MAX_BODY_SIZE: 1024 * 1024, // 1MB
  MAX_TRANSCRIPTION_LENGTH: 50000,
  DEFAULT_TIMEOUT: 300000, // 5 minutes
} as const;