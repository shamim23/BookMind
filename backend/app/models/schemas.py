from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


# ==================== Book Models ====================

class Chapter(BaseModel):
    id: str
    number: int
    title: str
    content: str
    summary: Optional[str] = None
    keyPoints: List[str] = Field(default_factory=list)
    startIndex: int = 0
    endIndex: int = 0
    concepts: List[str] = Field(default_factory=list)


class Concept(BaseModel):
    id: str
    name: str
    description: str
    occurrences: int = 0
    relatedConcepts: List[str] = Field(default_factory=list)
    chapterIds: List[str] = Field(default_factory=list)


class Book(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    content: str
    chapters: List[Chapter] = Field(default_factory=list)
    concepts: List[Concept] = Field(default_factory=list)
    uploadedAt: datetime = Field(default_factory=datetime.now)
    totalPages: int = 0
    category: Optional[str] = None


# ==================== AI Analysis Models ====================

class Insight(BaseModel):
    id: Optional[str] = None
    title: str
    summary: str
    evidence: str
    implication: str
    insight_type: str = "pattern"  # pattern, causal, distinction, counter_intuitive, framework
    created_at: Optional[datetime] = None
    is_ai_generated: bool = True


class FirstPrinciple(BaseModel):
    principle: str
    explanation: str
    breakdown: List[str]


# ==================== Dialectic Models ====================

class CriticView(BaseModel):
    thinker: str
    era: str
    critique: str
    keyWork: Optional[str] = None


class DebatePoint(BaseModel):
    topic: str
    modernContext: str
    currentRelevance: str


class Implication(BaseModel):
    domain: str
    consequence: str
    severity: Literal["high", "medium", "low"]


class RealWorldCase(BaseModel):
    example: str
    supports: Literal["thesis", "critics", "nuanced"]
    description: str
    year: Optional[str] = None


class DialecticalAnalysis(BaseModel):
    thesis: dict
    antithesis: dict
    synthesis: dict
    implications: dict


# ==================== Concept Mapping Models ====================

class ConceptAnalogy(BaseModel):
    id: str
    targetConcept: str
    targetDomain: str
    targetBookId: str
    targetBookTitle: str
    targetChapterId: Optional[str] = None
    targetChapterTitle: Optional[str] = None
    structuralSimilarity: str
    keyDifferences: str
    relevanceScore: int = Field(ge=0, le=100)


class ConceptMapping(BaseModel):
    sourceConcept: str
    sourceDomain: str
    sourceBookId: str
    sourceBookTitle: str
    analogies: List[ConceptAnalogy]


# ==================== Evidence Mapping Models ====================

class HistoricalCase(BaseModel):
    id: str
    period: str
    event: str
    description: str
    outcome: Literal["validates", "contradicts", "nuanced"]
    evidenceStrength: Literal["strong", "moderate", "weak"]
    details: str
    sources: List[str]


class ContemporaryCase(BaseModel):
    id: str
    year: str
    event: str
    description: str
    supportingData: Optional[str] = None
    outcome: Literal["supports", "contradicts", "evolving", "nuanced"]
    sources: List[str]


class EdgeCase(BaseModel):
    id: str
    scenario: str
    description: str
    whyItBreaks: str
    modernRelevance: str


class EmergingPattern(BaseModel):
    id: str
    trend: str
    description: str
    impactOnPrinciple: str
    timeframe: Literal["now", "5-years", "10-years"]


class DataSource(BaseModel):
    name: str
    type: Literal["academic", "news", "data", "industry"]
    url: Optional[str] = None
    relevance: str


class EvidenceMapping(BaseModel):
    concept: str
    sourceBookId: str
    sourceBookTitle: str
    chapterId: str
    historicalEvidence: List[HistoricalCase]
    contemporaryEvidence: List[ContemporaryCase]
    edgeCases: List[EdgeCase]
    emergingPatterns: List[EmergingPattern]
    dataSources: List[DataSource]
    overallAssessment: dict


# ==================== News Models ====================

class NewsArticle(BaseModel):
    title: str
    description: str
    date: str
    connection: str
    url: str
    source: str


# ==================== Chat Models ====================

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    question: str
    chapter_title: str
    chapter_content: str
    conversation_history: List[ChatMessage] = Field(default_factory=list)


# ==================== Request/Response Models ====================

class GenerateInsightsRequest(BaseModel):
    chapter_title: str
    chapter_content: str
    chapter_summary: str = ""
    book_title: str = ""
    book_author: str = ""
    book_id: Optional[str] = None  # For saving to DB
    chapter_id: Optional[str] = None  # For saving to DB
    save_to_db: bool = True  # Whether to save the generated insights


class GenerateFirstPrinciplesRequest(BaseModel):
    chapter_title: str
    chapter_content: str
    concept: str


class GenerateDialecticRequest(BaseModel):
    chapter_title: str
    chapter_content: str
    book_title: str
    author: str = "Unknown"


class FindConceptMappingsRequest(BaseModel):
    concept: str
    source_book_id: str
    source_domain: str
    user_book_ids: List[str] = Field(default_factory=list)


class GetEvidenceRequest(BaseModel):
    concept: str
    book_title: str = ""
    context: str = ""


class FindNewsRequest(BaseModel):
    chapter_title: str
    chapter_content: str


# ==================== Insight Storage Models ====================

class SavedInsightResponse(BaseModel):
    """Response model for a saved insight."""
    id: str
    book_id: str
    chapter_id: str
    title: str
    summary: str
    evidence: str
    implication: str
    insight_type: str
    ai_model: Optional[str] = None
    created_at: datetime
    is_ai_generated: bool
    
    class Config:
        from_attributes = True


class InsightsListResponse(BaseModel):
    """Response for listing insights."""
    insights: List[SavedInsightResponse]
    total: int
    chapter_id: str


class UpdateInsightRequest(BaseModel):
    """Request to update an insight."""
    title: Optional[str] = None
    summary: Optional[str] = None
    evidence: Optional[str] = None
    implication: Optional[str] = None
    insight_type: Optional[str] = None


class DeleteInsightResponse(BaseModel):
    """Response after deleting an insight."""
    success: bool
    message: str
    deleted_id: Optional[str] = None


# ==================== Sample Book Models ====================

class SampleBook(BaseModel):
    id: str
    title: str
    author: str
    category: str
    description: str
    coverColor: str
    content: str
    estimatedReadTime: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
