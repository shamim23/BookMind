# BookMind AI - Project Context

> **For AI Assistant Reference** - This file contains the current state and architecture of the project.

## Project Overview

**BookMind AI** is an AI-powered book learning platform that helps users understand complex books through:
- AI-generated insights and summaries
- First principles analysis
- Dialectical reasoning (thesis-antithesis-synthesis)
- Cross-domain concept mapping
- Evidence mapping (historical & contemporary)
- AI chat for asking questions

## Architecture

The project uses a **React + FastAPI** architecture:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React Frontend │─────▶│   FastAPI        │─────▶│   OpenAI API    │
│   (Vite + TS)    │◄─────│   (Python)       │◄─────│   (Optional)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │   Hardcoded      │
                         │   Data (Python)  │
                         └──────────────────┘
```

### Frontend (React + TypeScript)
- **Location**: `/src/`
- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Router**: React Router (HashRouter)
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend (FastAPI + Python)
- **Location**: `/backend/`
- **Framework**: FastAPI
- **Python Version**: 3.9+
- **Key Dependencies**: 
  - `fastapi`, `uvicorn` - Web framework
  - `httpx` - HTTP client for OpenAI API
  - `PyPDF2`, `ebooklib` - File processing
  - `pydantic` - Data validation

## Project Structure

```
/Users/shamim/Documents/Tech/Apps/Education/app/
├── src/                           # React Frontend
│   ├── sections/                  # Page sections
│   │   ├── Hero.tsx
│   │   ├── BookUpload.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── FloatingDock.tsx
│   ├── pages/                     # Page components
│   │   ├── LibraryPage.tsx
│   │   ├── AnalyzeBookPage.tsx    # UPDATED: Now uses DB, saves insights!
│   │   ├── PowerReaderPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── KnowledgeGraphPage.tsx
│   │   └── OnboardingPage.tsx
│   ├── components/                # Shared components
│   │   └── ui/                    # shadcn/ui components
│   ├── services/                  # API clients
│   │   ├── api.ts                 # NEW: Backend API client
│   │   ├── openai.ts              # OLD: Frontend OpenAI (legacy)
│   │   ├── conceptMapping.ts      # OLD: Hardcoded data (legacy)
│   │   ├── dialectic.ts           # OLD: Hardcoded data (legacy)
│   │   ├── evidenceMapping.ts     # OLD: Hardcoded data (legacy)
│   │   └── newsApi.ts             # OLD: News service (legacy)
│   ├── data/                      # Frontend data
│   │   └── sampleBooks.ts         # Sample book data
│   ├── hooks/                     # Custom hooks
│   │   ├── useBookProcessor.ts
│   │   └── useFileUpload.ts
│   ├── types/                     # TypeScript types
│   │   └── index.ts
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
│
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py          # Settings & env vars
│   │   ├── data/                  # Hardcoded data (migrated from frontend)
│   │   │   ├── __init__.py
│   │   │   ├── concept_mappings.py    # Cross-domain analogies
│   │   │   ├── dialectic_fallbacks.py # Dialectic analyses
│   │   │   ├── evidence_mappings.py   # Evidence data
│   │   │   └── sample_books.py        # Sample books
│   │   ├── db/                    # NEW: Database layer
│   │   │   ├── __init__.py
│   │   │   ├── database.py        # SQLAlchemy engine & session
│   │   │   ├── models.py          # SQLAlchemy models (Book, Chapter, Insight)
│   │   │   └── crud.py            # CRUD operations
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py         # Pydantic models
│   │   ├── routers/               # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── books.py           # Book upload & sample books
│   │   │   ├── analysis.py        # AI analysis endpoints (NOW SAVES TO DB!)
│   │   │   ├── mappings.py        # Concept & evidence mappings
│   │   │   └── news.py            # News endpoints
│   │   ├── services/              # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── openai_service.py  # OpenAI integration
│   │   │   ├── file_service.py    # PDF/EPUB/TXT processing
│   │   │   └── news_service.py    # News matching
│   │   └── main.py                # FastAPI app entry
│   ├── data/                      # NEW: SQLite database storage
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Backend env template
│   ├── run.py                     # Run from project root
│   ├── run_direct.py              # Run from backend dir
│   ├── init_db.py                 # NEW: Initialize database
│   └── README.md                  # Backend docs
│
├── index.html                     # HTML entry
├── package.json                   # Node dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind config
├── vite.config.ts                 # Vite config
├── .env.example                   # Frontend env template
├── start-dev.sh                   # macOS/Linux startup script
├── start-dev.bat                  # Windows startup script
├── README.md                      # Project docs
└── CONTEXT.md                     # This file
```

## Key Features & Implementation Status

### ✅ Implemented (Frontend + Backend)

1. **Book Upload & Processing**
   - PDF, EPUB, TXT file upload
   - Text extraction
   - Chapter detection
   - Concept extraction

2. **Sample Library**
   - 4 sample books (Physics, Philosophy, Economics, Psychology)
   - Pre-processed content

3. **AI Analysis** (Backend API)
   - `POST /analysis/insights` - Generate chapter insights (SAVED TO DB!)
   - `GET /analysis/insights/chapter/{id}` - Retrieve saved insights
   - `POST /analysis/first-principles` - First principles breakdown
   - `POST /analysis/dialectic` - Thesis-antithesis-synthesis
   - `POST /analysis/chat` - AI Q&A
   
4. **Database Persistence** (NEW!)
   - Books synced to database with chapters
   - Insights automatically saved when generated
   - Retrieve saved insights on chapter reload (no regeneration!)

4. **Cross-Domain Concept Mapping**
   - Hardcoded mappings for key concepts
   - AI-generated mappings (fallback)

5. **Evidence Mapping**
   - Historical evidence cases
   - Contemporary evidence
   - Edge cases
   - Emerging patterns

6. **News Integration**
   - Hardcoded news articles with relevance matching

### 🔄 Migration Status

| Component | Frontend | Backend | Notes |
|-----------|----------|---------|-------|
| Hardcoded data | ✅ (legacy) | ✅ (active) | Data migrated to Python |
| OpenAI calls | ✅ (legacy) | ✅ (active) | API key now in backend |
| File processing | ✅ | ✅ | Backend handles PDF/EPUB/TXT |
| API client | ✅ NEW | N/A | `src/services/api.ts` |
| Database | ✅ | ✅ | SQLite with SQLAlchemy |
| Insights Persistence | ✅ | ✅ | Auto-save to DB |

### ⚠️ Legacy Code (Still in Frontend)

These files still exist in frontend but are superseded by backend:
- `src/services/openai.ts` - Use `api.ts` instead
- `src/services/conceptMapping.ts` - Use backend `/mappings/concepts`
- `src/services/dialectic.ts` - Use backend `/analysis/dialectic`
- `src/services/evidenceMapping.ts` - Use backend `/mappings/evidence`
- `src/services/newsApi.ts` - Use backend `/news/find`

### 🗄️ Database (NEW!)

SQLite database for persisting books, chapters, and AI insights.

**Models:**
- `Book` - Book metadata and content
- `Chapter` - Chapter content and summaries
- `Insight` - AI-generated insights (saved per chapter)
- `UserBook` - User reading progress (placeholder for auth)
- `Note` - User notes and highlights (placeholder for auth)

**Key Features:**
- Insights are automatically saved when generated (`save_to_db: true`)
- Retrieve saved insights: `GET /analysis/insights/chapter/{id}`
- Update insights: `PUT /analysis/insights/{id}` (marks as user-edited)
- Delete insights: `DELETE /analysis/insights/{id}`

**Initialize Database:**
```bash
cd /Users/shamim/Documents/Tech/Apps/Education/app/backend
python init_db.py
```

## Environment Setup

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000  # Backend URL
VITE_OPENAI_API_KEY=...             # Legacy, prefer backend
VITE_NEWS_API_KEY=...               # Legacy, prefer backend
```

### Backend (backend/.env)
```env
OPENAI_API_KEY=sk-...              # Required for AI features
NEWS_API_KEY=...                   # Optional
FRONTEND_URL=http://localhost:5173 # CORS
DEBUG=False
```

## How to Run

### Option 1: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd /Users/shamim/Documents/Tech/Apps/Education/app/backend
source venv/bin/activate
python run_direct.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/shamim/Documents/Tech/Apps/Education/app
npm run dev
```

### Option 2: Startup Scripts

**macOS/Linux:**
```bash
./start-dev.sh
```

**Windows:**
```batch
start-dev.bat
```

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| **Books** |||
| `/books/sample` | GET | List sample books |
| `/books/sample/{id}` | GET | Get specific sample book |
| `/books/sample/sync/{id}` | POST | Sync sample book to DB |
| `/books/{id}` | GET | Get book from database |
| `/books/{id}/chapters` | GET | Get book chapters |
| `/books/categories` | GET | List categories |
| `/books/upload` | POST | Upload book file |
| **Analysis** |||
| `/analysis/insights` | POST | Generate & save insights |
| `/analysis/insights/chapter/{id}` | GET | Get saved chapter insights |
| `/analysis/insights/book/{id}` | GET | Get saved book insights |
| `/analysis/insights/{id}` | PUT | Update insight |
| `/analysis/insights/{id}` | DELETE | Delete insight |
| `/analysis/first-principles` | POST | First principles |
| `/analysis/dialectic` | POST | Dialectical analysis |
| `/analysis/chat` | POST | AI chat |
| **Mappings** |||
| `/mappings/concepts/find` | POST | Find concept mappings |
| `/mappings/concepts/book/{id}` | GET | Get book concepts |
| `/mappings/evidence` | POST | Get evidence mapping |
| **News** |||
| `/news/find` | POST | Find relevant news |

## Data Migrated to Backend

### Concept Mappings
- `invisible hand` → ant colonies, distributed consensus, organic cities, crypto
- `division of labor` → cellular specialization, modular software, insect castes
- `natural selection` → market competition, meme propagation, tech evolution
- `entropy` → organizational decay, info overload, software rot
- `system 1` → reflex arc, cache memory, muscle memory
- `cogito ergo sum` → self-awareness loop, metacognition
- `gene` → meme, algorithm
- `first principles` → root cause analysis, axiomatic systems
- `emergence` → spontaneous order, swarm intelligence

### Dialectic Fallbacks
- Division of Labor (Wealth of Nations)
- Thinking Fast and Slow
- Generic fallback for other books

### Evidence Mappings
- `division of labor` - 5 historical cases, 4 contemporary, 4 edge cases
- `comparative advantage` - 5 historical, 4 contemporary, 4 edge cases
- `invisible hand` - 4 historical, 3 contemporary, 4 edge cases

### Sample Books
1. **physics-1**: The Feynman Lectures
2. **philosophy-1**: Meditations on First Philosophy
3. **economics-1**: The Wealth of Nations
4. **psychology-1**: Thinking, Fast and Slow

## Next Steps / TODOs

### ✅ Completed
1. ~~**Frontend Integration**: Update frontend components to use `api.ts`~~ DONE
2. ~~**OpenAI Key**: Add to backend `.env` to enable AI features~~ (Setup ready, just add key)
3. ~~**Database**: SQLite with SQLAlchemy for insights persistence~~ DONE

### 🔄 In Progress / Next
4. **User Features**: Add auth, saved books, reading progress (DB ready, need auth)
5. **Caching**: Add Redis for AI response caching
6. **Vector Search**: Add embeddings for semantic search
7. **Real News**: Replace hardcoded news with NewsAPI or similar
8. **Tests**: Add unit tests for backend services
9. **Deployment**: Docker setup, cloud deployment config

## Important Notes

1. **OpenAI API Key**: Must be set in `backend/.env` for AI features to work
2. **CORS**: Backend allows requests from `http://localhost:5173` by default
3. **File Uploads**: Backend handles PDF, EPUB, TXT files
4. **Hardcoded Data**: All original frontend hardcoded data is now in `backend/app/data/`
5. **Fallbacks**: Backend returns fallback data if OpenAI is not configured

## Contact / Context

- **Project Location**: `/Users/shamim/Documents/Tech/Apps/Education/app/`
- **Frontend URL**: http://localhost:5173
- **Backend URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Last Updated**: 2026-01-31

## Current Status Summary (2026-01-31)

### ✅ What's Working
1. **Backend API**: All endpoints functional with SQLite database
2. **Database**: Books, Chapters, Insights models with full CRUD
3. **AI Insights**: Generated, saved to DB, and retrieved on reload
4. **Frontend**: Updated to use new API with DB sync status indicator
5. **Sample Books**: Auto-sync to DB when opened in AnalyzeBookPage
6. **Chapter Content**: Fixed - chapters now store full content in DB

### 🧪 Test It
1. Open `AnalyzeBookPage` with a sample book: `/analyze?book=economics-1`
2. Wait for "Syncing book to database..." to complete
3. Click "Insights" tab - insights will generate and save
4. Refresh page - insights load instantly from DB (no regeneration!)
5. Look for the green "Saved" badge with database icon

### 📁 Database Location
```
backend/data/bookmind.db  (SQLite file)
```

### 🔧 To Enable Real AI (not fallback)
Add to `backend/.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

### 🐛 Recent Fixes
- **Fixed**: Chapter content not being returned by API (added `content` field to `/books/{id}/chapters`)
- **Fixed**: Chapter detection in `file_service.py` now handles markdown headers properly
- **Fixed**: Book sync now properly stores chapter content in database

---

*This context file helps maintain continuity across AI assistant sessions.*
