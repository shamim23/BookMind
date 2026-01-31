#!/bin/bash

# BookMind AI - Development Startup Script
# Starts both the backend and frontend servers

echo "🚀 Starting BookMind AI Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is required but not installed."
    exit 1
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM

# Setup backend if needed
echo -e "${BLUE}📦 Setting up backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/installed" ] || [ requirements.txt -nt venv/installed ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating backend/.env from template. Please edit it to add your OpenAI API key.${NC}"
    cp .env.example .env
fi

cd ..

# Start backend
echo -e "${BLUE}🔥 Starting FastAPI backend on http://localhost:8000${NC}"
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is healthy
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend may still be starting...${NC}"
fi

# Start frontend
echo -e "${BLUE}⚛️  Starting React frontend on http://localhost:5173${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend
echo "⏳ Waiting for frontend to start..."
sleep 3

echo ""
echo -e "${GREEN}✨ BookMind AI is ready!${NC}"
echo ""
echo -e "📚 Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "🔌 Backend:  ${BLUE}http://localhost:8000${NC}"
echo -e "📖 API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
