"use client";

/**
 * Contact Form Component
 * Demonstrates integration with the contact form backend
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ContactSubmissionInput } from "@/app/actions/types";
import { 
  handleContactFormSubmission, 
  contactFormValidation, 
  contactFormDefaults,
  contactFormMessages,
  formatFieldErrors,
  sanitizeContactFormInput,
} from "@/src/lib/contact-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({ onSuccess, className = "" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ContactSubmissionInput>({
    defaultValues: contactFormDefaults,
  });

  const onSubmit = async (data: ContactSubmissionInput) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Sanitize input before submission
      const sanitizedData = sanitizeContactFormInput(data);
      
      // Submit to backend
      const result = await handleContactFormSubmission(sanitizedData);

      if (result.success) {
        setSubmitResult({
          success: true,
          message: contactFormMessages.success,
        });
        
        // Reset form on success
        reset();
        
        // Call optional success callback
        onSuccess?.();
      } else {
        // Handle field-specific errors
        if (result.fieldErrors) {
          const formattedErrors = formatFieldErrors(result.fieldErrors);
          Object.entries(formattedErrors).forEach(([field, message]) => {
            setError(field as keyof ContactSubmissionInput, {
              type: "server",
              message,
            });
          });
          
          setSubmitResult({
            success: false,
            message: result.error || contactFormMessages.validationError,
          });
        } else {
          // Handle general errors
          setSubmitResult({
            success: false,
            message: result.error || contactFormMessages.generalError,
          });
        }
      }
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitResult({
        success: false,
        message: contactFormMessages.networkError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Success/Error Message */}
        {submitResult && (
          <Alert className={submitResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {submitResult.success && <CheckCircle className="h-4 w-4 text-green-600" />}
            <AlertDescription className={submitResult.success ? "text-green-800" : "text-red-800"}>
              {submitResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            {...register("firstName", contactFormValidation.firstName)}
            className={errors.firstName ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            {...register("lastName", contactFormValidation.lastName)}
            className={errors.lastName ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email", contactFormValidation.email)}
            className={errors.email ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Practice Name */}
        <div className="space-y-2">
          <Label htmlFor="practiceName">
            Practice Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="practiceName"
            type="text"
            {...register("practiceName", contactFormValidation.practiceName)}
            className={errors.practiceName ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.practiceName && (
            <p className="text-sm text-red-600">{errors.practiceName.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            rows={4}
            {...register("message", contactFormValidation.message)}
            className={errors.message ? "border-red-500" : ""}
            disabled={isSubmitting}
            placeholder="Tell us about your practice and how we can help..."
          />
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}