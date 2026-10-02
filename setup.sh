#!/bin/bash

# AI Travel Planner Setup Script

set -e

echo "🚀 Setting up AI Travel Planner..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "${GREEN}✓${NC} Docker is running"

# Start PostgreSQL
echo "${YELLOW}Starting PostgreSQL...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Setup Backend
echo "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Installing dependencies..."
npm install

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Generating Prisma client..."
npx prisma generate

cd ..

# Setup Recommendation Service
echo "${YELLOW}Setting up Recommendation Service...${NC}"
cd recommendation-service

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Generating mock data..."
python generate_mock_data.py

echo "Loading mock data into database..."
python load_mock_data.py

cd ..

echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add your GEMINI_API_KEY to backend/.env"
echo "2. Start the recommendation service:"
echo "   cd recommendation-service"
echo "   uvicorn app.main:app --reload"
echo ""
echo "3. In another terminal, train the model:"
echo "   curl -X POST http://localhost:8000/train"
echo ""
echo "4. In another terminal, start the backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "5. Access the API at http://localhost:3000"
echo ""
