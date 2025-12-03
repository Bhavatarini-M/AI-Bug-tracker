@echo off
REM AI Bug Tracker - Quick Start Setup for Windows

echo ======================================
echo AI Bug Tracker - Setup Script (Windows)
echo ======================================

REM Check Python
echo.
echo Checking Python...
python --version >nul 2>&1 || (
    echo Python not found!
    pause
    exit /b 1
)

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1 || (
    echo Node.js not found!
    pause
    exit /b 1
)

REM Backend Setup
echo.
echo Setting up Backend...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Backend setup failed!
    pause
    exit /b 1
)
echo Backend setup complete!

REM Frontend Setup
echo.
echo Setting up Frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend setup failed!
    pause
    exit /b 1
)
echo Frontend setup complete!

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   python -m uvicorn app.main:app --reload
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
