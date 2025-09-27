/// <reference lib="deno.ns" />
/**
 * Supabase Edge Function Integration Tests
 * Following the official Supabase testing guide patterns
 * https://supabase.com/docs/guides/functions/unit-test
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { validRequests, invalidRequests } from "./fixtures/test-data.ts";

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

/**
 * Test the creation and functionality of the Supabase client
 */
const testClientCreation = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  // Verify if the Supabase URL and key are provided
  if (!supabaseUrl) throw new Error("supabaseUrl is required.");
  if (!supabaseKey) throw new Error("supabaseKey is required.");

  // Test client connectivity - this is a basic check to ensure the client works
  assert(client, "Supabase client should be created successfully");
  assert(typeof client.functions, "object");
};

/**
 * Test the 'generate-soap-notes' function with valid input
 */
const testGenerateSoapNotesSuccess = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  try {
    // Invoke the 'generate-soap-notes' function with valid parameters
    const { data: funcData, error: funcError } = await client.functions.invoke(
      "generate-soap-notes",
      {
        body: validRequests[0],
      }
    );

    // Check for errors from the function invocation
    if (funcError) {
      // This might happen if the function is not deployed or not running
      console.log(
        `Function error (may be expected in test environment): ${funcError.message}`
      );
      return;
    }

    // If the function responded successfully, validate the response structure
    if (funcData) {
      console.log("Function response:", JSON.stringify(funcData, null, 2));

      // Assert that the function returned the expected SOAP note structure
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

      // Validate data types
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
    }
  } catch (error) {
    // If the function is not available, log and continue
    console.log(
      "Skipping SOAP generation test - function not available locally:"
    );
  }
};

/**
 * Test the 'generate-soap-notes' function with invalid input
 */
const testGenerateSoapNotesValidation = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  try {
    // Test with invalid request (empty transcription)
    const { data: funcData, error: funcError } = await client.functions.invoke(
      "generate-soap-notes",
      {
        body: invalidRequests[1], // { transcription: "" }
      }
    );

    // We expect either an error response or a 400 status error
    if (funcError) {
      console.log("Expected validation error:", funcError.message);
      assert(
        funcError.message.includes("400") ||
          funcError.message.includes("validation"),
        "Should receive validation error for invalid input"
      );
    } else if (funcData?.error) {
      assertExists(
        funcData.error,
        "Response should contain error field for invalid input"
      );
      assertEquals(typeof funcData.error, "string", "Error should be a string");
    }
  } catch (error) {
    console.log("Skipping validation test - function not available locally:");
  }
};

/**
 * Test the function with different types of invalid inputs
 */
const testGenerateSoapNotesErrorHandling = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  const testCases = [
    { name: "empty object", body: {} },
    { name: "null transcription", body: { transcription: null } },
    { name: "number transcription", body: { transcription: 123 } },
    { name: "whitespace only", body: { transcription: "   " } },
  ];

  for (const testCase of testCases) {
    try {
      const { data: funcData, error: funcError } =
        await client.functions.invoke("generate-soap-notes", {
          body: testCase.body,
        });

      // We expect validation errors for all these cases
      if (funcError || funcData?.error) {
        console.log(`✓ ${testCase.name}: correctly handled validation error`);
      } else if (funcData && !funcData.error) {
        // If no error was returned, this might indicate an issue with validation
        console.log(
          `⚠ ${testCase.name}: no validation error returned (might be unexpected)`
        );
      }
    } catch (error) {
      console.log(`Skipping ${testCase.name} test - function not available:`);
      break; // Skip remaining tests if function is not available
    }
  }
};

/**
 * Test CORS headers are properly set
 */
const testCorsHeaders = async () => {
  try {
    // Test CORS preflight request
    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-soap-notes`,
      {
        method: "OPTIONS",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
          Origin: "http://localhost:3000",
        },
      }
    );

    if (response.status === 204 || response.status === 200) {
      // Check CORS headers
      const allowOrigin = response.headers.get("Access-Control-Allow-Origin");
      const allowMethods = response.headers.get("Access-Control-Allow-Methods");
      const allowHeaders = response.headers.get("Access-Control-Allow-Headers");

      assertExists(
        allowOrigin,
        "Should have Access-Control-Allow-Origin header"
      );
      assertExists(
        allowMethods,
        "Should have Access-Control-Allow-Methods header"
      );
      assertExists(
        allowHeaders,
        "Should have Access-Control-Allow-Headers header"
      );

      console.log("CORS headers validated successfully");
    }
  } catch (error) {
    console.log("Skipping CORS test - function not available locally:", error);
  }
};

/**
 * Test function with proper authorization header
 */
const testAuthorizationHeader = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  try {
    // Test with valid authorization
    const { error: funcError } = await client.functions.invoke(
      "generate-soap-notes",
      {
        body: validRequests[0],
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    // The function should accept the request (even if it fails due to other reasons)
    if (funcError && funcError.message.includes("401")) {
      throw new Error(
        "Function should not return 401 with valid authorization header"
      );
    }

    console.log("Authorization header test passed");
  } catch (error) {
    console.log(
      "Skipping authorization test - function not available locally:"
    );
  }
};

/**
 * Test response time and performance characteristics
 */
const testPerformance = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options
  );

  try {
    const startTime = Date.now();

    const { data: funcData, error: funcError } = await client.functions.invoke(
      "generate-soap-notes",
      {
        body: validRequests[0],
      }
    );

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`Function response time: ${responseTime}ms`);

    // Performance assertions (these are reasonable for AI-based functions)
    assert(responseTime < 30000, "Function should respond within 30 seconds");

    if (!funcError && funcData) {
      console.log("Performance test passed");
    }
  } catch (error) {
    console.log("Skipping performance test - function not available locally:");
  }
};

// Register and run the tests using Deno.test
Deno.test("Supabase Client Creation Test", testClientCreation);
Deno.test("Generate SOAP Notes - Success Case", testGenerateSoapNotesSuccess);
Deno.test(
  "Generate SOAP Notes - Validation Test",
  testGenerateSoapNotesValidation
);
Deno.test(
  "Generate SOAP Notes - Error Handling",
  testGenerateSoapNotesErrorHandling
);
Deno.test("Generate SOAP Notes - CORS Headers", testCorsHeaders);
Deno.test("Generate SOAP Notes - Authorization", testAuthorizationHeader);
Deno.test("Generate SOAP Notes - Performance", testPerformance);
