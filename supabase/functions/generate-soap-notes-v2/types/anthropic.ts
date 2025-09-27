/**
 * Anthropic API related type definitions
 */

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicRequest {
  model: string;
  max_tokens: number;
  system?: string;
  messages: AnthropicMessage[];
}

export interface AnthropicResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  id: string;
  model: string;
  role: string;
  stop_reason: string;
  stop_sequence: string | null;
  type: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface AnthropicError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}