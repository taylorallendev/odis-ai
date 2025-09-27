#!/bin/bash

# Edge Functions Testing Script
# This script runs tests for Supabase Edge Functions following the official testing guide

set -e  # Exit on any error

echo "🧪 Edge Functions Testing Script"
echo "================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Please install it first: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Error: Deno is not installed"
    echo "Please install it first: https://deno.land/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    if [ -f .env.test ]; then
        echo "📋 Copying .env.test to .env"
        cp .env.test .env
        echo "⚠️  Please update .env with your actual API keys before running tests"
        echo "   Required: ANTHROPIC_API_KEY"
    else
        echo "❌ Error: No .env file found"
        echo "Please create .env file with required environment variables"
        exit 1
    fi
fi

# Check if Supabase is running locally
echo "🔍 Checking if Supabase is running locally..."
if ! curl -s http://localhost:54321/health > /dev/null; then
    echo "🚀 Starting Supabase locally..."
    supabase start
else
    echo "✅ Supabase is already running"
fi

# Check if Edge Functions are being served
echo "🔍 Checking if Edge Functions are being served..."
if ! curl -s http://localhost:54321/functions/v1/ > /dev/null; then
    echo "🚀 Starting Edge Functions server..."
    supabase functions serve &
    FUNCTIONS_PID=$!
    echo "Started Edge Functions server with PID: $FUNCTIONS_PID"
    
    # Wait for functions to be ready
    echo "⏳ Waiting for Edge Functions to be ready..."
    sleep 5
else
    echo "✅ Edge Functions are already being served"
fi

# Run the tests
echo ""
echo "🧪 Running Edge Function Tests"
echo "==============================="

# Test generate-from-template function
echo "Testing generate-from-template function..."
deno test --allow-all supabase/functions/tests/generate-from-template-test.ts

echo ""
echo "✅ All tests completed!"

# Clean up if we started the functions server
if [ ! -z "$FUNCTIONS_PID" ]; then
    echo "🧹 Cleaning up Edge Functions server (PID: $FUNCTIONS_PID)..."
    kill $FUNCTIONS_PID 2>/dev/null || true
fi

echo ""
echo "📝 Test Summary:"
echo "- Client creation and database connectivity"
echo "- Template CRUD operations"
echo "- Function success scenarios"
echo "- Error handling and validation"
echo "- Multiple output formats"
echo "- Input data variations"
echo "- LangChain v1.0+ structured output validation"
echo ""
echo "🔄 Updated Features:"
echo "- Uses LangChain v1.0+ withStructuredOutput instead of deprecated StructuredOutputParser"
echo "- Modern imports and patterns for future compatibility"
echo ""
echo "For more testing options, see: https://supabase.com/docs/guides/functions/debugging"