#!/bin/bash

# AI Travel Planner Setup Script for Git Bash
# Using pnpm

set -e

echo "🚀 Setting up AI Travel Planner (Git Bash + pnpm)..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install Backend Dependencies
echo -e "${YELLOW}[1/8] Installing backend dependencies...${NC}"
cd backend
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..
echo ""

# Step 2: Setup Environment
echo -e "${YELLOW}[2/8] Setting up environment files...${NC}"
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ IMPORTANT: Please add your GEMINI_API_KEY to backend/.env${NC}"
    echo "Get your key at: https://ai.google.dev/"
    echo ""
    read -p "Press Enter after you've added the API key..."
fi
cd ..
echo ""

# Step 3: Start PostgreSQL
echo -e "${YELLOW}[3/8] Starting PostgreSQL...${NC}"
docker-compose up -d postgres
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to start PostgreSQL. Make sure Docker is running.${NC}"
    exit 1
fi
echo "Waiting for PostgreSQL to be ready..."
sleep 10
echo -e "${GREEN}✓ PostgreSQL started${NC}"
echo ""

# Step 4: Run Database Migration
echo -e "${YELLOW}[4/8] Running database migration...${NC}"
cd backend
pnpm prisma migrate dev --name init || echo "Migration might have already run"
pnpm prisma generate
echo -e "${GREEN}✓ Database migrated${NC}"
cd ..
echo ""

# Step 5: Setup Python Environment
echo -e "${YELLOW}[5/8] Setting up Python recommendation service...${NC}"
cd recommendation-service
if [ ! -f .env ]; then
    cp .env.example .env
fi
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install Python dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python dependencies installed${NC}"
cd ..
echo ""

# Step 6: Generate Mock Data
echo -e "${YELLOW}[6/8] Generating mock data...${NC}"
cd recommendation-service
python generate_mock_data.py
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to generate mock data${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Mock data generated${NC}"
echo ""

# Step 7: Load Mock Data
echo -e "${YELLOW}[7/8] Loading mock data into database...${NC}"
python load_mock_data.py
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to load mock data${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Mock data loaded${NC}"
cd ..
echo ""

# Step 8: Final Instructions
echo -e "${GREEN}[8/8] Setup Complete!${NC}"
echo ""
echo "=========================================="
echo "Next Steps - Start Services:"
echo "=========================================="
echo ""
echo -e "${YELLOW}STEP A: Start Recommendation Service${NC}"
echo "  Open a new terminal and run:"
echo "  cd recommendation-service"
echo "  uvicorn app.main:app --reload"
echo ""
echo -e "${YELLOW}STEP B: Train Model${NC} (after Step A is running)"
echo "  Open another terminal and run:"
echo "  curl -X POST http://localhost:8000/train"
echo "  (Wait 2-3 minutes for training to complete)"
echo ""
echo -e "${YELLOW}STEP C: Start Backend${NC} (after Step B completes)"
echo "  Open another terminal and run:"
echo "  cd backend"
echo "  pnpm run start:dev"
echo ""
echo -e "${YELLOW}STEP D: Test the system${NC}"
echo "  ./test_system.sh"
echo ""
echo "=========================================="
echo -e "${GREEN}Setup complete! 🎉${NC}"
echo "=========================================="
