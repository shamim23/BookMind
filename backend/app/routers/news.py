"""Router for news-related endpoints."""

from fastapi import APIRouter, HTTPException, Body
from typing import List

from app.models.schemas import NewsArticle, FindNewsRequest
from app.services.news_service import find_relevant_news

router = APIRouter(prefix="/news", tags=["news"])


@router.post("/find", response_model=List[NewsArticle])
async def find_news(request: FindNewsRequest):
    """Find news articles relevant to a chapter."""
    try:
        articles = find_relevant_news(
            chapter_title=request.chapter_title,
            chapter_content=request.chapter_content
        )
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
