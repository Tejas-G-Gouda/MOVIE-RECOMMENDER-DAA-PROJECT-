#!/bin/bash
# CinemaVerse Setup Script

echo "╔═══════════════════════════════════════════════╗"
echo "║     CinemaVerse - 3D Movie Recommender        ║"
echo "║         Setup & Launch Script                 ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check Python installation
echo "✓ Checking Python installation..."
python --version || {
    echo "✗ Python not found. Please install Python 3.7+"
    exit 1
}

# Install Flask if needed
echo "✓ Installing dependencies..."
pip install flask > /dev/null 2>&1 || {
    echo "✗ Failed to install Flask"
    exit 1
}

# Check C++ executable
echo "✓ Checking C++ recommender..."
if [ -f "cpp/recommender.exe" ]; then
    echo "  ✓ recommender.exe found"
else
    echo "  ⚠ recommender.exe not found"
    echo "  Please compile: g++ cpp/recommender.cpp -o cpp/recommender.exe"
fi

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║           Setup Complete!                     ║"
echo "║                                               ║"
echo "║  Starting CinemaVerse...                      ║"
echo "║  Open: http://localhost:5000                  ║"
echo "║                                               ║"
echo "║  Press Ctrl+C to stop the server              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Start Flask app
python app.py
