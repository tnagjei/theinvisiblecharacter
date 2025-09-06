#!/bin/bash

# Deployment Verification Script for TheInvisibleCharacter.live
# Comprehensive deployment validation and monitoring
# Usage: ./verify-deployment.sh [--environment=production|development] [--verbose]

set -e

# Configuration
ENVIRONMENT="production"
DOMAIN="theinvisiblecharacter.live"
VERBOSE=false
CHECK_URL="https://$DOMAIN"
TIMEOUT=30
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --environment=*)
            ENVIRONMENT="${arg#*=}"
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --environment=ENV  Set environment (production|development)"
            echo "  --verbose         Enable verbose output"
            echo "  --help            Show this help message"
            exit 0
            ;;
        *)
            # Unknown option
            ;;
    esac
done

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $1"
    fi
}

# Test functions
test_http_status() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    log_verbose "Testing HTTP status for: $url"
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
    
    if [[ "$status_code" == "$expected_status" ]]; then
        log_success "$description - HTTP $status_code"
        return 0
    else
        log_error "$description - Expected $expected_status, got $status_code"
        return 1
    fi
}

test_ssl_certificate() {
    log_verbose "Testing SSL certificate..."
    
    local cert_info=$(openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "ERROR")
    
    if [[ "$cert_info" == *"ERROR"* ]]; then
        log_error "SSL certificate test failed"
        return 1
    fi
    
    local not_after=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2)
    log_success "SSL certificate valid until: $not_after"
    return 0
}

test_dns_resolution() {
    log_verbose "Testing DNS resolution..."
    
    local ip=$(dig +short "$DOMAIN" 2>/dev/null | head -n1)
    
    if [[ -n "$ip" ]]; then
        log_success "DNS resolution successful: $DOMAIN -> $ip"
        return 0
    else
        log_error "DNS resolution failed for $DOMAIN"
        return 1
    fi
}

test_security_headers() {
    log_verbose "Testing security headers..."
    
    local headers=$(curl -s -I "$CHECK_URL" 2>/dev/null || echo "")
    
    local required_headers=(
        "X-Frame-Options"
        "X-Content-Type-Options"
        "X-XSS-Protection"
        "Content-Security-Policy"
        "Strict-Transport-Security"
    )
    
    local missing_headers=()
    
    for header in "${required_headers[@]}"; do
        if [[ "$headers" =~ "$header" ]]; then
            log_success "Security header found: $header"
        else
            missing_headers+=("$header")
            log_warning "Security header missing: $header"
        fi
    done
    
    if [[ ${#missing_headers[@]} -eq 0 ]]; then
        log_success "All security headers present"
        return 0
    else
        log_error "Missing security headers: ${missing_headers[*]}"
        return 1
    fi
}

test_performance_metrics() {
    log_verbose "Testing performance metrics..."
    
    local load_time=$(curl -s -w "%{time_total}" -o /dev/null "$CHECK_URL" 2>/dev/null || echo "999")
    local size=$(curl -s -w "%{size_download}" -o /dev/null "$CHECK_URL" 2>/dev/null || echo "9999999")
    
    log_info "Load time: ${load_time}s"
    log_info "Page size: $size bytes"
    
    if (( $(echo "$load_time < 3.0" | bc -l) )); then
        log_success "Load time acceptable: ${load_time}s"
    else
        log_warning "Load time slow: ${load_time}s"
    fi
    
    if (( size < 1000000 )); then
        log_success "Page size acceptable: $size bytes"
    else
        log_warning "Page size large: $size bytes"
    fi
}

test_critical_pages() {
    log_verbose "Testing critical pages..."
    
    local critical_pages=(
        "$CHECK_URL"
        "$CHECK_URL/tools.html"
        "$CHECK_URL/about.html"
        "$CHECK_URL/help.html"
        "$CHECK_URL/blog/"
        "$CHECK_URL/sitemap.xml"
        "$CHECK_URL/robots.txt"
    )
    
    local failed_pages=()
    
    for page in "${critical_pages[@]}"; do
        if ! test_http_status "$page" "200" "Critical page: $page"; then
            failed_pages+=("$page")
        fi
    done
    
    if [[ ${#failed_pages[@]} -eq 0 ]]; then
        log_success "All critical pages accessible"
        return 0
    else
        log_error "Failed critical pages: ${failed_pages[*]}"
        return 1
    fi
}

test_redirects() {
    log_verbose "Testing redirects..."
    
    local redirects=(
        "$CHECK_URL/about:$CHECK_URL/about.html"
        "$CHECK_URL/help:$CHECK_URL/help.html"
        "$CHECK_URL/blog:$CHECK_URL/blog/index.html"
    )
    
    local failed_redirects=()
    
    for redirect in "${redirects[@]}"; do
        local from="${redirect%%:*}"
        local to="${redirect#*:}"
        
        local final_url=$(curl -s -w "%{redirect_url}" -o /dev/null "$from" 2>/dev/null || echo "")
        
        if [[ "$final_url" == "$to" ]]; then
            log_success "Redirect working: $from -> $to"
        else
            failed_redirects+=("$from")
            log_warning "Redirect failed: $from -> $to (got: $final_url)"
        fi
    done
    
    if [[ ${#failed_redirects[@]} -eq 0 ]]; then
        log_success "All redirects working"
        return 0
    else
        log_error "Failed redirects: ${failed_redirects[*]}"
        return 1
    fi
}

test_mobile_responsiveness() {
    log_verbose "Testing mobile responsiveness..."
    
    local viewport_meta=$(curl -s "$CHECK_URL" | grep -i "viewport" | head -n1 || echo "")
    
    if [[ "$viewport_meta" =~ "viewport" ]] && [[ "$viewport_meta" =~ "width=device-width" ]]; then
        log_success "Mobile viewport meta tag present"
        return 0
    else
        log_error "Mobile viewport meta tag missing or incorrect"
        return 1
    fi
}

test_seo_elements() {
    log_verbose "Testing SEO elements..."
    
    local page_content=$(curl -s "$CHECK_URL" 2>/dev/null || echo "")
    
    local seo_elements=(
        "title"
        "meta name=\"description\""
        "meta property=\"og:title\""
        "meta property=\"og:description\""
        "meta name=\"twitter:card\""
        "link rel=\"canonical\""
    )
    
    local missing_elements=()
    
    for element in "${seo_elements[@]}"; do
        if [[ "$page_content" =~ "$element" ]]; then
            log_success "SEO element found: $element"
        else
            missing_elements+=("$element")
            log_warning "SEO element missing: $element"
        fi
    done
    
    if [[ ${#missing_elements[@]} -eq 0 ]]; then
        log_success "All SEO elements present"
        return 0
    else
        log_error "Missing SEO elements: ${missing_elements[*]}"
        return 1
    fi
}

test_analytics_integration() {
    log_verbose "Testing analytics integration..."
    
    local page_content=$(curl -s "$CHECK_URL" 2>/dev/null || echo "")
    
    local analytics_elements=(
        "googletagmanager.com"
        "google-analytics.com"
        "gtag"
    )
    
    local found_analytics=false
    
    for element in "${analytics_elements[@]}"; do
        if [[ "$page_content" =~ "$element" ]]; then
            log_success "Analytics element found: $element"
            found_analytics=true
        fi
    done
    
    if [[ "$found_analytics" == true ]]; then
        log_success "Analytics integration detected"
        return 0
    else
        log_warning "Analytics integration not detected"
        return 1
    fi
}

test_functionality() {
    log_verbose "Testing core functionality..."
    
    local page_content=$(curl -s "$CHECK_URL" 2>/dev/null || echo "")
    
    # Test for key functionality elements
    local functional_elements=(
        "clipboard"
        "copy"
        "invisible"
        "character"
    )
    
    local missing_elements=()
    
    for element in "${functional_elements[@]}"; do
        if [[ "$page_content" =~ "$element" ]]; then
            log_success "Functional element found: $element"
        else
            missing_elements+=("$element")
            log_warning "Functional element missing: $element"
        fi
    done
    
    if [[ ${#missing_elements[@]} -eq 0 ]]; then
        log_success "All functional elements present"
        return 0
    else
        log_error "Missing functional elements: ${missing_elements[*]}"
        return 1
    fi
}

generate_report() {
    local report_file="deployment-report-$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$report_file" << EOF
The Invisible Character - Deployment Verification Report
======================================================
Date: $(date)
Environment: $ENVIRONMENT
Domain: $DOMAIN
Test URL: $CHECK_URL

Test Results:
$(cat /tmp/test_results.txt)

Recommendations:
1. Monitor performance metrics regularly
2. Check for security updates
3. Monitor user analytics
4. Test mobile compatibility periodically
5. Keep content updated

Generated by: $0
EOF
    
    log_success "Verification report generated: $report_file"
}

# Main verification process
main() {
    log_info "Starting deployment verification for $DOMAIN"
    log_info "Environment: $ENVIRONMENT"
    log_info "Test URL: $CHECK_URL"
    
    # Initialize test results
    echo "Deployment Verification Results" > /tmp/test_results.txt
    echo "==============================" >> /tmp/test_results.txt
    echo "" >> /tmp/test_results.txt
    
    local total_tests=0
    local passed_tests=0
    
    # Run all tests
    local tests=(
        "test_dns_resolution"
        "test_ssl_certificate"
        "test_http_status \"$CHECK_URL\" 200 \"Main page accessibility\""
        "test_security_headers"
        "test_performance_metrics"
        "test_critical_pages"
        "test_redirects"
        "test_mobile_responsiveness"
        "test_seo_elements"
        "test_analytics_integration"
        "test_functionality"
    )
    
    for test in "${tests[@]}"; do
        total_tests=$((total_tests + 1))
        log_info "Running test: $test"
        
        if eval "$test" >> /tmp/test_results.txt 2>&1; then
            passed_tests=$((passed_tests + 1))
            echo "✅ $test: PASSED" >> /tmp/test_results.txt
        else
            echo "❌ $test: FAILED" >> /tmp/test_results.txt
        fi
        
        echo "" >> /tmp/test_results.txt
    done
    
    # Summary
    local success_rate=$((passed_tests * 100 / total_tests))
    
    log_info "=== Verification Summary ==="
    log_info "Total tests: $total_tests"
    log_info "Passed tests: $passed_tests"
    log_info "Success rate: ${success_rate}%"
    
    if [[ $success_rate -ge 80 ]]; then
        log_success "Deployment verification completed successfully"
    else
        log_warning "Deployment verification completed with issues"
    fi
    
    # Generate report
    generate_report
    
    # Show results
    if [[ "$VERBOSE" == true ]]; then
        echo ""
        echo "=== Detailed Results ==="
        cat /tmp/test_results.txt
    fi
    
    # Cleanup
    rm -f /tmp/test_results.txt
    
    return $([[ $success_rate -ge 80 ]] && echo 0 || echo 1)
}

# Handle script interruption
trap 'log_error "Verification interrupted"; exit 1' INT TERM

# Run main function
main "$@"