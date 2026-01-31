// OpenAI API Service for generating insights, first principles, and analysis

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function callOpenAI(messages: ChatMessage[], temperature = 0.7): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment.');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to call OpenAI API');
  }

  const data: OpenAIResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Generate 3-5 critical insights from chapter content
export async function generateInsights(chapterTitle: string, chapterContent: string, chapterSummary: string): Promise<Array<{
  title: string;
  summary: string;
  evidence: string;
  implication: string;
}>> {
  const prompt = `Extract the 3-5 most critical insights from this chapter. 

Chapter Title: ${chapterTitle}
Chapter Summary: ${chapterSummary}
Chapter Content: ${chapterContent.slice(0, 8000)}

For each insight, provide in this exact JSON format:
{
  "insights": [
    {
      "title": "Short, punchy title (5-8 words)",
      "summary": "One-sentence summary of the insight",
      "evidence": "Specific evidence from the text supporting this insight (1-2 sentences)",
      "implication": "One real-world implication or application of this insight"
    }
  ]
}

Focus on insights that are:
- Counterintuitive or surprising
- Fundamentally important to understanding the topic
- Have practical applications

Respond ONLY with valid JSON, no markdown formatting.`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: 'You are an expert at extracting deep insights from educational content. You respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ], 0.5);

    // Clean up the response to ensure valid JSON
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanedResponse);
    return parsed.insights || [];
  } catch (error) {
    console.error('Failed to generate insights:', error);
    // Return fallback insights
    return [
      {
        title: 'Core Concept Identified',
        summary: 'The chapter presents fundamental principles that form the foundation of this subject.',
        evidence: 'Key arguments and examples throughout the text support this understanding.',
        implication: 'These principles can be applied to analyze and understand related phenomena in the real world.'
      }
    ];
  }
}

// Generate first principles analysis
export async function generateFirstPrinciples(chapterTitle: string, chapterContent: string, concept: string): Promise<{
  principle: string;
  explanation: string;
  breakdown: string[];
}> {
  const prompt = `Break down the concept "${concept}" from the chapter "${chapterTitle}" into first principles.

Chapter Content: ${chapterContent.slice(0, 6000)}

A first principle is a fundamental truth that cannot be deduced from any other assumption within the system. 

Provide your response in this exact JSON format:
{
  "principle": "The core first principle statement (one sentence)",
  "explanation": "A clear explanation of what this principle means and why it's fundamental (2-3 sentences)",
  "breakdown": [
    "Step 1: Identify and question the most basic assumption",
    "Step 2: Find the irreducible truth beneath it", 
    "Step 3: Verify this truth stands alone",
    "Step 4: Rebuild understanding from this foundation"
  ]
}

Respond ONLY with valid JSON, no markdown formatting.`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: 'You are an expert at first principles thinking, trained in the methods of Aristotle, Descartes, and physicists like Feynman. You break down complex ideas to their fundamental truths.' },
      { role: 'user', content: prompt },
    ], 0.4);

    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to generate first principles:', error);
    return {
      principle: 'Deconstruct to fundamental truths',
      explanation: 'Every complex idea can be broken down into basic, irreducible components that cannot be further simplified.',
      breakdown: [
        'Identify the core components of the concept',
        'Question each assumption until you reach undeniable truths',
        'Verify these truths stand independently',
        'Rebuild understanding from these foundations'
      ]
    };
  }
}

// Generate AI response to user questions
export async function generateAIResponse(
  question: string, 
  chapterTitle: string, 
  chapterContent: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  const systemPrompt = `You are an expert teaching assistant helping a student understand the chapter "${chapterTitle}". 

Your approach:
- Use the Feynman Technique: explain concepts simply as if teaching a beginner
- Ask follow-up questions to check understanding
- Provide real-world examples and analogies
- Break down complex ideas into first principles when asked
- Be encouraging and patient

Chapter content for reference: ${chapterContent.slice(0, 5000)}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: question },
  ];

  return callOpenAI(messages, 0.7);
}

// Generate chapter summary
export async function generateChapterSummary(chapterTitle: string, chapterContent: string): Promise<string> {
  const prompt = `Provide a concise 2-3 sentence summary of this chapter that captures the main ideas and why they matter.

Chapter Title: ${chapterTitle}
Chapter Content: ${chapterContent.slice(0, 6000)}`;

  return callOpenAI([
    { role: 'system', content: 'You are an expert at summarizing educational content clearly and concisely.' },
    { role: 'user', content: prompt },
  ], 0.5);
}
