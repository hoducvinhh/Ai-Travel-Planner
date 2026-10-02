#!/bin/bash

echo "🧪 Testing Backend API..."
echo ""

echo "1️⃣ Test Health Check:"
curl -s http://localhost:3002/ || echo "❌ Backend not responding"
echo ""

echo "2️⃣ Test Get Trips (Empty):"
curl -s http://localhost:3002/trips?userId=demo-user-id
echo ""

echo "3️⃣ Test Create Trip (Will likely fail if no Place data):"
curl -X POST http://localhost:3002/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-id",
    "destination": "Đà Lạt",
    "startDate": "2026-10-10T00:00:00.000Z",
    "endDate": "2026-10-13T00:00:00.000Z",
    "budgetPerPerson": 5000000,
    "groupSize": 2,
    "preferences": ["nature", "food"]
  }'
echo ""
echo ""
echo "✅ If you see errors above, check:"
echo "   - Database has Place data (run generate_mock_data.py)"
echo "   - ML service is running (port 8000)"
echo "   - Gemini API key is configured"
