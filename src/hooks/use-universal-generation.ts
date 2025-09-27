'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import type { 
  GenerateFromTemplateRequest, 
  GenerateFromTemplateResponse, 
  GenerateFromTemplateError,
  Template,
  OutputFormat 
} from '@/src/types/templates';

interface UseUniversalGenerationOptions {
  onSuccess?: (response: GenerateFromTemplateResponse) => void;
  onError?: (error: GenerateFromTemplateError) => void;
}

interface UseUniversalGenerationState {
  isLoading: boolean;
  error: GenerateFromTemplateError | null;
  response: GenerateFromTemplateResponse | null;
}

export function useUniversalGeneration(options: UseUniversalGenerationOptions = {}) {
  const [state, setState] = useState<UseUniversalGenerationState>({
    isLoading: false,
    error: null,
    response: null,
  });

  const supabase = createClient();

  const generateFromTemplate = useCallback(async (
    templateId: string,
    inputData?: string,
    transcription?: string,
    caseId?: string,
    outputFormat: OutputFormat = 'json',
    includeContext: boolean = false
  ): Promise<GenerateFromTemplateResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const request: GenerateFromTemplateRequest = {
        template_id: templateId,
        input_data: inputData,
        transcription: transcription,
        case_id: caseId,
        output_format: outputFormat,
        include_context: includeContext,
      };

      const { data, error } = await supabase.functions.invoke('generate-from-template', {
        body: request,
      });

      if (error) {
        const errorResponse: GenerateFromTemplateError = {
          error: 'Function invocation failed',
          details: error.message,
        };
        setState(prev => ({ ...prev, isLoading: false, error: errorResponse }));
        options.onError?.(errorResponse);
        return null;
      }

      if (data.error) {
        const errorResponse: GenerateFromTemplateError = data;
        setState(prev => ({ ...prev, isLoading: false, error: errorResponse }));
        options.onError?.(errorResponse);
        return null;
      }

      const response: GenerateFromTemplateResponse = data;
      setState(prev => ({ ...prev, isLoading: false, response }));
      options.onSuccess?.(response);
      return response;

    } catch (err) {
      const errorResponse: GenerateFromTemplateError = {
        error: 'Unexpected error',
        details: err instanceof Error ? err.message : 'Unknown error occurred',
      };
      setState(prev => ({ ...prev, isLoading: false, error: errorResponse }));
      options.onError?.(errorResponse);
      return null;
    }
  }, [supabase, options]);

  const generateFromTranscription = useCallback(async (
    templateId: string,
    transcription: string,
    caseId?: string,
    outputFormat: OutputFormat = 'json',
    includeContext: boolean = true
  ) => {
    return generateFromTemplate(templateId, undefined, transcription, caseId, outputFormat, includeContext);
  }, [generateFromTemplate]);

  const generateFromFormData = useCallback(async (
    templateId: string,
    formData: Record<string, any>,
    outputFormat: OutputFormat = 'json'
  ) => {
    const inputData = typeof formData === 'string' ? formData : JSON.stringify(formData, null, 2);
    return generateFromTemplate(templateId, inputData, undefined, undefined, outputFormat);
  }, [generateFromTemplate]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      response: null,
    });
  }, []);

  return {
    ...state,
    generateFromTemplate,
    generateFromTranscription,
    generateFromFormData,
    reset,
  };
}

// Hook for fetching templates with enhanced information
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTemplates = useCallback(async (type?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('templates_enhanced').select('*');
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const getTemplate = useCallback(async (id: string): Promise<Template | null> => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching template:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error fetching template:', err);
      return null;
    }
  }, [supabase]);

  const createTemplate = useCallback(async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from('templates')
        .insert(template)
        .select()
        .single();

      if (createError) {
        setError(createError.message);
        return null;
      }

      // Refresh templates list
      await fetchTemplates();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, fetchTemplates]);

  const updateTemplate = useCallback(async (
    id: string, 
    updates: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        return null;
      }

      // Refresh templates list
      await fetchTemplates();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      // Refresh templates list
      await fetchTemplates();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

// Hook for working with generation history
export function useGenerationHistory() {
  const [generations, setGenerations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchGenerations = useCallback(async (caseId?: string, templateId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('generations')
        .select(`
          *,
          templates (
            name,
            type
          )
        `);

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      if (templateId) {
        query = query.eq('template_id', templateId);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setGenerations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch generations');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const getGeneration = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select(`
          *,
          templates (
            name,
            type,
            content
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching generation:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error fetching generation:', err);
      return null;
    }
  }, [supabase]);

  return {
    generations,
    isLoading,
    error,
    fetchGenerations,
    getGeneration,
  };
}