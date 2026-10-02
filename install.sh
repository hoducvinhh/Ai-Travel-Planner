#!/bin/bash

# AI Travel Planner - Complete Auto Setup
# This script does EVERYTHING for you

set -e

echo "=========================================="
echo "🚀 AI Travel Planner - Complete Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install from https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm found: $(pnpm --version)${NC}"

# Check Python
if ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python not found. Please install from https://www.python.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python found: $(python --version)${NC}"

# Check Docker
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker not running. Please start Docker Desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

echo ""
echo "=========================================="
echo "📦 Installing Dependencies"
echo "=========================================="
echo ""

# Backend dependencies
echo -e "${YELLOW}[1/6] Installing backend dependencies...${NC}"
cd backend
pnpm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..
echo ""

# Setup backend .env
echo -e "${YELLOW}[2/6] Setting up backend environment...${NC}"
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to add GEMINI_API_KEY to backend/.env${NC}"
    echo "Get your free API key at: https://ai.google.dev/"
    echo ""
    echo "After getting the key, open backend/.env and add:"
    echo "GEMINI_API_KEY=your_key_here"
    echo ""
    read -p "Press Enter after you've added the API key (or press Ctrl+C to exit and add it later)..."
fi
cd ..
echo ""

# Start PostgreSQL
echo -e "${YELLOW}[3/6] Starting PostgreSQL...${NC}"
docker-compose up -d postgres
echo "Waiting for PostgreSQL to start..."
sleep 15
echo -e "${GREEN}✓ PostgreSQL started${NC}"
echo ""

# Database migration
echo -e "${YELLOW}[4/6] Running database migration...${NC}"
cd backend
pnpm prisma migrate dev --name init --skip-seed || true
pnpm prisma generate
echo -e "${GREEN}✓ Database schema created${NC}"
cd ..
echo ""

# Python setup and mock data
echo -e "${YELLOW}[5/6] Setting up Python environment and generating mock data...${NC}"
cd recommendation-service

# Create .env
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Install Python packages
echo "Installing Python packages..."
pip install -r requirements.txt -q

# Generate mock data
echo "Generating mock data (400 users, 200 places, 15,000 interactions)..."
python generate_mock_data.py

# Load into database
echo "Loading mock data into PostgreSQL..."
python load_mock_data.py

echo -e "${GREEN}✓ Mock data generated and loaded${NC}"
cd ..
echo ""

# Instructions
echo -e "${YELLOW}[6/6] Setup complete!${NC}"
echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo -e "${GREEN}What has been done:${NC}"
echo "  ✓ Backend dependencies installed"
echo "  ✓ PostgreSQL database started"
echo "  ✓ Database schema migrated"
echo "  ✓ 400 users generated"
echo "  ✓ 200 places generated"
echo "  ✓ 15,000 interactions generated"
echo "  ✓ Mock data loaded into database"
echo ""
echo "=========================================="
echo "🚀 Next Steps - Start Services:"
echo "=========================================="
echo ""
echo -e "${YELLOW}TERMINAL 1 - Start Recommendation Service:${NC}"
echo "  cd recommendation-service"
echo "  uvicorn app.main:app --reload"
echo ""
echo -e "${YELLOW}TERMINAL 2 - Train ML Model (wait 10s after Terminal 1):${NC}"
echo "  curl -X POST http://localhost:8000/train"
echo "  (This takes 2-3 minutes)"
echo ""
echo -e "${YELLOW}TERMINAL 3 - Start Backend (after training completes):${NC}"
echo "  cd backend"
echo "  pnpm run start:dev"
echo ""
echo "=========================================="
echo "📚 Useful Resources:"
echo "=========================================="
echo ""
echo "  • API Documentation: docs/API.md"
echo "  • Postman Collection: docs/postman_collection.json"
echo "  • Implementation Guide: IMPLEMENTATION_SUMMARY.md"
echo "  • Quick Start Guide: PNPM_GUIDE.md"
echo ""
echo "  • Recommendation API: http://localhost:8000/docs"
echo "  • Backend API: http://localhost:3000"
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Ready to code!${NC}"
echo "=========================================="
