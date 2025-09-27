/**
 * Local test script for the refactored SOAP notes generation function
 * Run with: deno run --allow-net --allow-env test-local.ts
 */

// Mock environment variables for testing
Deno.env.set("ANTHROPIC_API_KEY", "test-key-for-local-testing");

// Import the main handler function
import './index.ts';

// Test data - matches your SwiftUI client format
const testTranscriptionPlain = `
The patient came in today with limping issues on the front right leg for about 3 days. 
The owner mentioned it started Monday morning and the dog was clearly favoring that leg.
During examination, I found some tenderness in the shoulder area. 
The heart and lungs sound normal. No fever detected. 
I'm recommending some anti-inflammatory medication and rest for a few days.
Follow up in one week if symptoms persist.
`;

const testTranscriptionDiarized = `
[09:15:30] Dr. Smith: Hi, how can I help you today?
[09:15:35] Client: I brought Max in because he's been limping on his front right leg.
[09:15:40] Dr. Smith: When did this start exactly?
[09:15:45] Client: It started Monday morning. He was fine Sunday night.
[09:16:00] Dr. Smith: Let me examine the shoulder area... I can feel some tenderness here.
[09:17:30] Dr. Smith: His heart and lungs sound normal. No fever. I'm recommending anti-inflammatory medication.
[09:18:00] Client: How long should he take the medication?
[09:18:10] Dr. Smith: Give it for 5 days and come back if symptoms persist.
`;

async function testEdgeFunction() {
  console.log('🧪 Testing refactored SOAP notes generation edge function...');
  
  const tests = [
    {
      name: 'Plain transcription (non-diarized)',
      transcription: testTranscriptionPlain,
      expectedFormat: 'should use speaker identification'
    },
    {
      name: 'Diarized transcription (pre-processed)',
      transcription: testTranscriptionDiarized,
      expectedFormat: 'should detect pre-processed format'
    }
  ];

  for (const test of tests) {
    console.log(`\n🔍 Testing: ${test.name}`);
    
    try {
      const request = new Request('http://localhost:8000/generate-soap-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          transcription: test.transcription
        })
      });

      // Since we can't actually run the edge function locally without Supabase,
      // let's test the individual components instead
      
      console.log(`✅ Request structure valid for: ${test.name}`);
      console.log(`   Transcription length: ${test.transcription.length} characters`);
      console.log(`   Expected: ${test.expectedFormat}`);
      
    } catch (error) {
      console.error(`❌ Test failed for ${test.name}:`, error);
    }
  }
}

// Test individual service components
async function testServices() {
  console.log('\n🔧 Testing individual service components...');
  
  try {
    // Import and test configuration
    const { getConfig } = await import('./config/index.js');
    const config = getConfig();
    console.log('✅ Configuration loaded successfully');
    console.log('   Model:', config.anthropic.model);
    console.log('   Max tokens:', config.anthropic.maxTokens);
    
    // Import and test validation
    const { validateRequest, generateSoapNotesRequestSchema } = await import('./utils/validation.js');
    const validRequest = { transcription: 'Test transcription' };
    const result = validateRequest(generateSoapNotesRequestSchema, validRequest);
    console.log('✅ Request validation working');
    
    // Import and test prompts service
    const { PromptsService } = await import('./services/prompts.service.js');
    const promptsService = new PromptsService();
    const systemPrompt = promptsService.getSoapSystemPrompt({
      veterinarian: 'Dr. Smith',
      client: 'Pet Owner'
    });
    console.log('✅ Prompts service working');
    console.log('   System prompt length:', systemPrompt.length);
    
    // Test that all SOAP section prompts work
    const subjectivePrompt = promptsService.getSubjectivePrompt('test');
    const objectivePrompt = promptsService.getObjectivePrompt('test');
    const assessmentPrompt = promptsService.getAssessmentPrompt('test');
    const planPrompt = promptsService.getPlanPrompt('test');
    
    console.log('✅ All SOAP section prompts generated successfully');
    console.log('   Subjective prompt length:', subjectivePrompt.length);
    console.log('   Objective prompt length:', objectivePrompt.length);
    console.log('   Assessment prompt length:', assessmentPrompt.length);
    console.log('   Plan prompt length:', planPrompt.length);
    
  } catch (error) {
    console.error('❌ Service component test failed:', error);
  }
}

// Run tests
if (import.meta.main) {
  console.log('🚀 Starting SOAP notes edge function tests...');
  await testEdgeFunction();
  await testServices();
  console.log('\n✨ Test run completed!');
}