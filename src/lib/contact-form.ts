/**
 * Contact form utilities and client-side validation
 * Provides utilities for handling contact form submissions on the client side
 */

import { ContactSubmissionInput, ContactSubmissionResult } from "@/app/actions/types";
import { submitContactForm } from "@/app/actions";

/**
 * Client-side contact form validation rules
 */
export const contactFormValidation = {
  firstName: {
    required: "First name is required",
    maxLength: { value: 50, message: "First name must be 50 characters or less" },
  },
  lastName: {
    required: "Last name is required",
    maxLength: { value: 50, message: "Last name must be 50 characters or less" },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
    maxLength: { value: 255, message: "Email must be 255 characters or less" },
  },
  practiceName: {
    required: "Practice name is required",
    maxLength: { value: 100, message: "Practice name must be 100 characters or less" },
  },
  message: {
    required: "Message is required",
    minLength: { value: 10, message: "Message must be at least 10 characters" },
    maxLength: { value: 1000, message: "Message must be 1000 characters or less" },
  },
} as const;

/**
 * Submit contact form with proper error handling
 * Use this wrapper for consistent error handling across components
 */
export async function handleContactFormSubmission(
  data: ContactSubmissionInput
): Promise<ContactSubmissionResult> {
  try {
    const result = await submitContactForm(data);
    return result;
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Format field errors for display
 * Converts server field errors into user-friendly messages
 */
export function formatFieldErrors(fieldErrors?: Record<string, string[]>): Record<string, string> {
  if (!fieldErrors) return {};
  
  const formatted: Record<string, string> = {};
  Object.entries(fieldErrors).forEach(([field, errors]) => {
    formatted[field] = errors.join(", ");
  });
  
  return formatted;
}

/**
 * Contact form default values
 */
export const contactFormDefaults: ContactSubmissionInput = {
  firstName: "",
  lastName: "",
  email: "",
  practiceName: "",
  message: "",
};

/**
 * Success messages for different contact form scenarios
 */
export const contactFormMessages = {
  success: "Thank you for your message! We'll get back to you within 24 hours.",
  generalError: "Something went wrong. Please try again later.",
  validationError: "Please correct the errors below and try again.",
  networkError: "Please check your internet connection and try again.",
} as const;

/**
 * Validate email format (client-side quick check)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

/**
 * Check if contact form data is complete
 */
export function isContactFormComplete(data: Partial<ContactSubmissionInput>): data is ContactSubmissionInput {
  return !!(
    data.firstName?.trim() &&
    data.lastName?.trim() &&
    data.email?.trim() &&
    data.practiceName?.trim() &&
    data.message?.trim()
  );
}

/**
 * Sanitize contact form input (basic client-side sanitization)
 */
export function sanitizeContactFormInput(data: ContactSubmissionInput): ContactSubmissionInput {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    practiceName: data.practiceName.trim(),
    message: data.message.trim(),
  };
}