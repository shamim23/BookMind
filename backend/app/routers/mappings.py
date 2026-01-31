"""Router for concept mapping and evidence mapping endpoints."""

from fastapi import APIRouter, HTTPException, Body
from typing import List

from app.models.schemas import (
    ConceptMapping, ConceptAnalogy,
    EvidenceMapping,
    FindConceptMappingsRequest, GetEvidenceRequest,
)
from app.data import (
    find_concept_mappings,
    get_concepts_for_book,
    get_evidence_mapping,
)
from app.services.openai_service import generate_concept_mapping

router = APIRouter(prefix="/mappings", tags=["mappings"])


@router.post("/concepts/find", response_model=List[ConceptAnalogy])
async def find_concept_mappings_endpoint(request: FindConceptMappingsRequest):
    """Find cross-domain concept mappings."""
    try:
        # First try hardcoded mappings
        analogies = find_concept_mappings(
            concept=request.concept,
            user_book_ids=request.user_book_ids
        )
        
        # If no hardcoded mappings and we have OpenAI configured, try AI generation
        if not analogies and request.user_book_ids:
            try:
                from app.data import get_all_sample_books
                all_books = get_all_sample_books()
                target_books = [
                    {"id": b["id"], "title": b["title"], "domain": b["category"].capitalize()}
                    for b in all_books
                    if b["id"] in request.user_book_ids
                ]
                
                ai_analogies = await generate_concept_mapping(
                    source_concept=request.concept,
                    source_domain=request.source_domain,
                    source_context=request.context,
                    target_books=target_books
                )
                
                if ai_analogies:
                    return ai_analogies
            except Exception as e:
                # Fall through to return empty list
                pass
        
        return analogies
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/concepts/book/{book_id}", response_model=List[str])
async def get_book_concepts(book_id: str):
    """Get all concepts that have mappings for a specific book."""
    return get_concepts_for_book(book_id)


@router.post("/evidence", response_model=EvidenceMapping)
async def get_evidence_mapping_endpoint(request: GetEvidenceRequest):
    """Get evidence mapping for a concept."""
    mapping = get_evidence_mapping(request.concept)
    
    if not mapping:
        # Return a default structure
        return {
            "concept": request.concept,
            "sourceBookId": "unknown",
            "sourceBookTitle": request.book_title or "Unknown",
            "chapterId": "unknown",
            "historicalEvidence": [],
            "contemporaryEvidence": [],
            "edgeCases": [],
            "emergingPatterns": [],
            "dataSources": [],
            "overallAssessment": {
                "validationScore": 50,
                "confidenceLevel": "low",
                "keyInsight": "No evidence mapping available for this concept."
            }
        }
    
    return mapping
