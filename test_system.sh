#!/bin/bash

# AI Travel Planner - System Test Script
# This script tests all major components of the system

set -e

echo "🧪 Testing AI Travel Planner System..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-}

    echo -n "Testing $name... "

    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        ((FAILED++))
    fi
}

# Test 1: PostgreSQL
echo "1️⃣  Testing PostgreSQL..."
if docker ps | grep -q travel_planner_postgres; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ PostgreSQL container is not running${NC}"
    ((FAILED++))
fi
echo ""

# Test 2: Recommendation Service
echo "2️⃣  Testing Recommendation Service..."
test_endpoint "Health Check" "http://localhost:8000/health"
echo ""

# Test 3: Backend Service
echo "3️⃣  Testing Backend Service..."
test_endpoint "Recommendation Health" "http://localhost:3000/recommendations/health"
echo ""

# Test 4: Get user IDs from mock data
echo "4️⃣  Getting test data IDs..."
if [ -f "recommendation-service/mock_users.json" ]; then
    USER_ID=$(cat recommendation-service/mock_users.json | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✓ Found test user ID: $USER_ID${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Mock data not found. Run generate_mock_data.py first${NC}"
    USER_ID="test-user-123"
fi

if [ -f "recommendation-service/mock_places.json" ]; then
    PLACE_ID=$(cat recommendation-service/mock_places.json | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✓ Found test place ID: $PLACE_ID${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Mock data not found${NC}"
    PLACE_ID="test-place-123"
fi
echo ""

# Test 5: Interaction Tracking
echo "5️⃣  Testing Interaction Tracking..."
INTERACTION_DATA="{\"userId\":\"$USER_ID\",\"placeId\":\"$PLACE_ID\",\"eventType\":\"VIEW_DETAIL\"}"
test_endpoint "Track View" "http://localhost:3000/interactions" "POST" "$INTERACTION_DATA"

LIKE_DATA="{\"userId\":\"$USER_ID\",\"placeId\":\"$PLACE_ID\",\"eventType\":\"LIKE\"}"
test_endpoint "Track Like" "http://localhost:3000/interactions" "POST" "$LIKE_DATA"
echo ""

# Test 6: Get Interactions
echo "6️⃣  Testing Get Interactions..."
test_endpoint "Get User Interactions" "http://localhost:3000/interactions/user/$USER_ID"
echo ""

# Test 7: Recommendations
echo "7️⃣  Testing Recommendations..."
REC_DATA="{\"userId\":\"$USER_ID\",\"destination\":\"Lam Dong\",\"budgetPerPerson\":5000000,\"days\":3,\"groupSize\":2,\"monthOfYear\":10,\"explicitPreferences\":[\"Nature\"]}"
test_endpoint "Get Recommendations" "http://localhost:3000/recommendations" "POST" "$REC_DATA"
echo ""

# Test 8: Trip Creation (this will fail if Gemini API key is not set)
echo "8️⃣  Testing Trip Creation..."
TRIP_DATA="{\"userId\":\"$USER_ID\",\"destination\":\"Lam Dong\",\"startDate\":\"2026-11-01T00:00:00.000Z\",\"endDate\":\"2026-11-04T00:00:00.000Z\",\"budgetPerPerson\":5000000,\"groupSize\":2,\"preferences\":[\"Nature\",\"Adventure\"]}"
echo -n "Creating trip... "
TRIP_RESPONSE=$(curl -s -X POST "http://localhost:3000/trips" \
    -H "Content-Type: application/json" \
    -d "$TRIP_DATA")

if echo "$TRIP_RESPONSE" | grep -q "id"; then
    TRIP_ID=$(echo "$TRIP_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✓ PASSED${NC} (Trip ID: $TRIP_ID)"
    ((PASSED++))

    # Test getting the trip
    echo -n "Getting trip... "
    GET_TRIP_RESPONSE=$(curl -s "http://localhost:3000/trips/$TRIP_ID")
    if echo "$GET_TRIP_RESPONSE" | grep -q "itinerary"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ SKIPPED${NC} (Requires Gemini API key)"
    echo "  Note: Add GEMINI_API_KEY to backend/.env to enable this test"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "Your AI Travel Planner is ready to use!"
    echo ""
    echo "Next steps:"
    echo "1. Import docs/postman_collection.json into Postman"
    echo "2. Start building the frontend"
    echo "3. Add more places to the database"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure all services are running (docker-compose ps)"
    echo "2. Check if mock data is loaded (psql)"
    echo "3. Check if model is trained (curl http://localhost:8000/health)"
    echo "4. Check logs (docker-compose logs)"
    exit 1
fi
