# Contact Form Implementation Guide

This guide explains how to integrate the contact form submission system into your OdisAI application.

## Overview

The contact form system provides:
- Server-side validation using Zod
- Database integration with Supabase
- Robust error handling and user feedback
- Type-safe TypeScript implementation
- Client-side React Hook Form integration
- Reusable components and utilities

## Files Created

### Backend Implementation

1. **`/app/actions/contact/actions.ts`** - Server actions for contact form submission
2. **`/app/actions/common/validation.ts`** - Updated with contact form validation schema
3. **`/app/actions/types.ts`** - Updated with contact form TypeScript types
4. **`/app/actions/index.ts`** - Updated to export contact form actions

### Frontend Implementation

5. **`/src/lib/contact-form.ts`** - Client-side utilities and validation helpers
6. **`/src/components/forms/contact-form.tsx`** - React Hook Form component
7. **`/docs/contact-submissions-migration.sql`** - Database migration
8. **`/docs/contact-form-usage-example.tsx`** - Usage examples

## Setup Instructions

### 1. Database Setup

Run the SQL migration in your Supabase SQL Editor:

```sql
-- See: /docs/contact-submissions-migration.sql
-- This creates the contact_submissions table with proper constraints and RLS policies
```

### 2. Update Database Types

After running the migration, regenerate your TypeScript types:

```bash
npm run codegen
```

### 3. Install Required Dependencies

Ensure you have these dependencies installed:

```bash
npm install react-hook-form zod @hookform/resolvers lucide-react
```

### 4. Import and Use

```typescript
// In your page or component
import { ContactForm } from "@/src/components/forms/contact-form";
import { submitContactForm } from "@/app/actions";

// Use the component
<ContactForm onSuccess={() => console.log("Success!")} />

// Or use the server action directly
const result = await submitContactForm({
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  practiceName: "Happy Pets Clinic",
  message: "I'm interested in your software..."
});
```

## API Reference

### Server Actions

#### `submitContactForm(input: ContactSubmissionInput)`

Submits a contact form and stores it in the database.

**Parameters:**
- `input.firstName` (string, required) - Contact's first name (1-50 chars)
- `input.lastName` (string, required) - Contact's last name (1-50 chars)  
- `input.email` (string, required) - Valid email address (max 255 chars)
- `input.practiceName` (string, required) - Practice name (1-100 chars)
- `input.message` (string, required) - Message content (10-1000 chars)

**Returns:** `ContactSubmissionResult`
```typescript
{
  success: boolean;
  data?: { id: string; submittedAt: string };
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
```

#### `getContactSubmissions(options?)`

Retrieves contact submissions (admin only - requires role implementation).

#### `updateContactSubmissionStatus(submissionId, status)`

Updates submission status (admin only - requires role implementation).

### Client Utilities

#### `handleContactFormSubmission(data: ContactSubmissionInput)`

Wrapper function for consistent error handling in client components.

#### `contactFormValidation`

React Hook Form validation rules object for client-side validation.

#### `formatFieldErrors(fieldErrors?)`

Converts server field errors into user-friendly display format.

## Database Schema

The `contact_submissions` table includes:

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  practice_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 1000),
  status contact_submission_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);
```

## Security Features

1. **Input Validation**: Both client-side (React Hook Form) and server-side (Zod) validation
2. **SQL Injection Prevention**: Uses Supabase parameterized queries
3. **Rate Limiting**: Can be implemented at the database/middleware level
4. **Row Level Security**: Configured with Supabase RLS policies
5. **Data Sanitization**: Client-side input sanitization before submission

## Error Handling

The system handles various error scenarios:

- **Validation Errors**: Field-specific validation messages
- **Database Errors**: Graceful handling of connection/constraint issues
- **Network Errors**: Client-side network failure handling
- **Server Errors**: Unexpected server error handling

## Usage Patterns

### 1. Simple Contact Page
```typescript
<ContactForm onSuccess={() => router.push('/thank-you')} />
```

### 2. Modal Contact Form  
```typescript
<Dialog>
  <DialogContent>
    <ContactForm onSuccess={() => setModalOpen(false)} />
  </DialogContent>
</Dialog>
```

### 3. Landing Page Section
```typescript
<section>
  <ContactForm className="max-w-md" />
</section>
```

### 4. Server-Side Processing
```typescript
// In a server component or API route
const result = await submitContactForm(formData);
```

## Customization

### Styling
The component uses Tailwind CSS classes and can be customized via the `className` prop or by modifying the component styles.

### Validation Rules
Update validation rules in `/app/actions/common/validation.ts` and `/src/lib/contact-form.ts`.

### Success/Error Messages
Customize messages in `/src/lib/contact-form.ts` in the `contactFormMessages` object.

### Form Fields
Add or modify fields by updating:
1. `ContactSubmissionInput` type
2. `contactSubmissionSchema` validation
3. Database table schema
4. React component form fields

## Next Steps

1. **Email Notifications**: Integrate with the existing email system to send notifications when forms are submitted
2. **Admin Dashboard**: Build admin interface to view and manage submissions
3. **Analytics**: Track form submission metrics
4. **A/B Testing**: Test different form variations
5. **Spam Protection**: Add CAPTCHA or similar protection

## Testing

### Unit Tests
```typescript
// Test server action
const result = await submitContactForm(validInput);
expect(result.success).toBe(true);

// Test validation
const invalidResult = await submitContactForm(invalidInput);
expect(invalidResult.fieldErrors).toBeDefined();
```

### Integration Tests
Test the full form submission flow including database interaction and error handling scenarios.

## Performance Considerations

- Form validation runs on both client and server for optimal UX and security
- Database indexes are included for common query patterns
- Client-side utilities provide immediate feedback without server round-trips
- Server actions are optimized for minimal response times

## Monitoring

Consider adding monitoring for:
- Form submission success/failure rates
- Validation error patterns
- Database performance metrics
- User experience metrics (time to complete, abandonment rates)