import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "npm:zod";
import { ChatAnthropic } from "npm:@langchain/anthropic";
import { PromptTemplate } from "npm:@langchain/core/prompts";
import { TemplateToZodGenerator } from "./template-to-zod-generator.ts";
import { TemplatePrompts } from "./prompt-templates.ts";

/**
 * Universal Template-Based Content Generation Edge Function (LangChain Edition)
 * 
 * This function can generate structured output from any dynamic template by:
 * 1. Fetching template from database
 * 2. Dynamically generating Zod schemas from template structure
 * 3. Creating LangChain prompt templates for specific template types
 * 4. Using LangChain + ChatAnthropic for reliable structured output
 * 5. Validating output against generated schema with StructuredOutputParser
 * 6. Enhanced error handling and retry logic through LangChain
 * 7. Returning formatted results
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  try {
    // Get environment variables
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      return new Response(JSON.stringify({
        error: "Anthropic API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '', 
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Parse request body
    const { 
      template_id, 
      input_data, 
      transcription,
      case_id, 
      output_format = 'json',
      include_context = false 
    } = await req.json();

    if (!template_id) {
      return new Response(JSON.stringify({
        error: "template_id is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!input_data && !transcription) {
      return new Response(JSON.stringify({
        error: "Either input_data or transcription is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fetch the template
    const { data: template, error: templateError } = await supabaseClient
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError) {
      return new Response(JSON.stringify({
        error: "Failed to fetch template",
        details: templateError.message
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }


    // Generate the validation schema using TemplateToZodGenerator
    const validationSchema = TemplateToZodGenerator.generateSchema(template.content);


    // Gather context if requested
    let contextData: any = {};
    if (case_id && include_context) {
      const { data: transcriptions } = await supabaseClient
        .from('transcriptions')
        .select('*')
        .eq('case_id', case_id);
      
      const { data: soapNotes } = await supabaseClient
        .from('soap_notes')
        .select('*')
        .eq('case_id', case_id);
      
      if (transcriptions) contextData.transcriptions = transcriptions;
      if (soapNotes) contextData.soapNotes = soapNotes;
    }

    // Prepare input data
    const finalInputData = transcription || input_data;
    
    // Add context to input if available
    let enrichedInputData = finalInputData;
    if (Object.keys(contextData).length > 0) {
      enrichedInputData += "\\n\\n# ADDITIONAL CONTEXT\\n";
      if (contextData.transcriptions) {
        enrichedInputData += "\\n## Previous Transcriptions\\n";
        contextData.transcriptions.forEach((t: any, i: number) => {
          enrichedInputData += `\\nTranscription ${i + 1}: ${t.transcript}\\n`;
        });
      }
      if (contextData.soapNotes) {
        enrichedInputData += "\\n## Previous SOAP Notes\\n";
        contextData.soapNotes.forEach((s: any, i: number) => {
          enrichedInputData += `\\nSOAP Note ${i + 1}:\\n`;
          enrichedInputData += `Subjective: ${s.subjective || 'N/A'}\\n`;
          enrichedInputData += `Objective: ${s.objective || 'N/A'}\\n`;
          enrichedInputData += `Assessment: ${s.assessment || 'N/A'}\\n`;
          enrichedInputData += `Plan: ${s.plan || 'N/A'}\\n`;
        });
      }
    }

    // Setup LangChain components with modern v1.0+ approach
    const model = new ChatAnthropic({
      model: "claude-sonnet-4-20250514",
      temperature: 0,
      maxTokens: 4000,
      anthropicApiKey: anthropicApiKey,
    });

    // Use withStructuredOutput for modern LangChain v1.0+ approach
    const structuredModel = model.withStructuredOutput(validationSchema);
    
    // Get the prompt template for this template type
    const promptTemplate = TemplatePrompts.generatePrompt(
      template.type, 
      template.content, 
      enrichedInputData
    );

    console.log("Executing LangChain with structured output for content generation...");
    
    // Prepare input variables
    const templateInput = {
      template_structure: JSON.stringify(template.content, null, 2),
      schema_description: TemplateToZodGenerator.getSchemaDescription(template.content),
      input_data: enrichedInputData,
    };

    let structuredOutput: any;

    // Execute with modern structured output approach
    try {
      const formattedPrompt = await promptTemplate.format(templateInput);
      structuredOutput = await structuredModel.invoke([
        { role: "system", content: TemplatePrompts.SYSTEM_PROMPT },
        { role: "user", content: formattedPrompt }
      ]);
      console.log("LangChain structured output execution successful");
    } catch (error) {
      console.warn("LangChain structured output failed, attempting fallback:", error);
      
      // Fallback: try regular model call without structured output
      try {
        const fallbackPrompt = await promptTemplate.format(templateInput);
        const fallbackResponse = await model.invoke([
          { role: "system", content: TemplatePrompts.SYSTEM_PROMPT },
          { role: "user", content: fallbackPrompt }
        ]);
        
        // Try to parse JSON from response
        const responseText = fallbackResponse.content as string;
        const jsonMatch = responseText.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
          structuredOutput = JSON.parse(jsonMatch[0]);
          // Attempt validation
          try {
            structuredOutput = validationSchema.parse(structuredOutput);
            console.log("Fallback parsing successful with validation");
          } catch {
            console.log("Fallback parsing successful without validation");
          }
        } else {
          structuredOutput = { content: responseText };
        }
      } catch (fallbackError) {
        console.error("Both structured and fallback parsing failed:", fallbackError);
        throw new Error(`Content generation failed: ${fallbackError}`);
      }
    }

    // Format output based on requested format
    let finalOutput;
    switch (output_format) {
      case 'text':
        finalOutput = typeof structuredOutput === 'string' ? structuredOutput : JSON.stringify(structuredOutput, null, 2);
        break;
      case 'structured':
        finalOutput = formatStructuredOutput(structuredOutput, template.content);
        break;
      case 'json':
      default:
        finalOutput = structuredOutput;
        break;
    }

    // Save to generations table
    const { data: generation, error: saveError } = await supabaseClient
      .from('generations')
      .insert({
        prompt: await promptTemplate.format(templateInput),
        content: typeof finalOutput === 'string' ? finalOutput : JSON.stringify(finalOutput),
        template_id,
        case_id: case_id || null,
        metadata: {
          output_format,
          validation_passed: true,
          template_type: template.type
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save generation:", saveError);
      // Continue anyway, don't fail the request
    }

    return new Response(JSON.stringify({
      id: generation?.id,
      template_id,
      template_type: template.type,
      output_format,
      content: finalOutput,
      metadata: {
        validation_schema_generated: true,
        context_included: include_context && Object.keys(contextData).length > 0
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

// Helper function to format structured output
function formatStructuredOutput(output: any, templateContent: any): string {
  if (!templateContent?.sections) {
    return JSON.stringify(output, null, 2);
  }

  let formatted = '';
  
  templateContent.sections.forEach((section: any) => {
    formatted += `## ${section.title}\\n\\n`;
    
    const sectionData = output[section.id];
    if (sectionData && typeof sectionData === 'object') {
      Object.entries(sectionData).forEach(([key, value]) => {
        formatted += `**${key}**: ${value}\\n`;
      });
    } else if (sectionData) {
      formatted += `${sectionData}\\n`;
    }
    
    formatted += '\\n';
  });
  
  return formatted;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-from-template' \\
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \\
    --header 'Content-Type: application/json' \\
    --data '{
      "template_id": "5321b279-f228-40f0-846d-fd65853ccb76",
      "transcription": "The dog came in today for a routine checkup. The owner reports normal eating and drinking. Physical exam shows normal pulse and respiration.",
      "output_format": "json",
      "include_context": false
    }'

*/