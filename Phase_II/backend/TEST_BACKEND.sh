#!/bin/bash
# Test script for backend deployment

echo "🔍 Testing Pure Tasks Backend on Vercel..."
echo ""

# Test 1: Root endpoint
echo "Test 1: Root Endpoint"
echo "URL: https://pure-tasks-backend.vercel.app/"
curl -s https://pure-tasks-backend.vercel.app/ | python -m json.tool 2>/dev/null || echo "❌ Failed - 500 Error (Environment variables missing)"
echo ""
echo "---"
echo ""

# Test 2: Health endpoint
echo "Test 2: Health Check"
echo "URL: https://pure-tasks-backend.vercel.app/api/health"
curl -s https://pure-tasks-backend.vercel.app/api/health | python -m json.tool 2>/dev/null || echo "❌ Failed - 500 Error (Environment variables missing)"
echo ""
echo "---"
echo ""

# Test 3: Liveness probe
echo "Test 3: Liveness Probe"
echo "URL: https://pure-tasks-backend.vercel.app/api/health/live"
curl -s https://pure-tasks-backend.vercel.app/api/health/live | python -m json.tool 2>/dev/null || echo "❌ Failed"
echo ""
echo "---"
echo ""

echo "✅ If all tests pass, backend is working!"
echo "❌ If tests fail with 500 error, set environment variables in Vercel Dashboard"
