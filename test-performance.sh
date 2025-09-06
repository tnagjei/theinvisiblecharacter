#!/bin/bash

# Performance Test Script for TheInvisibleCharacter.live
# This script tests performance across all pages

echo "Starting performance testing..."

# Create results directory
mkdir -p performance-results

# Function to test a single page
test_page() {
    local page=$1
    local filename=$(basename "$page")
    
    echo "Testing $filename..."
    
    # Run Lighthouse test
    lighthouse "$page" \
        --output=html \
        --output-path="./performance-results/${filename%.html}-report.html" \
        --chrome-flags="--headless --no-sandbox" \
        --view \
        --quiet \
        --only-categories=performance,accessibility,best-practices,seo
    
    # Extract scores
    python3 -c "
import json
import sys
with open('./performance-results/${filename%.html}-report.html', 'r') as f:
    # Extract JSON from HTML (simplified)
    content = f.read()
    start = content.find('<!-- Lighthouse report -->')
    if start != -1:
        start = content.find('{', start)
        end = content.rfind('}') + 1
        json_data = json.loads(content[start:end])
        
        perf_score = json_data['categories']['performance']['score'] * 100
        accessibility_score = json_data['categories']['accessibility']['score'] * 100
        best_practices_score = json_data['categories']['best-practices']['score'] * 100
        seo_score = json_data['categories']['seo']['score'] * 100
        
        print(f'{filename}:')
        print(f'  Performance: {perf_score:.0f}')
        print(f'  Accessibility: {accessibility_score:.0f}')
        print(f'  Best Practices: {best_practices_score:.0f}')
        print(f'  SEO: {seo_score:.0f}')
        print()
    "
}

# Test all pages
echo "=== Testing English Pages ==="
for page in *.html; do
    if [[ "$page" != "test.html" && "$page" != "mobile-test.html" && "$page" != *"-fr.html" ]]; then
        test_page "$page"
    fi
done

echo "=== Testing French Pages ==="
for page in *-fr.html; do
    if [[ -f "$page" ]]; then
        test_page "$page"
    fi
done

echo "=== Testing Blog Pages ==="
for page in blog/*.html; do
    if [[ "$page" != *"fr/"* ]]; then
        test_page "$page"
    fi
done

echo "=== Testing French Blog Pages ==="
for page in blog/fr/*.html; do
    test_page "$page"
done

echo "Performance testing complete!"
echo "Detailed reports are available in the performance-results directory"