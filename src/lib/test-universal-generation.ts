/**
 * Test Suite for Universal Template Generation System
 * 
 * This file contains test functions to verify the universal generation system
 * works correctly with existing templates and various input types.
 */

import { createClient } from '@/src/lib/supabase/client';
import type { 
  GenerateFromTemplateRequest, 
  GenerateFromTemplateResponse,
  Template 
} from '@/src/types/templates';

// Test data
const TEST_TRANSCRIPTION = `
The patient is a 5-year-old golden retriever named Max who came in today for a routine wellness examination. 
The owner reports that Max has been eating and drinking normally. His energy levels are good and he's been 
playing fetch regularly. The owner mentions that Max has been limping slightly on his right front leg for 
the past 2 days, especially after exercise.

Physical examination reveals:
- Temperature: 101.5°F (normal)
- Weight: 65 pounds
- Heart rate: 120 bpm, regular rhythm
- Respiratory rate: 24 breaths per minute
- Mucous membranes: pink and moist
- Lymph nodes: normal
- Right front leg shows mild swelling around the carpal joint
- Pain response when palpating the carpal area
- Normal range of motion in all other joints
- Coat appears healthy, no skin issues noted
- Eyes and ears appear normal

Based on the examination, the likely diagnosis is mild carpal strain, possibly from overexertion during play. 
Recommended treatment includes rest for 5-7 days, anti-inflammatory medication (Rimadyl 75mg twice daily for 5 days), 
and follow-up examination if symptoms persist. Owner advised to limit exercise and monitor for improvement.
`;

const TEST_FORM_DATA = {
  chief_complaint: "Limping on right front leg",
  duration: "2 days",
  appetite: "Normal",
  energy: "Good",
  temperature: 101.5,
  weight: 65,
  heart_rate: 120,
  diagnosis: "Mild carpal strain",
  treatment: "Rest, Rimadyl 75mg twice daily for 5 days",
  followup: "5-7 days if no improvement"
};

/**
 * Test the universal generation function with a SOAP template
 */
export async function testSoapGeneration() {
  console.log('🧪 Testing SOAP Generation...');
  
  const supabase = createClient();
  
  // First, get a SOAP template
  const { data: templates, error: templateError } = await supabase
    .from('templates')
    .select('*')
    .eq('type', 'soap')
    .limit(1);

  if (templateError || !templates || templates.length === 0) {
    console.error('❌ No SOAP templates found:', templateError);
    return false;
  }

  const template = templates[0];
  console.log(`📋 Using template: ${template.name}`);

  try {
    const request: GenerateFromTemplateRequest = {
      template_id: template.id,
      transcription: TEST_TRANSCRIPTION,
      output_format: 'json',
      include_context: false
    };

    const { data, error } = await supabase.functions.invoke('generate-from-template', {
      body: request
    });

    if (error) {
      console.error('❌ Function invocation error:', error);
      return false;
    }

    if (data.error) {
      console.error('❌ Generation error:', data.error);
      return false;
    }

    console.log('✅ SOAP generation successful!');
    console.log('📄 Generated content:', JSON.stringify(data.content, null, 2));
    console.log('📊 Metadata:', data.metadata);
    
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err);
    return false;
  }
}

/**
 * Test the generation with form data input
 */
export async function testFormDataGeneration() {
  console.log('🧪 Testing Form Data Generation...');
  
  const supabase = createClient();
  
  // Get any available template
  const { data: templates, error: templateError } = await supabase
    .from('templates')
    .select('*')
    .not('content', 'is', null)
    .limit(1);

  if (templateError || !templates || templates.length === 0) {
    console.error('❌ No templates with content found:', templateError);
    return false;
  }

  const template = templates[0];
  console.log(`📋 Using template: ${template.name}`);

  try {
    const request: GenerateFromTemplateRequest = {
      template_id: template.id,
      input_data: JSON.stringify(TEST_FORM_DATA, null, 2),
      output_format: 'structured',
      include_context: false
    };

    const { data, error } = await supabase.functions.invoke('generate-from-template', {
      body: request
    });

    if (error) {
      console.error('❌ Function invocation error:', error);
      return false;
    }

    if (data.error) {
      console.error('❌ Generation error:', data.error);
      return false;
    }

    console.log('✅ Form data generation successful!');
    console.log('📄 Generated content:', data.content);
    console.log('📊 Metadata:', data.metadata);
    
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err);
    return false;
  }
}

/**
 * Test different output formats
 */
export async function testOutputFormats() {
  console.log('🧪 Testing Output Formats...');
  
  const supabase = createClient();
  
  // Get a template
  const { data: templates, error: templateError } = await supabase
    .from('templates')
    .select('*')
    .not('content', 'is', null)
    .limit(1);

  if (templateError || !templates || templates.length === 0) {
    console.error('❌ No templates found:', templateError);
    return false;
  }

  const template = templates[0];
  const formats: Array<'json' | 'text' | 'structured'> = ['json', 'text', 'structured'];
  const results = [];

  for (const format of formats) {
    console.log(`📊 Testing ${format} format...`);
    
    try {
      const request: GenerateFromTemplateRequest = {
        template_id: template.id,
        input_data: "Sample input data for testing output formats",
        output_format: format,
        include_context: false
      };

      const { data, error } = await supabase.functions.invoke('generate-from-template', {
        body: request
      });

      if (error || data.error) {
        console.error(`❌ ${format} format test failed:`, error || data.error);
        results.push({ format, success: false });
        continue;
      }

      console.log(`✅ ${format} format successful!`);
      console.log(`📄 Content type: ${typeof data.content}`);
      console.log(`📄 Content preview: ${JSON.stringify(data.content).substring(0, 100)}...`);
      
      results.push({ format, success: true, data });
    } catch (err) {
      console.error(`❌ ${format} format test failed:`, err);
      results.push({ format, success: false });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`📊 Output format tests: ${successCount}/${formats.length} successful`);
  
  return successCount === formats.length;
}

/**
 * Test schema generation and validation
 */
export async function testSchemaGeneration() {
  console.log('🧪 Testing Schema Generation...');
  
  const supabase = createClient();
  
  // Create a test template with various field types
  const testTemplate = {
    name: 'Schema Test Template',
    type: 'test',
    content: {
      sections: [
        {
          id: 'section1',
          title: 'Test Section',
          elements: [
            {
              name: 'text_field',
              required: true,
              dataPoint: 'Test text field',
              inputType: 'text',
              validation: { minLength: 5, maxLength: 100 }
            },
            {
              name: 'number_field',
              required: false,
              dataPoint: 'Test number field',
              inputType: 'number',
              validation: { min: 0, max: 1000 }
            },
            {
              name: 'email_field',
              required: true,
              dataPoint: 'Test email field',
              inputType: 'email'
            },
            {
              name: 'select_field',
              required: false,
              dataPoint: 'Test select field',
              inputType: 'select',
              options: ['Option1', 'Option2', 'Option3'],
              defaultValue: 'Option1'
            }
          ]
        }
      ]
    },
    prompt: 'Test schema generation and validation',
    output_format: 'json'
  };

  try {
    // Insert test template
    const { data: createdTemplate, error: createError } = await supabase
      .from('templates')
      .insert(testTemplate)
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create test template:', createError);
      return false;
    }

    console.log('📋 Created test template:', createdTemplate.id);

    // Test generation with valid data
    const validData = {
      text_field: 'This is a valid text field with enough characters',
      number_field: 50,
      email_field: 'test@example.com',
      select_field: 'Option2'
    };

    const request: GenerateFromTemplateRequest = {
      template_id: createdTemplate.id,
      input_data: JSON.stringify(validData),
      output_format: 'json'
    };

    const { data, error } = await supabase.functions.invoke('generate-from-template', {
      body: request
    });

    // Clean up test template
    await supabase.from('templates').delete().eq('id', createdTemplate.id);

    if (error || data.error) {
      console.error('❌ Schema generation test failed:', error || data.error);
      return false;
    }

    console.log('✅ Schema generation successful!');
    console.log('📊 Validation passed:', data.metadata.validation_schema_generated);
    
    return true;
  } catch (err) {
    console.error('❌ Schema generation test failed:', err);
    return false;
  }
}

/**
 * Test context inclusion feature
 */
export async function testContextInclusion() {
  console.log('🧪 Testing Context Inclusion...');
  
  const supabase = createClient();
  
  // Get any available template and case
  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .limit(1);

  const { data: cases } = await supabase
    .from('cases')
    .select('id')
    .limit(1);

  if (!templates || templates.length === 0 || !cases || cases.length === 0) {
    console.log('⚠️ Skipping context inclusion test - no templates or cases available');
    return true;
  }

  try {
    const request: GenerateFromTemplateRequest = {
      template_id: templates[0].id,
      transcription: TEST_TRANSCRIPTION,
      case_id: cases[0].id,
      output_format: 'json',
      include_context: true
    };

    const { data, error } = await supabase.functions.invoke('generate-from-template', {
      body: request
    });

    if (error || data.error) {
      console.error('❌ Context inclusion test failed:', error || data.error);
      return false;
    }

    console.log('✅ Context inclusion successful!');
    console.log('📊 Context included:', data.metadata.context_included);
    
    return true;
  } catch (err) {
    console.error('❌ Context inclusion test failed:', err);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Starting Universal Generation System Tests...');
  console.log('=' .repeat(50));

  const tests = [
    { name: 'SOAP Generation', fn: testSoapGeneration },
    { name: 'Form Data Generation', fn: testFormDataGeneration },
    { name: 'Output Formats', fn: testOutputFormats },
    { name: 'Schema Generation', fn: testSchemaGeneration },
    { name: 'Context Inclusion', fn: testContextInclusion }
  ];

  const results = [];

  for (const test of tests) {
    console.log('\\n' + '-'.repeat(30));
    console.log(`Running: ${test.name}`);
    console.log('-'.repeat(30));
    
    const startTime = Date.now();
    const success = await test.fn();
    const duration = Date.now() - startTime;
    
    results.push({ name: test.name, success, duration });
    
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`${success ? '✅' : '❌'} ${test.name}: ${success ? 'PASSED' : 'FAILED'}`);
  }

  console.log('\\n' + '='.repeat(50));
  console.log('🧪 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name} (${result.duration}ms)`);
  });

  console.log('\\n' + '-'.repeat(30));
  console.log(`📊 Overall: ${passed}/${total} tests passed`);
  console.log(`⏱️ Total time: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Universal generation system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.');
  }

  return passed === total;
}

/**
 * Simple test function that can be called from browser console
 */
export async function quickTest() {
  console.log('🧪 Running Quick Test...');
  
  const supabase = createClient();
  
  // Get the first available template
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .not('content', 'is', null)
    .limit(1);

  if (error || !templates || templates.length === 0) {
    console.error('❌ No templates available for testing');
    return false;
  }

  const template = templates[0];
  console.log(`📋 Testing with template: ${template.name} (${template.type})`);

  const request: GenerateFromTemplateRequest = {
    template_id: template.id,
    transcription: "Quick test: The patient appears healthy with normal vital signs.",
    output_format: 'json'
  };

  try {
    const { data, error: funcError } = await supabase.functions.invoke('generate-from-template', {
      body: request
    });

    if (funcError || data.error) {
      console.error('❌ Quick test failed:', funcError || data.error);
      return false;
    }

    console.log('✅ Quick test passed!');
    console.log('📄 Generated content:', data.content);
    return true;
  } catch (err) {
    console.error('❌ Quick test failed:', err);
    return false;
  }
}

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testUniversalGeneration = {
    runAllTests,
    quickTest,
    testSoapGeneration,
    testFormDataGeneration,
    testOutputFormats,
    testSchemaGeneration,
    testContextInclusion
  };
}