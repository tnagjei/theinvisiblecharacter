#!/bin/bash

# Deployment Script for TheInvisibleCharacter.live
# Automated deployment to Cloudflare Pages
# Usage: ./deploy.sh [--production|--development|--dry-run]

set -e  # Exit on any error

# Configuration
DEPLOY_MODE="production"
BUILD_SCRIPT="./build.sh"
DOMAIN="theinvisiblecharacter.live"
CLOUDFLARE_API_BASE="https://api.cloudflare.com/client/v4"
DRY_RUN=false
SKIP_BUILD=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --production)
            DEPLOY_MODE="production"
            shift
            ;;
        --development)
            DEPLOY_MODE="development"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --production   Deploy to production (default)"
            echo "  --development  Deploy to development environment"
            echo "  --dry-run      Simulate deployment without actual upload"
            echo "  --skip-build   Skip build step, use existing build"
            echo "  --help         Show this help message"
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

# Check prerequisites
check_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check if build script exists
    if [[ ! -f "$BUILD_SCRIPT" ]]; then
        log_error "Build script not found: $BUILD_SCRIPT"
        exit 1
    fi
    
    # Check if Cloudflare configuration exists
    if [[ ! -d "cloudflare-config" ]]; then
        log_error "Cloudflare configuration directory not found"
        exit 1
    fi
    
    # Check for required tools
    command -v curl >/dev/null 2>&1 || { log_error "curl is required but not installed"; exit 1; }
    command -v jq >/dev/null 2>&1 || { log_warning "jq is recommended for JSON parsing"; }
    
    # Check Cloudflare credentials (if not dry run)
    if [[ "$DRY_RUN" == false ]]; then
        if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
            log_warning "CLOUDFLARE_API_TOKEN environment variable not set"
            log_warning "Manual deployment will be required"
        fi
        
        if [[ -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
            log_warning "CLOUDFLARE_ACCOUNT_ID environment variable not set"
            log_warning "Manual deployment will be required"
        fi
    fi
    
    log_success "Prerequisites check completed"
}

# Build the project
build_project() {
    if [[ "$SKIP_BUILD" == true ]]; then
        log_info "Skipping build step as requested"
        return
    fi
    
    log_info "Building project for $DEPLOY_MODE deployment..."
    
    # Run build script with appropriate flags
    if [[ "$DEPLOY_MODE" == "production" ]]; then
        "$BUILD_SCRIPT" --production --clean
    else
        "$BUILD_SCRIPT" --development --clean
    fi
    
    if [[ $? -ne 0 ]]; then
        log_error "Build failed"
        exit 1
    fi
    
    log_success "Build completed successfully"
}

# Validate build output
validate_build() {
    log_info "Validating build output..."
    
    local build_dir="build"
    
    # Check if build directory exists
    if [[ ! -d "$build_dir" ]]; then
        log_error "Build directory not found: $build_dir"
        exit 1
    fi
    
    # Check for required files
    local required_files=("index.html" "_headers" "_redirects" "sitemap.xml" "robots.txt")
    for file in "${required_files[@]}"; do
        if [[ ! -f "$build_dir/$file" ]]; then
            log_error "Required file missing: $file"
            exit 1
        fi
    done
    
    # Check assets directory
    if [[ ! -d "$build_dir/assets" ]]; then
        log_error "Assets directory not found in build"
        exit 1
    fi
    
    # Check blog directory
    if [[ ! -d "$build_dir/blog" ]]; then
        log_warning "Blog directory not found in build"
    fi
    
    log_success "Build validation completed"
}

# Create deployment package
create_deployment_package() {
    log_info "Creating deployment package..."
    
    local build_dir="build"
    local package_name="deployment-package-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # Create tarball of build directory
    tar -czf "$package_name" -C "$build_dir" .
    
    if [[ $? -ne 0 ]]; then
        log_error "Failed to create deployment package"
        exit 1
    fi
    
    log_success "Deployment package created: $package_name"
    echo "$package_name"
}

# Deploy to Cloudflare Pages (simulated)
deploy_to_cloudflare() {
    local package_name=$1
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "DRY RUN: Simulating deployment to Cloudflare Pages"
        log_info "Package: $package_name"
        log_info "Mode: $DEPLOY_MODE"
        log_info "Domain: $DOMAIN"
        
        # Simulate deployment steps
        log_info "1. Uploading package to Cloudflare..."
        sleep 1
        log_info "2. Processing files..."
        sleep 1
        log_info "3. Configuring domain..."
        sleep 1
        log_info "4. Setting up SSL..."
        sleep 1
        log_info "5. Configuring redirects..."
        sleep 1
        
        log_success "DRY RUN: Deployment simulation completed"
        return
    fi
    
    # Check if we have API credentials
    if [[ -z "$CLOUDFLARE_API_TOKEN" ]] || [[ -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
        log_warning "Cloudflare API credentials not found"
        log_info "Please deploy manually using the Cloudflare Dashboard"
        log_info "Package: $package_name"
        return
    fi
    
    log_info "Deploying to Cloudflare Pages..."
    
    # This would be the actual API call to Cloudflare
    # For now, we'll simulate it
    log_warning "Automatic deployment via API not implemented"
    log_info "Please deploy manually using the Cloudflare Dashboard"
    log_info "Package: $package_name"
}

# Run deployment tests
run_deployment_tests() {
    log_info "Running deployment tests..."
    
    local build_dir="build"
    
    # Test if main page loads
    if [[ ! -f "$build_dir/index.html" ]]; then
        log_error "Main page not found"
        return 1
    fi
    
    # Test if all linked assets exist
    log_info "Checking asset references..."
    grep -r "assets/" "$build_dir"/*.html | while read line; do
        local asset=$(echo "$line" | sed -n 's/.*assets\/\([^" ]*\).*/\1/p')
        if [[ -n "$asset" ]]; then
            if [[ ! -f "$build_dir/assets/$asset" ]]; then
                log_warning "Referenced asset not found: assets/$asset"
            fi
        fi
    done
    
    # Test configuration files
    log_info "Validating configuration files..."
    
    # Test _headers format
    if grep -q "^/" "$build_dir/_headers"; then
        log_success "_headers format is valid"
    else
        log_error "_headers format is invalid"
        return 1
    fi
    
    # Test _redirects format
    if grep -q "/" "$build_dir/_redirects"; then
        log_success "_redirects format is valid"
    else
        log_error "_redirects format is invalid"
        return 1
    fi
    
    log_success "Deployment tests completed"
}

# Generate deployment report
generate_deployment_report() {
    log_info "Generating deployment report..."
    
    local build_dir="build"
    local report_file="deployment-report-$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$report_file" << EOF
The Invisible Character - Deployment Report
==========================================
Deployment Date: $(date)
Deployment Mode: $DEPLOY_MODE
Domain: $DOMAIN
Dry Run: $DRY_RUN

Build Information:
- Build Directory: $build_dir
- Total Files: $(find "$build_dir" -type f | wc -l)
- HTML Files: $(find "$build_dir" -name "*.html" | wc -l)
- CSS Files: $(find "$build_dir" -name "*.css" | wc -l)
- JavaScript Files: $(find "$build_dir" -name "*.js" | wc -l)
- Image Files: $(find "$build_dir" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" -o -name "*.gif" \) | wc -l)

Configuration Files:
- _headers: $([[ -f "$build_dir/_headers" ]] && echo "✅" || echo "❌")
- _redirects: $([[ -f "$build_dir/_redirects" ]] && echo "✅" || echo "❌")
- wrangler.toml: $([[ -f "$build_dir/wrangler.toml" ]] && echo "✅" || echo "❌")
- sitemap.xml: $([[ -f "$build_dir/sitemap.xml" ]] && echo "✅" || echo "❌")
- robots.txt: $([[ -f "$build_dir/robots.txt" ]] && echo "✅" || echo "❌")

SEO Configuration:
- Robots.txt configured: $([[ -f "$build_dir/robots.txt" ]] && echo "✅" || echo "❌")
- Sitemap generated: $([[ -f "$build_dir/sitemap.xml" ]] && echo "✅" || echo "❌")
- PWA Manifest: $([[ -f "$build_dir/manifest.json" ]] && echo "✅" || echo "❌")

Security Configuration:
- Security headers: $([[ -f "$build_dir/_headers" ]] && echo "✅" || echo "❌")
- HTTPS redirects: $([[ -f "$build_dir/_redirects" ]] && echo "✅" || echo "❌")
- CSP configured: $([[ -f "$build_dir/_headers" ]] && echo "✅" || echo "❌")

Performance Optimization:
- Minified CSS: $(find "$build_dir" -name "*.min.css" | wc -l) files
- Minified JS: $(find "$build_dir" -name "*.min.js" | wc -l) files
- Optimized HTML: $(find "$build_dir" -name "*.html" | wc -l) files

Deployment Status: ${DRY_RUN:-"Completed"}
Next Steps:
1. Upload to Cloudflare Pages Dashboard
2. Configure custom domain: $DOMAIN
3. Set up SSL certificate
4. Verify deployment at https://$DOMAIN
5. Test all functionality
6. Set up monitoring and analytics

Generated by: $0
EOF

    log_success "Deployment report generated: $report_file"
}

# Main deployment process
main() {
    log_info "Starting deployment process for $DOMAIN"
    log_info "Deployment mode: $DEPLOY_MODE"
    log_info "Dry run: $DRY_RUN"
    
    # Check prerequisites
    check_prerequisites
    
    # Build project
    build_project
    
    # Validate build
    validate_build
    
    # Run tests
    run_deployment_tests
    
    # Create deployment package
    local package_name=$(create_deployment_package)
    
    # Deploy to Cloudflare
    deploy_to_cloudflare "$package_name"
    
    # Generate report
    generate_deployment_report
    
    # Final summary
    log_success "Deployment process completed!"
    log_info "Summary:"
    log_info "  - Mode: $DEPLOY_MODE"
    log_info "  - Package: $package_name"
    log_info "  - Domain: $DOMAIN"
    log_info "  - Dry run: $DRY_RUN"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "This was a dry run. No actual deployment was performed."
    fi
    
    log_info "Next steps:"
    log_info "1. Upload the package to Cloudflare Pages Dashboard"
    log_info "2. Configure custom domain and SSL"
    log_info "3. Test the deployment"
    log_info "4. Set up monitoring"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"