#!/bin/bash
# AI Bug Tracker - Quick Start Setup

echo "======================================"
echo "AI Bug Tracker - Setup Script"
echo "======================================"

# Check Python
echo ""
echo "Checking Python..."
python --version || { echo "Python not found!"; exit 1; }

# Check Node.js
echo "Checking Node.js..."
node --version || { echo "Node.js not found!"; exit 1; }

# Backend Setup
echo ""
echo "Setting up Backend..."
cd backend || exit
pip install -r requirements.txt
echo "Backend setup complete!"

# Frontend Setup
echo ""
echo "Setting up Frontend..."
cd ../frontend || exit
npm install
echo "Frontend setup complete!"

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  python -m uvicorn app.main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
