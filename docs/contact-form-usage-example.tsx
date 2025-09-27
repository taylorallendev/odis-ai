/**
 * Example: How to use the Contact Form in a Next.js page
 * This demonstrates proper integration with the backend contact form system
 */

import React from "react";
import { ContactForm } from "@/src/components/forms/contact-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

// Example 1: Simple contact page
export default function ContactPage() {
  const handleContactSuccess = () => {
    // Optional: Handle success (e.g., analytics, redirect, etc.)
    console.log("Contact form submitted successfully!");
    
    // Example: Track analytics event
    // analytics.track('Contact Form Submitted');
    
    // Example: Redirect to thank you page
    // router.push('/thank-you');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            Ready to transform your veterinary practice? Get in touch with our team.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Tell us about your practice and we'll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm 
              onSuccess={handleContactSuccess}
              className="mt-0"
            />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need immediate assistance? Call us at{" "}
            <a href="tel:+1-555-123-4567" className="text-blue-600 hover:underline">
              (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Example 2: Contact form in a modal
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

export function ContactModal() {
  const [open, setOpen] = useState(false);

  const handleContactSuccess = () => {
    // Close modal on success
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Contact Us</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
        </DialogHeader>
        <ContactForm onSuccess={handleContactSuccess} />
      </DialogContent>
    </Dialog>
  );
}

// Example 3: Contact form embedded in landing page
export function LandingPageContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of veterinary practices that trust OdisAI to streamline 
              their operations and improve patient care.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Free 30-day trial</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">No setup fees</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">24/7 support</span>
              </div>
            </div>
          </div>

          {/* Right side - Contact form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Get started today</CardTitle>
                <CardDescription>
                  Tell us about your practice and we'll set up a personalized demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Example 4: Server action usage directly in a server component
// Note: This would be used for server-side form processing without JavaScript
export function ServerSideContactForm() {
  // Server action for form submission
  async function handleServerSubmit(formData: FormData) {
    "use server";
    
    const submission = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      practiceName: formData.get("practiceName") as string,
      message: formData.get("message") as string,
    };

    const result = await submitContactForm(submission);
    
    if (!result.success) {
      // Handle error - in real implementation, you'd want to return
      // error state to the component or redirect with error message
      console.error("Contact submission failed:", result.error);
    }
    
    // Redirect on success or handle as needed
    // redirect("/thank-you");
  }

  return (
    <form action={handleServerSubmit} className="space-y-6">
      {/* Form fields here - this would work without JavaScript */}
      <div>
        <label htmlFor="firstName">First Name *</label>
        <input 
          type="text" 
          name="firstName" 
          required 
          maxLength={50}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      {/* Other fields... */}
      
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Send Message
      </button>
    </form>
  );
}