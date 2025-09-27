#!/bin/bash

echo "Setting up test data..."
echo "1. Execute full_test_case.sql to create realistic case data"
echo "2. Make test_template_curl.sh executable and update URLs"
echo "3. Run the curl command to test template generation"

# Make the curl script executable
chmod +x test_template_curl.sh

echo ""
echo "Files created:"
echo "- full_test_case.sql (execute this in your database)"
echo "- test_template_curl.sh (update URLs and run this)"
echo ""
echo "To execute the SQL:"
echo "supabase db reset"  
echo "psql -f full_test_case.sql"
echo ""
echo "To run the curl test:"
echo "Edit test_template_curl.sh with your Supabase URL and anon key, then:"
echo "./test_template_curl.sh"