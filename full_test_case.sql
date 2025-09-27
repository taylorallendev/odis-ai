-- Full realistic veterinary case for testing the SOAP template

-- Insert a complete test case
INSERT INTO cases (type, status, visibility) VALUES ('checkup', 'ongoing', 'public');

-- Get the case ID for reference
DO $$
DECLARE
    test_case_id UUID;
BEGIN
    -- Get the newly created case ID
    SELECT id INTO test_case_id FROM cases WHERE type = 'checkup' ORDER BY created_at DESC LIMIT 1;
    
    -- Insert patient
    INSERT INTO patients (name, owner_name, case_id) VALUES 
    ('Bella', 'Jennifer Martinez', test_case_id);
    
    -- Insert detailed transcription
    INSERT INTO transcriptions (transcript, case_id) VALUES (
    'Good morning, this is Dr. Sarah Chen with Bella, a 6-year-old spayed female Golden Retriever belonging to Jennifer Martinez. Jennifer brought Bella in today because she noticed that Bella has been drinking a lot more water than usual over the past two weeks, and urinating much more frequently. She mentioned that Bella is asking to go outside every hour or two, which is not normal for her. Jennifer also noticed that Bella seems to be eating more than usual but has actually lost about 3 pounds over the last month. Her appetite is definitely increased - she''s been begging for food constantly and even got into the garbage yesterday, which is very unusual behavior for her. Jennifer reports that Bella''s energy level seems normal during walks, but she does seem to get tired more easily than before. No vomiting or diarrhea reported. Bella is current on all vaccinations and takes heartworm prevention monthly. No other medications currently.

On physical examination, Bella is alert and responsive but appears slightly thin. Her current weight is 62 pounds, down from her normal 65 pounds. Body condition score I would estimate at about 4 out of 9. Temperature is 101.2 degrees Fahrenheit, which is within normal range. Heart rate is 110 beats per minute, regular rhythm. Respiratory rate is 22 breaths per minute, normal effort. Mucous membranes are pink with capillary refill time under 2 seconds. She appears well hydrated with good skin elasticity. 

Cardiovascular examination reveals regular heart sounds, no murmurs detected. Strong peripheral pulses palpated. Respiratory examination shows clear lung sounds bilaterally, no abnormal sounds. Abdominal palpation reveals no obvious masses or pain response, though the liver edge may be slightly enlarged but this is difficult to assess definitively. Neurological examination shows normal mentation, appropriate responses, and normal gait. The coat appears slightly dull and thin compared to a typical Golden Retriever coat.

Lymph nodes are within normal limits. Eyes show no discharge, pupils equal and responsive to light. Ears are clean with no odor or discharge.

Based on the history of polydipsia, polyuria, polyphagia with weight loss in a middle-aged dog, I am highly suspicious of diabetes mellitus. The clinical signs are classic for this condition. I would also consider hyperadrenocorticism as a differential diagnosis given the increased appetite and some of the physical findings.

My immediate plan is to run a complete blood chemistry panel including glucose, and a complete blood count. I will also run a urinalysis to check for glucose and ketones in the urine. If blood glucose is elevated and we find glucose in the urine, this will confirm diabetes mellitus. I''ve discussed with Jennifer that if this is diabetes, Bella will need to start insulin therapy and will require dietary management and regular monitoring.

I''ve advised Jennifer to monitor Bella''s water intake and urination closely, and to call immediately if she notices any vomiting, lethargy, or changes in appetite. We''ve scheduled a follow-up appointment for tomorrow to review lab results and discuss treatment options. I''ve also provided Jennifer with educational materials about canine diabetes management.',
    test_case_id);

END $$;