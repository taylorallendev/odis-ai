'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { Badge } from '@/src/components/ui/badge';
import { Loader2, Play, FileText, Zap } from 'lucide-react';
import { useUniversalGeneration, useTemplates } from '@/src/hooks/use-universal-generation';
import type { OutputFormat } from '@/src/types/templates';

/**
 * Example component demonstrating the Universal Template Generation System
 */
export function UniversalGenerationExample() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [inputData, setInputData] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [includeContext, setIncludeContext] = useState<boolean>(false);

  const { templates, fetchTemplates, isLoading: templatesLoading } = useTemplates();
  const { 
    generateFromTemplate, 
    isLoading: generating, 
    response, 
    error,
    reset 
  } = useUniversalGeneration({
    onSuccess: (result) => {
      console.log('Generation successful:', result);
    },
    onError: (err) => {
      console.error('Generation failed:', err);
    }
  });

  // Load templates on component mount
  React.useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Sample data for different template types
  const getSampleData = (templateType: string): string => {
    const samples = {
      soap: `Patient: Max, a 5-year-old Golden Retriever
Chief Complaint: Limping on right front leg for 2 days
History: Owner reports normal appetite and energy, but noticed limping after play session
Physical Exam: Temperature 101.5°F, weight 65 lbs, mild swelling in right carpal joint
Assessment: Likely carpal strain from overexertion
Plan: Rest for 5-7 days, Rimadyl 75mg twice daily, recheck if no improvement`,

      email: `Recipient: john.doe@email.com
Subject: Follow-up appointment for Max
Message: Hi John, following up on Max's examination today. He's doing well and should recover with the prescribed rest and medication. Please call if you have any questions.
Sender: Dr. Smith`,

      discharge: `Patient: Max the Golden Retriever
Diagnosis: Carpal strain
Medications: Rimadyl 75mg twice daily for 5 days
Activity: Restricted exercise for 1 week, no running or jumping
Diet: Normal diet, ensure adequate water
Follow-up: Call if limping worsens or if no improvement in 7 days
Emergency signs: Severe pain, inability to bear weight, loss of appetite`,

      intake: `New Patient Information:
Pet Name: Bella
Species: Cat
Breed: Domestic Shorthair
Age: 3 years
Weight: 8.5 pounds
Owner: Sarah Johnson
Phone: (555) 123-4567
Reason for visit: Annual wellness exam and vaccinations
Previous vet: First time patient
Current medications: None
Allergies: None known`
    };

    return samples[templateType as keyof typeof samples] || 
           'Sample input data for template generation testing.';
  };

  const handleGenerate = async () => {
    if (!selectedTemplateId || !inputData.trim()) {
      return;
    }

    reset(); // Clear previous results

    await generateFromTemplate(
      selectedTemplateId,
      inputData,
      undefined, // transcription
      undefined, // case_id
      outputFormat,
      includeContext
    );
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setInputData(getSampleData(template.type));
    }
  };

  const formatOutput = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Universal Template Generation</h1>
        <p className="text-muted-foreground">
          Generate structured output from any template using AI-powered content extraction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Configuration
            </CardTitle>
            <CardDescription>
              Configure your template and input data for generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="template">Select Template</Label>
              <Select 
                value={selectedTemplateId} 
                onValueChange={handleTemplateChange}
                disabled={templatesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Choose a template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <Label htmlFor="output-format">Output Format</Label>
              <Select value={outputFormat} onValueChange={(value: OutputFormat) => setOutputFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (Structured Object)</SelectItem>
                  <SelectItem value="text">Text (Plain Text)</SelectItem>
                  <SelectItem value="structured">Structured (Formatted Document)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input Data */}
            <div className="space-y-2">
              <Label htmlFor="input-data">Input Data</Label>
              <Textarea
                id="input-data"
                placeholder="Enter your input data, transcription, or form data here..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={!selectedTemplateId || !inputData.trim() || generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Generated Output
            </CardTitle>
            <CardDescription>
              AI-generated structured content based on your template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <h4 className="font-semibold text-destructive">Generation Error</h4>
                <p className="text-sm text-destructive/80 mt-1">{error.error}</p>
                {error.details && (
                  <p className="text-xs text-destructive/60 mt-2">{error.details}</p>
                )}
              </div>
            )}

            {response && (
              <div className="space-y-4">
                {/* Metadata */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Type: {response.template_type}
                  </Badge>
                  <Badge variant="outline">
                    Format: {response.output_format}
                  </Badge>
                  {response.metadata.validation_schema_generated && (
                    <Badge variant="outline" className="text-green-600">
                      Schema Validated
                    </Badge>
                  )}
                  {response.metadata.context_included && (
                    <Badge variant="outline" className="text-blue-600">
                      Context Included
                    </Badge>
                  )}
                </div>

                {/* Generated Content */}
                <div className="space-y-2">
                  <Label>Generated Content</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                      {formatOutput(response.content)}
                    </pre>
                  </div>
                </div>

                {/* Generation ID */}
                {response.id && (
                  <div className="text-xs text-muted-foreground">
                    Generation ID: {response.id}
                  </div>
                )}
              </div>
            )}

            {!response && !error && !generating && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a template and provide input data to generate content</p>
              </div>
            )}

            {generating && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Generating content...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
          <CardDescription>
            What makes this universal generation system powerful
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Template Agnostic</h4>
              <p className="text-sm text-muted-foreground">
                Works with any template type: SOAP notes, emails, discharge instructions, intake forms, and more.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Dynamic Validation</h4>
              <p className="text-sm text-muted-foreground">
                Automatically generates Zod schemas from template structure for runtime validation.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Intelligent Type Inference</h4>
              <p className="text-sm text-muted-foreground">
                Infers field types from naming patterns when not explicitly specified.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Multiple Output Formats</h4>
              <p className="text-sm text-muted-foreground">
                Generate JSON objects, plain text, or structured documents based on your needs.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Context Awareness</h4>
              <p className="text-sm text-muted-foreground">
                Can include related case data and historical information for better accuracy.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Robust Error Handling</h4>
              <p className="text-sm text-muted-foreground">
                Built-in retry logic, fallback handling, and comprehensive error reporting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UniversalGenerationExample;