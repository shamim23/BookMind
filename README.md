# BookMind AI

An AI-powered book learning platform that helps you understand complex books through insights, first principles analysis, dialectical reasoning, and cross-domain concept mapping.

## Features

- 📚 **Book Upload & Library** - Upload PDFs, EPUBs, or TXT files, or browse curated sample books
- 🤖 **AI Analysis** - Get AI-generated insights, first principles breakdowns, and dialectical analysis
- 🔗 **Concept Mapping** - See connections between concepts across different domains
- 📰 **Evidence Mapping** - Explore historical and contemporary evidence for key concepts
- 💬 **AI Chat** - Ask questions about any chapter
- ⚡ **Power Reader** - Speed reading mode for faster comprehension

## Architecture

This project uses a **React + FastAPI** architecture:

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

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ (for backend)

### Option 1: Automatic Setup (Recommended)

**macOS/Linux:**
```bash
./start-dev.sh
```

**Windows:**
```batch
start-dev.bat
```

This starts both the backend (http://localhost:8000) and frontend (http://localhost:5173).

### Option 2: Manual Setup

#### 1. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# Start server
python run.py
```

Backend will be at http://localhost:8000

#### 2. Start the Frontend

In a new terminal:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

Frontend will be at http://localhost:5173

## Configuration

### Environment Variables

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:8000  # Backend URL
```

**Backend (backend/.env)**:
```env
OPENAI_API_KEY=your_openai_key_here  # Required for AI features
FRONTEND_URL=http://localhost:5173   # CORS setting
DEBUG=False
```

## API Documentation

When the backend is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Development

### Frontend Only Mode (Legacy)

If you want to run the frontend without the backend (using hardcoded data directly):

1. Set the OpenAI API key in `.env`:
```env
VITE_OPENAI_API_KEY=your_key_here
```

2. Update frontend code to use local services instead of API

### Project Structure

```
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── sections/            # Page sections
│   ├── pages/               # Page components
│   ├── services/            # API clients
│   │   ├── api.ts           # Backend API client
│   │   └── *.ts             # Legacy frontend services
│   └── ...
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── data/            # Hardcoded data (migrated from frontend)
│   │   └── main.py          # FastAPI app
│   └── requirements.txt
├── start-dev.sh             # macOS/Linux startup script
└── start-dev.bat            # Windows startup script
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/books/sample` | GET | Get sample books |
| `/books/upload` | POST | Upload a book |
| `/analysis/insights` | POST | Generate insights |
| `/analysis/first-principles` | POST | Generate first principles |
| `/analysis/dialectic` | POST | Generate dialectical analysis |
| `/analysis/chat` | POST | Chat with AI |
| `/mappings/concepts/find` | POST | Find concept mappings |
| `/mappings/evidence` | POST | Get evidence mapping |
| `/news/find` | POST | Find relevant news |

## Data

The app includes hardcoded data for demonstration:

- **Sample Books**: Physics, Philosophy, Economics, Psychology texts
- **Concept Mappings**: Cross-domain analogies (e.g., "invisible hand" ↔ "ant colonies")
- **Dialectic Analyses**: Thesis-antithesis-synthesis for major works
- **Evidence Mappings**: Historical and contemporary evidence for key concepts

## Technology Stack

**Frontend**:
- React 19 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- React Router

**Backend**:
- FastAPI
- Python 3.9+
- httpx (for OpenAI API)
- PyPDF2 (PDF processing)

## License

MIT
