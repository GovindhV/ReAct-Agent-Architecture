#!/bin/bash

# API Testing Script
# Tests all API endpoints of the ReAct Calendar Agent

set -e

API_URL="http://localhost:3001"
TEST_EMAIL="test@company.com"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}🧪 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_separator() {
    echo ""
    echo "════════════════════════════════════════════════"
    echo ""
}

echo "🚀 Starting API Tests..."
print_separator

# Test 1: Health Check
print_test "Test 1: Health Check"
HEALTH_RESPONSE=$(curl -s "${API_URL}/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    print_success "Health check passed"
    echo "$HEALTH_RESPONSE" | jq .
else
    print_error "Health check failed"
    echo "$HEALTH_RESPONSE"
fi
print_separator

# Test 2: Process Simple Query
print_test "Test 2: Process Simple Query"
QUERY_RESPONSE=$(curl -s -X POST "${API_URL}/api/process-query" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"query\": \"Schedule a meeting tomorrow at 2pm\"
    }")

if echo "$QUERY_RESPONSE" | grep -q "success"; then
    print_success "Query processing passed"
    echo "$QUERY_RESPONSE" | jq .
else
    print_error "Query processing failed"
    echo "$QUERY_RESPONSE"
fi
print_separator

# Test 3: Process Production Query
print_test "Test 3: Process Production Query"
PROD_RESPONSE=$(curl -s -X POST "${API_URL}/api/process-query" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"query\": \"Schedule 500 units of Model X on Line 3 next Monday\"
    }")

if echo "$PROD_RESPONSE" | grep -q "success"; then
    print_success "Production query passed"
    echo "$PROD_RESPONSE" | jq .
else
    print_error "Production query failed"
    echo "$PROD_RESPONSE"
fi
print_separator

# Test 4: Process Quality Audit Query
print_test "Test 4: Process Quality Audit Query"
QUALITY_RESPONSE=$(curl -s -X POST "${API_URL}/api/process-query" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"query\": \"Schedule quality audit for automotive line tomorrow morning\"
    }")

if echo "$QUALITY_RESPONSE" | grep -q "success"; then
    print_success "Quality audit query passed"
    echo "$QUALITY_RESPONSE" | jq .
else
    print_error "Quality audit query failed"
    echo "$QUALITY_RESPONSE"
fi
print_separator

# Test 5: Get Events
print_test "Test 5: Get Events for User"
EVENTS_RESPONSE=$(curl -s "${API_URL}/api/events/${TEST_EMAIL}")
if echo "$EVENTS_RESPONSE" | grep -q "events"; then
    print_success "Get events passed"
    echo "$EVENTS_RESPONSE" | jq .
else
    print_error "Get events failed"
    echo "$EVENTS_RESPONSE"
fi
print_separator

# Test 6: Get Logs
print_test "Test 6: Get Logs for User"
LOGS_RESPONSE=$(curl -s "${API_URL}/api/logs/${TEST_EMAIL}")
if echo "$LOGS_RESPONSE" | grep -q "logs"; then
    print_success "Get logs passed"
    echo "$LOGS_RESPONSE" | jq .
else
    print_error "Get logs failed"
    echo "$LOGS_RESPONSE"
fi
print_separator

# Test 7: Invalid Request
print_test "Test 7: Invalid Request (Missing Email)"
INVALID_RESPONSE=$(curl -s -X POST "${API_URL}/api/process-query" \
    -H "Content-Type: application/json" \
    -d "{
        \"query\": \"Schedule a meeting\"
    }")

if echo "$INVALID_RESPONSE" | grep -q "error"; then
    print_success "Error handling passed"
    echo "$INVALID_RESPONSE" | jq .
else
    print_error "Error handling failed"
    echo "$INVALID_RESPONSE"
fi
print_separator

# Test 8: Maintenance Query
print_test "Test 8: Maintenance Query"
MAINT_RESPONSE=$(curl -s -X POST "${API_URL}/api/process-query" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"query\": \"Book maintenance window for Machine M-456 this Sunday\"
    }")

if echo "$MAINT_RESPONSE" | grep -q "success"; then
    print_success "Maintenance query passed"
    echo "$MAINT_RESPONSE" | jq .
else
    print_error "Maintenance query failed"
    echo "$MAINT_RESPONSE"
fi
print_separator

# Test Summary
echo "════════════════════════════════════════════════"
echo "📊 Test Summary"
echo "════════════════════════════════════════════════"
echo ""
echo "All tests completed!"
echo ""
echo "To view all events created:"
echo "  curl ${API_URL}/api/events/${TEST_EMAIL} | jq ."
echo ""
echo "To view all logs:"
echo "  curl ${API_URL}/api/logs/${TEST_EMAIL} | jq ."
echo ""
echo "To check Kafka messages:"
echo "  docker exec -it kafka kafka-console-consumer \\"
echo "    --bootstrap-server localhost:9092 \\"
echo "    --topic calendar-events \\"
echo "    --from-beginning"
echo ""
echo "════════════════════════════════════════════════"