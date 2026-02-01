"""Router for AI analysis endpoints."""

from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from sqlalchemy.orm import Session

from app.models.schemas import (
    GenerateInsightsRequest, Insight, SavedInsightResponse, InsightsListResponse,
    UpdateInsightRequest, DeleteInsightResponse,
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
from app.db import get_db
from app.db import crud

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/insights", response_model=List[Insight])
async def analyze_insights(
    request: GenerateInsightsRequest,
    db: Session = Depends(get_db)
):
    """Generate AI insights for a chapter and optionally save them."""
    try:
        # Generate insights using OpenAI
        insights_data = await generate_insights(
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content,
            chapter_summary=request.chapter_summary,
            book_title=request.book_title,
            book_author=request.book_author
        )
        
        # Save to database if requested and we have book/chapter IDs
        if request.save_to_db and request.book_id and request.chapter_id:
            # Check if we already have insights for this chapter
            existing_insights = crud.get_insights_by_chapter(db, request.chapter_id)
            
            if existing_insights:
                # Delete old insights before saving new ones
                crud.delete_insights_by_chapter(db, request.chapter_id)
            
            # Save new insights
            crud.create_insights_batch(
                db=db,
                book_id=request.book_id,
                chapter_id=request.chapter_id,
                insights_data=insights_data,
                ai_model="gpt-4o-mini"
            )
        
        # Convert to Pydantic models and return
        return [Insight(**insight) for insight in insights_data]
        
    except ValueError as e:
        # Return fallback if API key not configured
        return [{
            "title": "Core Concept Identified",
            "summary": "The chapter presents fundamental principles that form the foundation of this subject.",
            "evidence": "Key arguments and examples throughout the text support this understanding.",
            "implication": "These principles can be applied to analyze and understand related phenomena in the real world.",
            "insight_type": "pattern"
        }]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/insights/chapter/{chapter_id}", response_model=InsightsListResponse)
async def get_chapter_insights(chapter_id: str, db: Session = Depends(get_db)):
    """Get saved insights for a specific chapter."""
    insights = crud.get_insights_by_chapter(db, chapter_id)
    return InsightsListResponse(
        insights=[SavedInsightResponse.model_validate(i) for i in insights],
        total=len(insights),
        chapter_id=chapter_id
    )


@router.get("/insights/book/{book_id}", response_model=List[SavedInsightResponse])
async def get_book_insights(book_id: str, limit: int = 100, db: Session = Depends(get_db)):
    """Get all insights for a book."""
    insights = crud.get_insights_by_book(db, book_id, limit)
    return [SavedInsightResponse.model_validate(i) for i in insights]


@router.put("/insights/{insight_id}", response_model=SavedInsightResponse)
async def update_insight(
    insight_id: str,
    request: UpdateInsightRequest,
    db: Session = Depends(get_db)
):
    """Update an existing insight (user edit)."""
    update_data = request.model_dump(exclude_unset=True)
    insight = crud.update_insight(db, insight_id, **update_data)
    
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    
    return SavedInsightResponse.model_validate(insight)


@router.delete("/insights/{insight_id}", response_model=DeleteInsightResponse)
async def delete_insight(insight_id: str, db: Session = Depends(get_db)):
    """Delete an insight."""
    success = crud.delete_insight(db, insight_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Insight not found")
    
    return DeleteInsightResponse(
        success=True,
        message="Insight deleted successfully",
        deleted_id=insight_id
    )


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
