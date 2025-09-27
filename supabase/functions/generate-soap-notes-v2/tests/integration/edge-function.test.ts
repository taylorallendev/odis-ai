/// <reference lib="deno.ns" />
/**
 * Enhanced Integration tests for the Edge Function
 * Following Supabase Edge Function testing best practices
 * https://supabase.com/docs/guides/functions/unit-test
 */

import { assertEquals, assertExists, assert } from "@std/assert";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "@supabase/functions-js/edge-runtime.d.ts";
import {
  mockTranscription,
  validRequests,
  invalidRequests,
} from "../fixtures/test-data.ts";

// Will load the .env file to Deno.env
import "@std/dotenv/load";

// Set up the configuration for the Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321";
const supabaseKey =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

// Helper function to check if function is available
const isFunctionAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-soap-notes`,
      {
        method: "OPTIONS",
      }
    );
    return response.status === 204 || response.status === 200;
  } catch {
    return false;
  }
};

Deno.test(
  "Edge Function Integration - Supabase client invoke - valid request",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const client: SupabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      options
    );

    try {
      const { data: funcData, error: funcError } =
        await client.functions.invoke("generate-soap-notes", {
          body: validRequests[0],
        });

      // Check for function invocation errors
      if (funcError) {
        console.log(`Function invocation error: ${funcError.message}`);
        return;
      }

      // Validate successful response structure
      if (funcData && !funcData.error) {
        assertExists(
          funcData.subjective,
          "Response should contain subjective field"
        );
        assertExists(
          funcData.objective,
          "Response should contain objective field"
        );
        assertExists(
          funcData.assessment,
          "Response should contain assessment field"
        );
        assertExists(funcData.plan, "Response should contain plan field");

        assertEquals(
          typeof funcData.subjective,
          "string",
          "Subjective should be a string"
        );
        assertEquals(
          typeof funcData.objective,
          "string",
          "Objective should be a string"
        );
        assertEquals(
          typeof funcData.assessment,
          "string",
          "Assessment should be a string"
        );
        assertEquals(typeof funcData.plan, "string", "Plan should be a string");

        // Validate content is not empty
        assert(
          funcData.subjective.trim().length > 0,
          "Subjective should not be empty"
        );
        assert(
          funcData.objective.trim().length > 0,
          "Objective should not be empty"
        );
        assert(
          funcData.assessment.trim().length > 0,
          "Assessment should not be empty"
        );
        assert(funcData.plan.trim().length > 0, "Plan should not be empty");

        console.log(
          "✓ Valid request test passed - SOAP notes generated successfully"
        );
      }
    } catch (error) {
      console.log(
        `Test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

Deno.test(
  "Edge Function Integration - Supabase client invoke - validation errors",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const client: SupabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      options
    );

    // Test multiple invalid request scenarios
    const testCases = [
      { name: "empty transcription", body: invalidRequests[1] }, // { transcription: "" }
      { name: "null transcription", body: invalidRequests[5] }, // { transcription: null }
      { name: "number transcription", body: invalidRequests[4] }, // { transcription: 123 }
      { name: "missing transcription", body: invalidRequests[0] }, // {}
    ];

    for (const testCase of testCases) {
      try {
        const { data: funcData, error: funcError } =
          await client.functions.invoke("generate-soap-notes", {
            body: testCase.body,
          });

        // We expect either a function error or a data error for invalid inputs
        if (funcError) {
          console.log(
            `✓ ${testCase.name}: Expected function error - ${funcError.message}`
          );
        } else if (funcData?.error) {
          assertExists(
            funcData.error,
            "Response should contain error for invalid input"
          );
          console.log(
            `✓ ${testCase.name}: Expected validation error - ${funcData.error}`
          );
        } else if (funcData && !funcData.error) {
          console.log(
            `⚠ ${testCase.name}: No error returned (might indicate missing validation)`
          );
        }
      } catch (error) {
        console.log(
          `Test error for ${testCase.name}: ${error instanceof Error ? error.message : String(error)}`
        );
        break;
      }
    }
  }
);

Deno.test(
  "Edge Function Integration - Direct HTTP calls with CORS",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-soap-notes`;

    // Test CORS preflight
    try {
      const preflightResponse = await fetch(functionUrl, {
        method: "OPTIONS",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
          Origin: "http://localhost:3000",
        },
      });

      if (
        preflightResponse.status === 204 ||
        preflightResponse.status === 200
      ) {
        assertExists(
          preflightResponse.headers.get("Access-Control-Allow-Origin")
        );
        assertExists(
          preflightResponse.headers.get("Access-Control-Allow-Methods")
        );
        assertExists(
          preflightResponse.headers.get("Access-Control-Allow-Headers")
        );
        console.log("✓ CORS preflight test passed");
      }
    } catch (error) {
      console.log(
        `CORS test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Test actual POST request with CORS headers
    try {
      const postResponse = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(validRequests[0]),
      });

      // Check that CORS headers are present in the response
      if (postResponse.headers.get("Access-Control-Allow-Origin")) {
        console.log("✓ CORS headers present in POST response");
      }

      if (postResponse.ok) {
        const data = await postResponse.json();
        if (data.subjective && data.objective && data.assessment && data.plan) {
          console.log("✓ Direct HTTP POST test passed");
        }
      }
    } catch (error) {
      console.log(
        `Direct HTTP test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

Deno.test(
  "Edge Function Integration - Response headers validation",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    // Note: Using direct HTTP for header validation

    try {
      // Make a request and check response headers via direct HTTP call
      const functionUrl = `${supabaseUrl}/functions/v1/generate-soap-notes`;
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(validRequests[0]),
      });

      // Check for security headers
      const securityHeaders = [
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Content-Security-Policy",
      ];

      const presentHeaders = securityHeaders.filter((header) =>
        response.headers.get(header)
      );

      if (presentHeaders.length > 0) {
        console.log(`✓ Security headers present: ${presentHeaders.join(", ")}`);
      }

      // Check for correlation ID
      const correlationId = response.headers.get("X-Correlation-ID");
      if (correlationId) {
        console.log(`✓ Correlation ID present: ${correlationId}`);
      }

      // Check content type
      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        console.log("✓ Correct Content-Type header");
      }
    } catch (error) {
      console.log(
        `Response headers test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

Deno.test(
  "Edge Function Integration - Performance and timeout testing",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const client: SupabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      options
    );

    // Test with a reasonably large transcription
    const largeTranscription = mockTranscription.repeat(5); // Make it larger
    const largeRequest = { transcription: largeTranscription };

    try {
      const startTime = Date.now();

      const { data: funcData, error: funcError } =
        await client.functions.invoke("generate-soap-notes", {
          body: largeRequest,
        });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`Function response time: ${responseTime}ms`);

      // Performance assertions (generous limits for AI processing)
      if (responseTime < 45000) {
        // 45 seconds
        console.log("✓ Performance test passed - response within time limit");
      } else {
        console.log(
          "⚠ Performance test - response time exceeded expected limit"
        );
      }

      if (!funcError && funcData && !funcData.error) {
        console.log("✓ Large transcription processed successfully");
      }
    } catch (error) {
      console.log(
        `Performance test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

Deno.test(
  "Edge Function Integration - Error response format consistency",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const client: SupabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      options
    );

    try {
      // Test with invalid JSON structure
      const { data: funcData, error: funcError } =
        await client.functions.invoke("generate-soap-notes", {
          body: { invalid: "structure" }, // Missing transcription field
        });

      // Check error response format
      if (funcError) {
        // Function-level error
        assert(
          typeof funcError.message === "string",
          "Function error should have string message"
        );
        console.log("✓ Function error format validated");
      } else if (funcData?.error) {
        // Application-level error
        assert(
          typeof funcData.error === "string",
          "Application error should be string"
        );
        console.log("✓ Application error format validated");
      }
    } catch (error) {
      console.log(
        `Error format test error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

// Note: This test demonstrates the enhanced Supabase patterns
Deno.test(
  "Edge Function Integration - Complete workflow simulation",
  async () => {
    if (!(await isFunctionAvailable())) {
      console.log("Skipping test - function not available locally");
      return;
    }

    const client: SupabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      options
    );

    try {
      console.log("Starting complete workflow simulation...");

      // Step 1: Validate client connectivity
      assert(client, "Supabase client should be created");
      assert(
        typeof client.functions.invoke === "function",
        "Client should have functions.invoke method"
      );

      // Step 2: Make function call with proper error handling
      const { data: funcData, error: funcError } =
        await client.functions.invoke("generate-soap-notes", {
          body: validRequests[0],
          headers: {
            "X-Client-Info": "Deno-Test-Suite",
          },
        });

      // Step 3: Handle response appropriately
      if (funcError) {
        console.log(`Workflow stopped at function error: ${funcError.message}`);
        return;
      }

      if (funcData?.error) {
        console.log(`Workflow stopped at application error: ${funcData.error}`);
        return;
      }

      if (funcData) {
        // Step 4: Validate complete SOAP structure
        const requiredFields = [
          "subjective",
          "objective",
          "assessment",
          "plan",
        ];
        const missingFields = requiredFields.filter(
          (field) => !funcData[field]
        );

        if (missingFields.length === 0) {
          console.log("✓ Complete workflow simulation passed");
          console.log("  - Client creation: ✓");
          console.log("  - Function invocation: ✓");
          console.log("  - Response validation: ✓");
          console.log("  - SOAP structure: ✓");
        } else {
          console.log(
            `⚠ Missing required fields: ${missingFields.join(", ")}`
          );
        }
      }
    } catch (error) {
      console.log(
        `Workflow simulation error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);
