# BookMind AI - Action Plan

> **Goal**: Transition from hardcoded data to full AI-powered features, building them one by one.

---

## Current State Summary

### What's Working ✅
- React frontend with TypeScript, Tailwind, shadcn/ui
- FastAPI backend with OpenAI integration
- Book upload (PDF/EPUB/TXT) and text extraction
- Sample books library (4 books)
- Backend AI endpoints ready (insights, first principles, dialectic, chat)
- Hardcoded concept mappings (15 concepts → 24 analogies)
- Hardcoded evidence mappings (3 concepts)
- Hardcoded news articles (5 articles)

### What's Hardcoded ⚠️
1. **Frontend services still use legacy code** instead of `api.ts`
   - `AnalyzeBookPage.tsx` imports from `openai.ts`, `dialectic.ts`, `newsApi.ts`
   - `CrossDomainMapping.tsx` imports from `conceptMapping.ts`
   - `EvidenceMapping.tsx` imports from `evidenceMapping.ts`

2. **News is completely hardcoded** (no real API calls)

3. **Concept mappings only work for 15 pre-defined concepts**
   - No AI generation fallback implemented in frontend

4. **Evidence mappings only work for 3 concepts**
   - No AI generation implemented

5. **No user system** - books/progress not persisted

---

## Phase 1: Frontend-Backend API Integration 🔄 PRIORITY

**Goal**: Make frontend use the backend API instead of hardcoded data.

### 1.1 Update AnalyzeBookPage.tsx
**Effort**: ~2 hours
**Files**: `src/pages/AnalyzeBookPage.tsx`

```typescript
// CURRENT (hardcoded):
import { generateInsights, generateFirstPrinciples, generateAIResponse } from '@/services/openai';
import { findRelevantNews } from '@/services/newsApi';
import { generateDialecticalAnalysis } from '@/services/dialectic';

// CHANGE TO (backend API):
import { 
  generateInsights, 
  generateFirstPrinciples, 
  generateAIResponse,
  generateDialecticalAnalysis,
  findRelevantNews 
} from '@/services/api';
```

**Steps**:
1. Update imports to use `api.ts`
2. Test each AI feature:
   - Insights generation
   - First principles
   - Dialectic analysis
   - AI chat
   - News
3. Ensure error handling works (fallbacks already in backend)

### 1.2 Update CrossDomainMapping Component
**Effort**: ~2 hours
**Files**: `src/components/CrossDomainMapping.tsx`, `backend/app/routers/mappings.py`

**Current Problem**: Component uses `findConceptMappings` from `conceptMapping.ts` (hardcoded)

**Solution**:
1. Update component to use `findConceptMappings` from `api.ts`
2. Backend already has AI fallback in `mappings.py` - verify it works
3. Remove hardcoded `userBookIds` filtering in frontend, let backend handle it

### 1.3 Update EvidenceMapping Component
**Effort**: ~2 hours
**Files**: `src/components/EvidenceMapping.tsx`, `backend/app/services/openai_service.py`

**Current Problem**: Component uses `getEvidenceMapping` from `evidenceMapping.ts` (hardcoded)

**Solution**:
1. Update component to use `getEvidenceMapping` from `api.ts`
2. Add AI evidence generation to `openai_service.py`:
   ```python
   async def generate_evidence_mapping(concept: str, context: str) -> dict:
       """Generate evidence mapping using AI for unknown concepts."""
       # Use OpenAI to generate historical/contemporary evidence
   ```
3. Update `/mappings/evidence` endpoint to call AI generation when no hardcoded data

### 1.4 Clean Up Legacy Services
**Effort**: ~30 minutes
**Files**: `src/services/openai.ts`, `src/services/dialectic.ts`, `src/services/conceptMapping.ts`, `src/services/evidenceMapping.ts`, `src/services/newsApi.ts`

**Action**: Move legacy files to `src/services/legacy/` folder (don't delete yet, just archive)

---

## Phase 2: Real News API Integration 📰

**Goal**: Replace hardcoded news with real NewsAPI or similar service.

### 2.1 Integrate Real News API
**Effort**: ~3 hours
**Files**: `backend/app/services/news_service.py`, `backend/app/routers/news.py`

**Options**:
1. **NewsAPI.org** (free tier: 100 requests/day)
2. **TheNewsAPI** (free tier: 10,000 requests/month)
3. **GDELT Project** (free, academic)

**Implementation**:
```python
async def fetch_real_news(query: str, from_date: str = None) -> list[dict]:
    """Fetch real news from NewsAPI."""
    # Call NewsAPI with chapter keywords
    # Filter and rank by relevance
    # Return formatted articles
```

**Steps**:
1. Sign up for NewsAPI free tier
2. Update `news_service.py` to call real API
3. Add caching (Redis or in-memory) to avoid hitting rate limits
4. Update connection generation to use LLM:
   - Send article + chapter to OpenAI
   - Generate "connection" text explaining relevance

---

## Phase 3: Vector Database & Semantic Search 🔍

**Goal**: Enable semantic search, similarity matching, and dynamic concept mapping.

### 3.1 Set Up Vector Database
**Effort**: ~4 hours
**Files**: New `backend/app/db/` folder

**Tech Options**:
- **ChromaDB** (easiest, local/embedded)
- **Pinecone** (managed, scalable)
- **Weaviate** (open source, docker)
- **Qdrant** (fast, Rust-based)

**Recommendation**: Start with ChromaDB (can migrate later)

```python
# backend/app/db/vector_store.py
import chromadb

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_db")
        
    async def add_book(self, book_id: str, chunks: list[dict]):
        """Add book chunks with embeddings."""
        
    async def search_similar(self, query: str, book_ids: list[str] = None) -> list[dict]:
        """Semantic search across books."""
        
    async def find_concept_analogies(self, concept: str, domain: str) -> list[dict]:
        """Find structurally similar concepts across books."""
```

### 3.2 Generate Embeddings Pipeline
**Effort**: ~3 hours
**Files**: `backend/app/services/embedding_service.py`

**Implementation**:
```python
from openai import AsyncOpenAI

async def generate_embedding(text: str) -> list[float]:
    """Generate OpenAI text-embedding-3-small embedding."""
    
async def chunk_book(content: str, chunk_size: int = 1000) -> list[dict]:
    """Split book into semantic chunks with overlap."""
    
async def process_uploaded_book(book_id: str, content: str):
    """Chunk, embed, and store book."""
```

### 3.3 Semantic Concept Mapping
**Effort**: ~4 hours
**Files**: Update `backend/app/routers/mappings.py`

**New Feature**: Dynamic concept mapping using vector similarity
```python
@router.post("/concepts/semantic-find")
async def find_semantic_concept_mappings(request: SemanticMappingRequest):
    """Find concept mappings using vector similarity + AI."""
    # 1. Get embedding for source concept
    # 2. Search vector DB for similar concepts in other books
    # 3. Use LLM to verify structural similarity (not just keyword)
    # 4. Return ranked analogies
```

### 3.4 Evidence Mapping with Web Search
**Effort**: ~4 hours
**Files**: `backend/app/services/evidence_service.py`

**New Feature**: Real evidence gathering
```python
async def gather_evidence(concept: str) -> dict:
    """Gather real historical and contemporary evidence."""
    # Use web search API (SerpAPI, Tavily, or Perplexity)
    # Find historical cases, modern studies, edge cases
    # Use LLM to structure into evidence mapping format
```

---

## Phase 4: User System & Database 👤

**Goal**: Add users, saved books, reading progress, and notes.

### 4.1 Set Up Database
**Effort**: ~3 hours
**Files**: New `backend/app/db/` folder

**Tech**: PostgreSQL + SQLAlchemy (or Supabase for managed)

**Schema**:
```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Books
CREATE TABLE user_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    book_id VARCHAR(255), -- can be sample id or custom
    title VARCHAR(500),
    author VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reading Progress
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    book_id VARCHAR(255),
    chapter_number INTEGER,
    progress_percent INTEGER DEFAULT 0,
    last_read_at TIMESTAMP DEFAULT NOW()
);

-- Notes & Highlights
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    book_id VARCHAR(255),
    chapter_number INTEGER,
    content TEXT,
    highlight_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Authentication System
**Effort**: ~4 hours
**Files**: `backend/app/routers/auth.py`, `backend/app/core/security.py`

**Implementation**:
- JWT tokens
- Password hashing with bcrypt
- OAuth (Google/Apple) optional
- Protected routes

### 4.3 Update Frontend for Auth
**Effort**: ~3 hours
**Files**: New `src/contexts/AuthContext.tsx`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`

**Features**:
- Login/signup forms
- Auth context provider
- Protected routes
- Token management (localStorage or httpOnly cookies)

---

## Phase 5: Real-time Features & Polish ✨

**Goal**: Add streaming, caching, and performance improvements.

### 5.1 Streaming AI Responses
**Effort**: ~3 hours
**Files**: `backend/app/services/openai_service.py`, `src/services/api.ts`

**Implementation**:
```python
async def stream_ai_response(messages: list) -> AsyncIterator[str]:
    """Stream OpenAI response chunks."""
    # Use openai.chat.completions.create with stream=True
```

```typescript
// Frontend
const eventSource = new EventSource(`/api/chat/stream?question=${encodeURIComponent(question)}`);
eventSource.onmessage = (event) => {
  const chunk = JSON.parse(event.data);
  appendToChat(chunk.content);
};
```

### 5.2 Redis Caching
**Effort**: ~3 hours
**Files**: `backend/app/core/cache.py`

**Cache**:
- AI analysis results (TTL: 24 hours)
- News articles (TTL: 1 hour)
- Concept mappings (TTL: 7 days)
- Book embeddings (persistent)

### 5.3 Background Jobs
**Effort**: ~4 hours
**Files**: New `backend/app/worker/` with Celery or RQ

**Background Tasks**:
- Process uploaded books (chunk + embed)
- Generate AI analysis for all chapters
- Fetch and cache news

---

## Implementation Order Recommendation

### Week 1: Foundation
1. **Day 1-2**: Phase 1.1 - Update AnalyzeBookPage to use backend API
2. **Day 3**: Phase 1.2 - Update CrossDomainMapping
3. **Day 4**: Phase 1.3 - Update EvidenceMapping with AI generation
4. **Day 5**: Phase 1.4 - Clean up, test, fix bugs

### Week 2: Real Data
5. **Day 1-2**: Phase 2 - Integrate real NewsAPI
6. **Day 3-5**: Phase 3.1 & 3.2 - Vector DB setup and embeddings

### Week 3: Intelligence
7. **Day 1-2**: Phase 3.3 - Semantic concept mapping
8. **Day 3-4**: Phase 3.4 - Evidence mapping with web search
9. **Day 5**: Buffer/testing

### Week 4: Users & Persistence
10. **Day 1-2**: Phase 4.1 - Database setup
11. **Day 3**: Phase 4.2 - Backend auth
12. **Day 4-5**: Phase 4.3 - Frontend auth

### Week 5: Polish
13. **Day 1-2**: Phase 5.1 - Streaming responses
14. **Day 3**: Phase 5.2 - Caching
15. **Day 4-5**: Testing, bug fixes, documentation

---

## Quick Wins (Do These First! 🚀)

These can be done in a single session (~4 hours) for immediate impact:

1. **Update imports in AnalyzeBookPage.tsx** - Switch to `api.ts` ✅ Biggest impact
2. **Add AI evidence generation** - Even simple prompt will work better than "not available"
3. **Connect NewsAPI** - Free tier is enough for demo
4. **Add loading states** - Better UX while AI generates

---

## Cost Estimates

### Development (Free Tier)
- **OpenAI API**: $5-20/month for testing
- **NewsAPI**: Free tier (100 req/day)
- **Vector DB**: ChromaDB (free, local)
- **Database**: SQLite for dev (free)

### Production (Estimated)
- **OpenAI API**: $50-200/month (depends on usage)
- **NewsAPI**: $10-50/month
- **Vector DB**: Pinecone free tier or $20-70/month
- **Database**: Supabase free tier or $25/month
- **Hosting**: Vercel + Railway/Fly.io ~$20-50/month

**Total**: ~$100-400/month for production with moderate usage

---

## Key Decisions Needed

1. **Vector DB**: ChromaDB (easiest) vs Pinecone (scalable)?
2. **News Source**: NewsAPI (simple) vs custom scraping?
3. **Database**: SQLite (simple) vs PostgreSQL (robust)?
4. **Auth**: Simple JWT (fast) vs OAuth (better UX)?
5. **Deployment**: Self-hosted vs managed services?

---

## Success Metrics

- [ ] All AI features work with real API calls (no hardcoded data)
- [ ] News shows real articles from the past 30 days
- [ ] Concept mappings work for any concept (not just 15 pre-defined)
- [ ] Evidence mapping shows real historical/contemporary cases
- [ ] Users can sign up, save books, and track progress
- [ ] Page loads in < 2 seconds
- [ ] AI responses stream in real-time

---

*Last Updated: 2026-01-31*
*Next Review: After Phase 1 completion*
