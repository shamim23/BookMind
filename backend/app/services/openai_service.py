"""OpenAI API Service for generating insights, first principles, and analysis."""

import httpx
import json
from typing import List, Optional
from app.core.config import get_settings

settings = get_settings()

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


async def call_openai(
    messages: list[dict],
    temperature: float = 0.7,
    max_tokens: int = 2000,
    model: str = "gpt-4o-mini"
) -> str:
    """Make a call to the OpenAI API."""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            OPENAI_API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
            timeout=60.0,
        )
        
        if not response.is_success:
            error_data = response.json()
            raise Exception(error_data.get("error", {}).get("message", "OpenAI API error"))
        
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def generate_insights(
    chapter_title: str,
    chapter_content: str,
    chapter_summary: str = ""
) -> List[dict]:
    """Generate 3-5 critical insights from chapter content."""
    prompt = f"""Extract the 3-5 most critical insights from this chapter. 

Chapter Title: {chapter_title}
Chapter Summary: {chapter_summary}
Chapter Content: {chapter_content[:8000]}

For each insight, provide in this exact JSON format:
{{
  "insights": [
    {{
      "title": "Short, punchy title (5-8 words)",
      "summary": "One-sentence summary of the insight",
      "evidence": "Specific evidence from the text supporting this insight (1-2 sentences)",
      "implication": "One real-world implication or application of this insight"
    }}
  ]
}}

Focus on insights that are:
- Counterintuitive or surprising
- Fundamentally important to understanding the topic
- Have practical applications

Respond ONLY with valid JSON, no markdown formatting."""

    try:
        response = await call_openai(
            messages=[
                {"role": "system", "content": "You are an expert at extracting deep insights from educational content. You respond only with valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
        )
        
        # Clean up the response to ensure valid JSON
        cleaned = response.replace("```json\n", "").replace("\n```", "").replace("```", "").strip()
        parsed = json.loads(cleaned)
        return parsed.get("insights", [])
    except Exception as e:
        print(f"Failed to generate insights: {e}")
        # Return fallback insight
        return [{
            "title": "Core Concept Identified",
            "summary": "The chapter presents fundamental principles that form the foundation of this subject.",
            "evidence": "Key arguments and examples throughout the text support this understanding.",
            "implication": "These principles can be applied to analyze and understand related phenomena in the real world."
        }]


async def generate_first_principles(
    chapter_title: str,
    chapter_content: str,
    concept: str
) -> dict:
    """Break down a concept into first principles."""
    prompt = f"""Break down the concept "{concept}" from the chapter "{chapter_title}" into first principles.

Chapter Content: {chapter_content[:6000]}

A first principle is a fundamental truth that cannot be deduced from any other assumption within the system. 

Provide your response in this exact JSON format:
{{
  "principle": "The core first principle statement (one sentence)",
  "explanation": "A clear explanation of what this principle means and why it's fundamental (2-3 sentences)",
  "breakdown": [
    "Step 1: Identify and question the most basic assumption",
    "Step 2: Find the irreducible truth beneath it", 
    "Step 3: Verify this truth stands alone",
    "Step 4: Rebuild understanding from this foundation"
  ]
}}

Respond ONLY with valid JSON, no markdown formatting."""

    try:
        response = await call_openai(
            messages=[
                {"role": "system", "content": "You are an expert at first principles thinking, trained in the methods of Aristotle, Descartes, and physicists like Feynman. You break down complex ideas to their fundamental truths."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
        )
        
        cleaned = response.replace("```json\n", "").replace("\n```", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        print(f"Failed to generate first principles: {e}")
        return {
            "principle": "Deconstruct to fundamental truths",
            "explanation": "Every complex idea can be broken down into basic, irreducible components that cannot be further simplified.",
            "breakdown": [
                "Identify the core components of the concept",
                "Question each assumption until you reach undeniable truths",
                "Verify these truths stand independently",
                "Rebuild understanding from these foundations"
            ]
        }


async def generate_ai_response(
    question: str,
    chapter_title: str,
    chapter_content: str,
    conversation_history: List[dict] = None
) -> str:
    """Generate AI response to user questions."""
    if conversation_history is None:
        conversation_history = []
    
    system_prompt = f"""You are an expert teaching assistant helping a student understand the chapter "{chapter_title}". 

Your approach:
- Use the Feynman Technique: explain concepts simply as if teaching a beginner
- Ask follow-up questions to check understanding
- Provide real-world examples and analogies
- Break down complex ideas into first principles when asked
- Be encouraging and patient

Chapter content for reference: {chapter_content[:5000]}"""

    messages = [
        {"role": "system", "content": system_prompt},
        *conversation_history,
        {"role": "user", "content": question},
    ]

    try:
        return await call_openai(messages, temperature=0.7)
    except Exception as e:
        print(f"Failed to generate AI response: {e}")
        return "I apologize, but I'm having trouble processing your question right now. Please try again."


async def generate_chapter_summary(chapter_title: str, chapter_content: str) -> str:
    """Generate a concise chapter summary."""
    prompt = f"""Provide a concise 2-3 sentence summary of this chapter that captures the main ideas and why they matter.

Chapter Title: {chapter_title}
Chapter Content: {chapter_content[:6000]}"""

    try:
        return await call_openai(
            messages=[
                {"role": "system", "content": "You are an expert at summarizing educational content clearly and concisely."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=300,
        )
    except Exception as e:
        print(f"Failed to generate summary: {e}")
        return "This chapter covers key concepts and ideas that form the foundation of the subject matter."


async def generate_dialectical_analysis(
    chapter_title: str,
    chapter_content: str,
    book_title: str,
    author: str = "Unknown"
) -> dict:
    """Generate dialectical analysis (thesis-antithesis-synthesis)."""
    prompt = f"""Analyze the provided chapter content through the lens of thesis-antithesis-synthesis.

Book: "{book_title}" by {author}
Chapter: "{chapter_title}"

Chapter Content:
{chapter_content[:8000]}

Your task is to:
1. Identify the core thesis/argument the author is making
2. Find historical and modern counter-arguments (antithesis)
3. Synthesize a nuanced position that acknowledges both sides
4. Explore real-world implications of each position

Respond in JSON format with this structure:
{{
  "thesis": {{
    "statement": "Clear statement of author's main argument",
    "keyArguments": ["supporting point 1", "supporting point 2", "supporting point 3"],
    "evidenceFromText": "Specific evidence from the chapter"
  }},
  "antithesis": {{
    "historicalCritics": [
      {{ "thinker": "Name", "era": "Time period", "critique": "Their counter-argument", "keyWork": "Famous work" }}
    ],
    "modernCritics": [
      {{ "thinker": "Name", "era": "Modern", "critique": "Contemporary critique", "keyWork": "Recent work" }}
    ],
    "contemporaryDebates": [
      {{ "topic": "Debate subject", "modernContext": "Current situation", "currentRelevance": "Why it matters now" }}
    ]
  }},
  "synthesis": {{
    "nuancedPosition": "Balanced view acknowledging complexity",
    "conditionsWhereThesisHolds": ["Condition 1", "Condition 2"],
    "conditionsWhereCriticsAreRight": ["Condition 1", "Condition 2"],
    "modernPerspective": "How we should view this today"
  }},
  "implications": {{
    "ifThesisTrue": [
      {{ "domain": "Area affected", "consequence": "What happens", "severity": "high/medium/low" }}
    ],
    "ifCriticsRight": [
      {{ "domain": "Area affected", "consequence": "What happens", "severity": "high/medium/low" }}
    ],
    "realWorldExamples": [
      {{ "example": "Case name", "supports": "thesis/critics/nuanced", "description": "What happened", "year": "Year" }}
    ]
  }}
}}"""

    try:
        response = await call_openai(
            messages=[
                {"role": "system", "content": "You are a dialectical reasoning engine. Analyze arguments through thesis-antithesis-synthesis framework."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2500,
        )
        
        # Extract JSON from response
        cleaned = response.replace("```json\n", "").replace("\n```", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        print(f"Failed to generate dialectical analysis: {e}")
        from app.data.dialectic_fallbacks import get_fallback_dialectic
        return get_fallback_dialectic(chapter_title, book_title)


async def generate_concept_mapping(
    source_concept: str,
    source_domain: str,
    source_context: str,
    target_books: list[dict]
) -> List[dict]:
    """Generate cross-domain concept mappings using AI."""
    if not target_books:
        return []
    
    prompt = f"""Source Concept: "{source_concept}" from {source_domain}
Context: {source_context}

Find structural analogies in these books:
{chr(10).join(f"- {b['title']} ({b['domain']})" for b in target_books)}

Generate 2-3 cross-domain analogies in this JSON format:
[
  {{
    "targetConcept": "Name of analogous concept",
    "targetDomain": "Domain (Biology, Physics, Economics, etc.)",
    "targetBookId": "book-id",
    "targetBookTitle": "Book title",
    "structuralSimilarity": "Detailed explanation of why these concepts are structurally similar",
    "keyDifferences": "Important distinctions between the concepts",
    "relevanceScore": 85
  }}
]"""

    try:
        response = await call_openai(
            messages=[
                {"role": "system", "content": "You are a cross-domain concept mapper. Find structural similarities between concepts from different domains based on underlying patterns, not just keywords."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        
        # Extract JSON array
        import re
        json_match = re.search(r'\[[\s\S]*\]', response)
        if json_match:
            analogies = json.loads(json_match.group())
            # Add IDs
            for i, analogy in enumerate(analogies):
                analogy["id"] = f"ai-map-{i}"
            return analogies
        return []
    except Exception as e:
        print(f"Failed to generate concept mapping: {e}")
        return []
