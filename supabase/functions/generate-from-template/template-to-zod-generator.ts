import { z } from "npm:zod";

/**
 * TemplateToZodGenerator
 * 
 * Dynamically generates Zod schemas from template structures to enable
 * structured output parsing and validation with LangChain
 */
export class TemplateToZodGenerator {
  /**
   * Generate a Zod schema from a template content structure
   */
  static generateSchema(templateContent: any): z.ZodType<any> {
    if (!templateContent?.sections) {
      return z.object({});
    }

    const sectionSchemas: Record<string, z.ZodType<any>> = {};

    templateContent.sections.forEach((section: any) => {
      if (!section.elements || section.elements.length === 0) {
        sectionSchemas[section.id] = z.string().optional();
        return;
      }

      const elementSchemas: Record<string, z.ZodType<any>> = {};

      section.elements.forEach((element: any) => {
        let schema: z.ZodType<any>;

        // Intelligent type inference based on element properties
        
        const inputType = element.inputType || this.inferInputType(element);
        const defaultValue = element.defaultValue;
        const options = element.options;
        const validation = element.validation || {};

        switch (inputType) {
          case 'number':
            schema = z.number();
            if (validation.min !== undefined) schema = schema.min(validation.min);
            if (validation.max !== undefined) schema = schema.max(validation.max);
            break;
          case 'boolean':
          case 'checkbox':
            schema = z.boolean();
            break;
          case 'date':
            schema = z.string().refine((val) => !isNaN(Date.parse(val)), {
              message: "Invalid date format"
            });
            break;
          case 'select':
          case 'radio':
            if (options && options.length > 0) {
              schema = z.enum(options as [string, ...string[]]);
            } else {
              schema = z.string();
            }
            break;
          case 'textarea':
            schema = z.string();
            if (validation.minLength) schema = schema.min(validation.minLength);
            if (validation.maxLength) schema = schema.max(validation.maxLength);
            break;
          case 'email':
            schema = z.string().email();
            break;
          case 'url':
            schema = z.string().url();
            break;
          case 'text':
          default:
            schema = z.string();
            if (validation.pattern) {
              schema = schema.regex(new RegExp(validation.pattern));
            }
            if (validation.minLength) schema = schema.min(validation.minLength);
            if (validation.maxLength) schema = schema.max(validation.maxLength);
            break;
        }

        // Handle required fields
        if (!element.required) {
          schema = schema.optional();
        }

        // Add default value if provided
        if (defaultValue !== undefined) {
          schema = schema.default(defaultValue);
        }

        elementSchemas[element.name] = schema;
      });

      sectionSchemas[section.id] = z.object(elementSchemas);
    });

    return z.object(sectionSchemas);
  }

  /**
   * Intelligent input type inference based on element properties
   */
  private static inferInputType(element: any): string {
    const name = element.name?.toLowerCase() || '';
    const description = element.description?.toLowerCase() || '';
    const dataPoint = element.dataPoint?.toLowerCase() || '';

    // Check for common patterns
    if (name.includes('email') || description.includes('email')) return 'email';
    if (name.includes('url') || name.includes('website')) return 'url';
    if (name.includes('date') || name.includes('time')) return 'date';
    if (name.includes('age') || name.includes('weight') || name.includes('count')) return 'number';
    if (name.includes('notes') || name.includes('description') || description.includes('detailed')) return 'textarea';
    if (name.includes('active') || name.includes('enabled') || name.includes('is_')) return 'checkbox';
    
    // Default to text
    return 'text';
  }

  /**
   * Get a description of the schema for use in prompts
   */
  static getSchemaDescription(templateContent: any): string {
    if (!templateContent?.sections) {
      return "No specific structure required";
    }

    let description = "Expected JSON structure:\n";
    
    templateContent.sections.forEach((section: any) => {
      description += `\n"${section.id}": {\n`;
      
      if (section.elements && section.elements.length > 0) {
        section.elements.forEach((element: any) => {
          const type = element.inputType || this.inferInputType(element);
          const required = element.required ? ' (required)' : ' (optional)';
          description += `  "${element.name}": ${type}${required}\n`;
        });
      } else {
        description += `  // String content for ${section.title}\n`;
      }
      
      description += "}\n";
    });

    return description;
  }
}