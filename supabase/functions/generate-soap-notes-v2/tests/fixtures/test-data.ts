/**
 * Test fixtures and mock data
 */

export const mockTranscription = `
Hello. Hi. How are we doing? Okay. So we have Sweet Pea here Yep. For annual exam today. Yeah. Because it's been a while since she It's been two years since the last summer. So how has she been in the meantime? Pretty good. I guess the associate said she She has lost two pounds, which is very significant. Like, if she was 10, now she's eight, which is one fifth of her body weight, actually. Is she also drinking more water by chance? Maybe. Yeah? Being more maybe? Yeah. Because I decided to get one of those fountains so maybe so she would be more comfortable drinking more Mhmm. Kinda thing. I wonder, like, her age if she's So in aging cats, like, she's 14. Yeah. They could lose weight. Again, sometimes it's just that their nutritional requirement is less. They're eating less, and it's just a gradual normal weight loss versus it really could be kidney disease and high thyroid levels are both the most common conditions in aging cats, and both of them will lead to more drinking, more urination, and weight loss. So that's why I was asking that. Are you seeing excessive drinking or urination along with the weight loss that we're seeing? What would be a good thing is is to run a blood work on her. Oh, okay. We haven't seen her in two years. Yeah. So if we run what we call feline junior with UA, so we get blood and urine samples, send it out to the lab. And then by tomorrow, we'll have a pretty good idea on how her liver, kidney, pancreas are, white blood cells, thyroid levels, all of that. Uh-huh. And then we can make a good plan for her. Yeah. Okay? Yeah. Are we doing, sweet pea? Uh-huh. So you think she's eating okay? I think so. Because Yeah. Her ear canal is a clean She has you know, she's used to dry food, and, you know, I make it available for her so she can, you know, graze. So she's got moderate dental tartar. Look at this one, this upper tooth, this one. Right? Oh. It's the one zero eight. This one. Oh. You can't even see the tooth. It's covered with the tartar. It's the one zero eight. Oh. So there's a lot of tartar there. Oh. But, otherwise, the gums are still okay. They're not inflamed. No gingivitis. Eyes are good. Ear canals are clean. Her lymph nodes are fine. Oh, because sometimes, you know, you put a little light beam in there and really look or something, but maybe they do that for people instead. Yeah. Her heart and lungs sound good. Pretty girl. Stay? Alright. Yeah. Her kidneys palpate a little bit smaller. Okay. Stay. Hold on to her. Yeah. Otherwise, she's okay. And then how is she doing when she's jumping up and down? Is she okay, or do you see that she's getting Yeah. She doesn't, like, whimper or anything like that. Yeah. She's doing a good yoga stretch, so that's good. Her range of motion for her hips is not too bad. Her anal and perianal area is okay. So she's, yeah, she's got moderate dental tartar. Otherwise, she's not Okay. She's looking good for her age. Okay. So I'm gonna take her back. I'm gonna draw some samples on her. Okay. And then we'll do her FERCP. Okay? Oh, okay.
`;

export const mockSoapResponse = {
  subjective:
    "Limping on front right leg for 3 days, started Monday morning, no known trauma",
  objective:
    "Temperature 101.5°F (normal), heart sounds normal, lungs clear, swelling in carpus area",
  assessment: "Mild soft tissue injury, possibly sprain",
  plan: "Rest 5-7 days, anti-inflammatory medication, restricted activity, short leash walks only",
};

export const mockAnthropicResponse = {
  content: [
    {
      type: "text",
      text: "Mock response text",
    },
  ],
  id: "msg_123",
  model: "claude-sonnet-4-20250514",
  role: "assistant",
  stop_reason: "end_turn",
  stop_sequence: null,
  type: "message",
  usage: {
    input_tokens: 100,
    output_tokens: 50,
  },
};

export const mockApiError = {
  type: "error",
  error: {
    type: "invalid_request_error",
    message: "Invalid request",
  },
};

export const invalidTranscriptions = [
  "",
  "   ",
  "a".repeat(50001), // Too long
];

export const validRequests = [
  {
    transcription: mockTranscription,
  },
];

export const invalidRequests = [
  {},
  { transcription: "" },
  { transcription: "   " },
  { transcription: 123 },
  { transcription: null },
  { transcription: undefined },
];
