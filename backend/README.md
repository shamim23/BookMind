# BookMind AI Backend

FastAPI backend for the BookMind AI application.

## Features

- AI-powered book analysis (insights, first principles, dialectic)
- Cross-domain concept mapping
- Evidence mapping with historical and contemporary cases
- File upload support (PDF, EPUB, TXT)
- Hardcoded sample books and mappings (same as frontend)

## Setup

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. Run the server:
```bash
python run.py
```

Or with uvicorn directly:
```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Books
- `GET /books/sample` - Get all sample books
- `GET /books/sample/{book_id}` - Get specific sample book
- `GET /books/categories` - Get book categories
- `POST /books/upload` - Upload a book file (PDF, EPUB, TXT)

### Analysis
- `POST /analysis/insights` - Generate AI insights for a chapter
- `POST /analysis/first-principles` - Generate first principles analysis
- `POST /analysis/dialectic` - Generate dialectical analysis
- `POST /analysis/chat` - Chat with AI about a chapter

### Mappings
- `POST /mappings/concepts/find` - Find cross-domain concept mappings
- `GET /mappings/concepts/book/{book_id}` - Get concepts for a book
- `POST /mappings/evidence` - Get evidence mapping for a concept

### News
- `POST /news/find` - Find relevant news articles

### Health
- `GET /` - API info
- `GET /health` - Health check

## API Documentation

When the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

```
backend/
├── app/
│   ├── core/           # Configuration
│   ├── data/           # Hardcoded data (migrated from frontend)
│   ├── models/         # Pydantic schemas
│   ├── routers/        # API endpoints
│   ├── services/       # Business logic (OpenAI, file processing)
│   └── main.py         # FastAPI app
├── requirements.txt
└── run.py
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes (for AI features) |
| `NEWS_API_KEY` | News API key (optional) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:5173) |
| `DEBUG` | Debug mode | No (default: False) |
