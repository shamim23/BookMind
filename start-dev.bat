@echo off
REM BookMind AI - Development Startup Script for Windows
REM Starts both the backend and frontend servers

echo 🚀 Starting BookMind AI Development Environment...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

REM Check if Node.js is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js/npm is required but not installed.
    exit /b 1
)

REM Setup backend
echo 📦 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
if not exist "venv\installed" (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    type nul > venv\installed
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo ⚠️  Creating backend\.env from template. Please edit it to add your OpenAI API key.
    copy .env.example .env
)

cd ..

REM Start backend in new window
echo 🔥 Starting FastAPI backend on http://localhost:8000
start "BookMind Backend" cmd /k "cd backend && call venv\Scripts\activate && python run.py"

REM Wait for backend
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend in new window
echo ⚛️  Starting React frontend on http://localhost:5173
start "BookMind Frontend" cmd /k "npm run dev"

echo.
echo ✨ BookMind AI is starting!
echo.
echo 📚 Frontend: http://localhost:5173
echo 🔌 Backend:  http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs
echo.
echo Close the command windows to stop the servers
echo.

pause
