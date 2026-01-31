"""Router for AI analysis endpoints."""

from fastapi import APIRouter, HTTPException, Body
from typing import List

from app.models.schemas import (
    GenerateInsightsRequest, Insight,
    GenerateFirstPrinciplesRequest, FirstPrinciple,
    GenerateDialecticRequest, DialecticalAnalysis,
    ChatRequest, ChatMessage,
)
from app.services.openai_service import (
    generate_insights,
    generate_first_principles,
    generate_dialectical_analysis,
    generate_ai_response,
)
from app.data import get_fallback_dialectic

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/insights", response_model=List[Insight])
async def analyze_insights(request: GenerateInsightsRequest):
    """Generate AI insights for a chapter."""
    try:
        insights = await generate_insights(
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content,
            chapter_summary=request.chapter_summary
        )
        return insights
    except ValueError as e:
        # Return fallback if API key not configured
        return [{
            "title": "Core Concept Identified",
            "summary": "The chapter presents fundamental principles that form the foundation of this subject.",
            "evidence": "Key arguments and examples throughout the text support this understanding.",
            "implication": "These principles can be applied to analyze and understand related phenomena in the real world."
        }]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/first-principles", response_model=FirstPrinciple)
async def analyze_first_principles(request: GenerateFirstPrinciplesRequest):
    """Generate first principles analysis for a concept."""
    try:
        principles = await generate_first_principles(
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content,
            concept=request.concept
        )
        return principles
    except ValueError as e:
        # Return fallback
        return {
            "principle": "Deconstruct to fundamental truths",
            "explanation": "Every complex idea can be broken down into basic, irreducible components.",
            "breakdown": [
                "Identify the core components of the concept",
                "Question each assumption until you reach undeniable truths",
                "Verify these truths stand independently",
                "Rebuild understanding from these foundations"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dialectic", response_model=DialecticalAnalysis)
async def analyze_dialectic(request: GenerateDialecticRequest):
    """Generate dialectical analysis (thesis-antithesis-synthesis)."""
    try:
        analysis = await generate_dialectical_analysis(
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content,
            book_title=request.book_title,
            author=request.author
        )
        return analysis
    except ValueError as e:
        # Return fallback analysis
        return get_fallback_dialectic(request.chapter_title, request.book_title)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=str)
async def chat_with_ai(request: ChatRequest):
    """Chat with AI about a chapter."""
    try:
        response = await generate_ai_response(
            question=request.question,
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content,
            conversation_history=[m.model_dump() for m in request.conversation_history]
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
