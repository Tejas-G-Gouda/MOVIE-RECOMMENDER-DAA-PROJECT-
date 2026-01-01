@echo off
REM CinemaVerse Setup Script for Windows

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║     CinemaVerse - 3D Movie Recommender        ║
echo ║         Setup ^& Launch (Windows)              ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Check Python installation
echo ✓ Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python not found. Please install Python 3.7+
    pause
    exit /b 1
)

REM Install Flask
echo ✓ Installing dependencies...
pip install flask >nul 2>&1
if errorlevel 1 (
    echo ✗ Failed to install Flask
    pause
    exit /b 1
)

REM Check C++ executable
echo ✓ Checking C++ recommender...
if exist "cpp\recommender.exe" (
    echo   ✓ recommender.exe found
) else (
    echo   ⚠ recommender.exe not found
    echo   Please compile: g++ cpp\recommender.cpp -o cpp\recommender.exe
)

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║           Setup Complete!                     ║
echo ║                                               ║
echo ║  Starting CinemaVerse...                      ║
echo ║  Open Browser: http://localhost:5000          ║
echo ║                                               ║
echo ║  Press Ctrl+C to stop the server              ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Start Flask app
python app.py

pause
