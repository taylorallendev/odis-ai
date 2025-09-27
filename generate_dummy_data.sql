-- Generate dummy data for testing the veterinary SOAP template

-- Insert the template first
INSERT INTO templates (
  name,
  type,
  key,
  description,
  content,
  prompt,
  output_format,
  validation_schema,
  metadata
) VALUES (
  'Veterinary SOAP Note Template',
  'soap',
  'vet_soap_comprehensive_v1',
  'Complete veterinary SOAP note template with all essential clinical elements and validation',
  $json${
    "sections": [
      {
        "id": "subjective",
        "title": "Subjective",
        "description": "Patient history and owner-reported information",
        "elements": [
          {
            "name": "chief_complaint",
            "required": true,
            "dataPoint": "Primary reason for visit",
            "description": "Main concern or issue reported by owner",
            "inputType": "textarea",
            "placeholder": "Describe the primary concern that brought the patient in today...",
            "helpText": "Include duration, severity, progression, and any triggering factors",
            "validation": {
              "minLength": 10,
              "maxLength": 500
            }
          },
          {
            "name": "history_present_illness",
            "required": true,
            "dataPoint": "History of present illness",
            "description": "Detailed chronological history of the current problem",
            "inputType": "textarea",
            "placeholder": "Provide chronological details of the current illness...",
            "validation": {
              "minLength": 20,
              "maxLength": 800
            }
          },
          {
            "name": "appetite",
            "required": false,
            "dataPoint": "Appetite status",
            "description": "Current eating habits compared to normal",
            "inputType": "select",
            "options": ["Normal", "Decreased", "Increased", "Absent", "Variable"],
            "defaultValue": "Normal"
          },
          {
            "name": "water_consumption",
            "required": false,
            "dataPoint": "Water intake",
            "description": "Daily water consumption status",
            "inputType": "select",
            "options": ["Normal", "Increased", "Decreased"],
            "defaultValue": "Normal"
          },
          {
            "name": "urination",
            "required": false,
            "dataPoint": "Urination patterns",
            "description": "Frequency and characteristics of urination",
            "inputType": "select",
            "options": ["Normal", "Increased frequency", "Decreased frequency", "Difficulty urinating", "Blood in urine"],
            "defaultValue": "Normal"
          },
          {
            "name": "defecation",
            "required": false,
            "dataPoint": "Bowel movements",
            "description": "Frequency and consistency of bowel movements",
            "inputType": "select",
            "options": ["Normal", "Diarrhea", "Constipated", "Soft stools", "Hard stools"],
            "defaultValue": "Normal"
          },
          {
            "name": "activity_level",
            "required": false,
            "dataPoint": "Energy and activity level",
            "description": "Compared to normal activity levels",
            "inputType": "select",
            "options": ["Normal", "Decreased", "Lethargic", "Hyperactive"],
            "defaultValue": "Normal"
          },
          {
            "name": "behavior_changes",
            "required": false,
            "dataPoint": "Behavioral changes",
            "description": "Any noted changes in behavior or demeanor",
            "inputType": "textarea",
            "placeholder": "Describe any behavioral changes observed...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "current_medications",
            "required": false,
            "dataPoint": "Current medications",
            "description": "All medications currently being administered",
            "inputType": "textarea",
            "placeholder": "List all current medications with dosages...",
            "validation": {
              "maxLength": 400
            }
          }
        ]
      },
      {
        "id": "objective",
        "title": "Objective",
        "description": "Physical examination findings and clinical measurements",
        "elements": [
          {
            "name": "body_weight",
            "required": false,
            "dataPoint": "Body weight",
            "description": "Current weight in pounds",
            "inputType": "number",
            "placeholder": "25.5",
            "validation": {
              "min": 0.1,
              "max": 300,
              "step": 0.1
            }
          },
          {
            "name": "body_temperature",
            "required": false,
            "dataPoint": "Rectal temperature",
            "description": "Body temperature in Fahrenheit",
            "inputType": "number",
            "placeholder": "101.8",
            "validation": {
              "min": 95.0,
              "max": 110.0,
              "step": 0.1
            },
            "helpText": "Normal range: 100.5-102.5 degrees F"
          },
          {
            "name": "heart_rate",
            "required": false,
            "dataPoint": "Heart rate",
            "description": "Beats per minute",
            "inputType": "number",
            "placeholder": "120",
            "validation": {
              "min": 40,
              "max": 250
            },
            "helpText": "Normal varies by size and species"
          },
          {
            "name": "respiratory_rate",
            "required": false,
            "dataPoint": "Respiratory rate",
            "description": "Breaths per minute at rest",
            "inputType": "number",
            "placeholder": "24",
            "validation": {
              "min": 8,
              "max": 60
            },
            "helpText": "Normal range: 15-30 breaths per minute"
          },
          {
            "name": "body_condition_score",
            "required": false,
            "dataPoint": "Body condition score",
            "description": "BCS on 1-9 scale",
            "inputType": "select",
            "options": ["1 Emaciated", "2 Very thin", "3 Thin", "4 Underweight", "5 Ideal", "6 Overweight", "7 Heavy", "8 Obese", "9 Grossly obese"],
            "helpText": "5 equals ideal body condition"
          },
          {
            "name": "mucous_membranes",
            "required": false,
            "dataPoint": "Mucous membrane color",
            "description": "Color and capillary refill time",
            "inputType": "select",
            "options": ["Pink CRT under 2 seconds", "Pale", "Icteric", "Cyanotic", "Brick red", "CRT over 2 seconds"],
            "defaultValue": "Pink CRT under 2 seconds"
          },
          {
            "name": "hydration_status",
            "required": false,
            "dataPoint": "Hydration assessment",
            "description": "Clinical assessment of hydration",
            "inputType": "select",
            "options": ["Well hydrated", "Mildly dehydrated 3 to 5 percent", "Moderately dehydrated 6 to 8 percent", "Severely dehydrated over 8 percent"],
            "defaultValue": "Well hydrated"
          },
          {
            "name": "lymph_nodes",
            "required": false,
            "dataPoint": "Lymph node examination",
            "description": "Palpable lymph nodes assessment",
            "inputType": "select",
            "options": ["Normal", "Enlarged", "Not palpable"],
            "defaultValue": "Normal"
          },
          {
            "name": "cardiovascular_exam",
            "required": false,
            "dataPoint": "Cardiovascular findings",
            "description": "Heart sounds, pulse quality, rhythm",
            "inputType": "textarea",
            "placeholder": "Heart sounds, pulse quality, any murmurs or arrhythmias...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "respiratory_exam",
            "required": false,
            "dataPoint": "Respiratory examination",
            "description": "Lung sounds and breathing patterns",
            "inputType": "textarea",
            "placeholder": "Lung sounds, breathing effort, any abnormalities...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "abdominal_exam",
            "required": false,
            "dataPoint": "Abdominal examination",
            "description": "Palpation findings and organ assessment",
            "inputType": "textarea",
            "placeholder": "Abdominal palpation findings, organ size, pain response...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "neurological_exam",
            "required": false,
            "dataPoint": "Neurological assessment",
            "description": "Mental status, reflexes, coordination",
            "inputType": "textarea",
            "placeholder": "Mental status, gait, reflexes, coordination...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "integumentary_exam",
            "required": false,
            "dataPoint": "Skin and coat examination",
            "description": "Skin condition, coat quality, lesions",
            "inputType": "textarea",
            "placeholder": "Skin condition, coat quality, any lesions or abnormalities...",
            "validation": {
              "maxLength": 300
            }
          }
        ]
      },
      {
        "id": "assessment",
        "title": "Assessment",
        "description": "Clinical diagnosis and professional interpretation",
        "elements": [
          {
            "name": "primary_diagnosis",
            "required": true,
            "dataPoint": "Primary diagnosis",
            "description": "Most likely diagnosis based on findings",
            "inputType": "text",
            "placeholder": "Primary clinical diagnosis...",
            "validation": {
              "minLength": 3,
              "maxLength": 200
            }
          },
          {
            "name": "differential_diagnoses",
            "required": false,
            "dataPoint": "Differential diagnoses",
            "description": "Other possible diagnoses to consider",
            "inputType": "textarea",
            "placeholder": "List alternative diagnoses and reasoning...",
            "validation": {
              "maxLength": 500
            }
          },
          {
            "name": "clinical_reasoning",
            "required": false,
            "dataPoint": "Clinical reasoning",
            "description": "Rationale for diagnosis and interpretation of findings",
            "inputType": "textarea",
            "placeholder": "Explain the reasoning behind the diagnosis...",
            "validation": {
              "maxLength": 600
            }
          },
          {
            "name": "prognosis",
            "required": false,
            "dataPoint": "Prognosis",
            "description": "Expected outcome with treatment",
            "inputType": "select",
            "options": ["Excellent", "Good", "Fair", "Guarded", "Poor", "Grave"],
            "defaultValue": "Good"
          },
          {
            "name": "risk_factors",
            "required": false,
            "dataPoint": "Risk factors",
            "description": "Factors that may affect prognosis or treatment",
            "inputType": "textarea",
            "placeholder": "Identify any risk factors or complicating conditions...",
            "validation": {
              "maxLength": 300
            }
          }
        ]
      },
      {
        "id": "plan",
        "title": "Plan",
        "description": "Treatment plan and follow-up instructions",
        "elements": [
          {
            "name": "immediate_treatment",
            "required": true,
            "dataPoint": "Immediate treatment plan",
            "description": "Treatments to be initiated today",
            "inputType": "textarea",
            "placeholder": "Describe immediate treatments and interventions...",
            "validation": {
              "minLength": 20,
              "maxLength": 800
            }
          },
          {
            "name": "medications",
            "required": false,
            "dataPoint": "Prescribed medications",
            "description": "All medications with specific dosages and instructions",
            "inputType": "textarea",
            "placeholder": "List medications: drug name, dose, route, frequency, duration...",
            "validation": {
              "maxLength": 600
            }
          },
          {
            "name": "diagnostic_tests",
            "required": false,
            "dataPoint": "Recommended diagnostics",
            "description": "Additional tests needed for diagnosis or monitoring",
            "inputType": "textarea",
            "placeholder": "List recommended diagnostic tests and timing...",
            "validation": {
              "maxLength": 400
            }
          },
          {
            "name": "monitoring_instructions",
            "required": false,
            "dataPoint": "Monitoring at home",
            "description": "Parameters for owners to monitor",
            "inputType": "textarea",
            "placeholder": "What should owners watch for and monitor...",
            "validation": {
              "maxLength": 400
            }
          },
          {
            "name": "activity_restrictions",
            "required": false,
            "dataPoint": "Activity restrictions",
            "description": "Limitations on activity and exercise",
            "inputType": "textarea",
            "placeholder": "Specify any activity or exercise restrictions...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "dietary_recommendations",
            "required": false,
            "dataPoint": "Diet and nutrition",
            "description": "Dietary changes or special nutrition needs",
            "inputType": "textarea",
            "placeholder": "Dietary recommendations and feeding instructions...",
            "validation": {
              "maxLength": 300
            }
          },
          {
            "name": "follow_up_needed",
            "required": false,
            "dataPoint": "Follow-up required",
            "description": "Is follow-up appointment necessary",
            "inputType": "checkbox",
            "defaultValue": true
          },
          {
            "name": "follow_up_timeframe",
            "required": false,
            "dataPoint": "Follow-up timing",
            "description": "When should follow-up occur",
            "inputType": "select",
            "options": ["3 to 5 days", "1 week", "2 weeks", "3 to 4 weeks", "1 month", "2 to 3 months", "6 months", "As needed", "PRN"],
            "defaultValue": "1 week",
            "dependsOn": "follow_up_needed"
          },
          {
            "name": "emergency_instructions",
            "required": false,
            "dataPoint": "Emergency warning signs",
            "description": "Signs requiring immediate veterinary attention",
            "inputType": "textarea",
            "placeholder": "List specific warning signs that require immediate attention...",
            "validation": {
              "maxLength": 400
            }
          },
          {
            "name": "client_education",
            "required": false,
            "dataPoint": "Client education topics",
            "description": "Important information discussed with owner",
            "inputType": "textarea",
            "placeholder": "Key educational points covered with the client...",
            "validation": {
              "maxLength": 400
            }
          }
        ]
      }
    ]
  }$json$::jsonb,
  'Generate a comprehensive veterinary SOAP note from clinical examination data. Extract and organize all relevant clinical information into the structured SOAP format with appropriate medical terminology and complete documentation.',
  'json',
  $json${
    "inputValidation": {
      "required": ["chief_complaint", "history_present_illness", "primary_diagnosis", "immediate_treatment"],
      "conditionalRequired": {
        "follow_up_timeframe": "follow_up_needed"
      }
    },
    "outputStructure": {
      "subjective": {
        "chiefComplaint": "string",
        "historyPresentIllness": "string",
        "appetite": "string",
        "waterConsumption": "string",
        "urination": "string",
        "defecation": "string",
        "activityLevel": "string",
        "behaviorChanges": "string",
        "currentMedications": "string"
      },
      "objective": {
        "vitals": {
          "bodyWeight": "number",
          "bodyTemperature": "number",
          "heartRate": "number",
          "respiratoryRate": "number"
        },
        "physicalExam": {
          "bodyConditionScore": "string",
          "mucousMembranes": "string",
          "hydrationStatus": "string",
          "lymphNodes": "string",
          "cardiovascularExam": "string",
          "respiratoryExam": "string",
          "abdominalExam": "string",
          "neurologicalExam": "string",
          "integumentaryExam": "string"
        }
      },
      "assessment": {
        "primaryDiagnosis": "string",
        "differentialDiagnoses": "string",
        "clinicalReasoning": "string",
        "prognosis": "string",
        "riskFactors": "string"
      },
      "plan": {
        "immediateTreatment": "string",
        "medications": "string",
        "diagnosticTests": "string",
        "monitoring": "string",
        "restrictions": "string",
        "diet": "string",
        "followUp": {
          "needed": "boolean",
          "timeframe": "string"
        },
        "emergencyInstructions": "string",
        "clientEducation": "string"
      }
    }
  }$json$::jsonb,
  $json${
    "category": "veterinary",
    "subcategory": "clinical_documentation",
    "tags": ["soap", "comprehensive", "clinical", "examination", "veterinary", "medical_record"],
    "version": "1.0",
    "status": "production",
    "difficulty": "intermediate",
    "estimatedTime": "10-15 minutes",
    "species": ["canine", "feline", "avian", "exotic", "equine"],
    "veterinary_specialties": ["general_practice", "internal_medicine", "surgery", "emergency"],
    "created_by": "clinical_team",
    "reviewed_by": "veterinary_standards_committee",
    "last_updated": "2025-01-01",
    "compliance": {
      "veterinary_medical_records": true,
      "aaha_standards": true,
      "state_requirements": true
    },
    "features": [
      "comprehensive_soap_structure",
      "clinical_validation",
      "conditional_fields",
      "multi_system_examination",
      "medication_tracking",
      "follow_up_scheduling",
      "client_communication",
      "emergency_protocols"
    ],
    "integration": {
      "practice_management_systems": ["cornerstone", "avimark", "ezyvet"],
      "export_formats": ["pdf", "hl7", "xml"],
      "compatibility": {
        "zodVersion": "^3.22.0",
        "langchainVersion": "^0.1.0",
        "anthropicVersion": "^0.20.0"
      }
    },
    "quality_metrics": {
      "completeness_score": 95,
      "clinical_accuracy": 98,
      "user_satisfaction": 4.7,
      "processing_time_avg": "45_seconds"
    }
  }$json$::jsonb
);

-- Insert test cases
INSERT INTO cases (type, status, visibility) VALUES 
('checkup', 'ongoing', 'public'),
('emergency', 'ongoing', 'private'),
('surgery', 'completed', 'public');

-- Insert test patients  
INSERT INTO patients (name, owner_name, case_id) VALUES 
('Buddy', 'John Smith', (SELECT id FROM cases WHERE type = 'checkup' LIMIT 1)),
('Luna', 'Sarah Johnson', (SELECT id FROM cases WHERE type = 'emergency' LIMIT 1)),
('Max', 'Mike Wilson', (SELECT id FROM cases WHERE type = 'surgery' LIMIT 1));

-- Insert test transcriptions
INSERT INTO transcriptions (transcript, case_id) VALUES 
('Patient presented with lethargy and decreased appetite for 3 days. Owner reports normal urination and defecation. No vomiting or diarrhea. Physical exam reveals temperature 102.1F, heart rate 140 bpm, respiratory rate 28. Mucous membranes pink with CRT under 2 seconds. Abdomen soft and non-painful. Recommend blood work and supportive care.', 
 (SELECT id FROM cases WHERE type = 'checkup' LIMIT 1)),
('Emergency presentation - hit by car. Patient is conscious but showing signs of shock. Temperature 99.8F, heart rate 180 bpm, pale mucous membranes, CRT 3 seconds. Abdominal distension noted. Immediate IV fluids initiated. Radiographs show possible internal bleeding. Preparing for emergency surgery.',
 (SELECT id FROM cases WHERE type = 'emergency' LIMIT 1)),
('Post-operative check following spay surgery. Patient is alert and responsive. Incision site clean and dry with no signs of infection. Temperature 101.5F, heart rate 120 bpm. Owner reports normal appetite and activity returning. Sutures to be removed in 7-10 days.',
 (SELECT id FROM cases WHERE type = 'surgery' LIMIT 1));