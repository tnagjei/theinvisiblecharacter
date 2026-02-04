#!/bin/bash

# Production Build Script for TheInvisibleCharacter.live
# Enhanced for Cloudflare Pages deployment
# Usage: ./build.sh [--production|--development|--clean]

set -e  # Exit on any error

# Configuration
BUILD_MODE="production"
BUILD_DIR="build"
SOURCE_DIR="."
DOMAIN="theinvisiblecharacter.live"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --production)
            BUILD_MODE="production"
            shift
            ;;
        --development)
            BUILD_MODE="development"
            shift
            ;;
        --clean)
            echo "🧹 Cleaning previous builds..."
            rm -rf "$BUILD_DIR"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --production   Build for production (default)"
            echo "  --development  Build for development"
            echo "  --clean        Clean previous builds before building"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            # Unknown option
            ;;
    esac
done

echo "🚀 Starting $BUILD_MODE build for $DOMAIN..."
echo "⏰ Build started at: $(date)"

# Create build directory
mkdir -p "$BUILD_DIR"

# Copy all necessary files to build directory
echo "📦 Copying files to build directory..."
cp -r "$SOURCE_DIR"/*.html "$BUILD_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/assets "$BUILD_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/blog "$BUILD_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/robots.txt "$BUILD_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/sitemap.xml "$BUILD_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/sw.js "$BUILD_DIR/" 2>/dev/null || true

# Navigate to build directory
cd "$BUILD_DIR"

# Create backup directory
mkdir -p "backup_$TIMESTAMP"

# Function to optimize HTML file
optimize_html() {
    local file=$1
    local mode=$2
    
    echo "🔧 Optimizing $file..."
    
    # Create backup
    cp "$file" "backup_$TIMESTAMP/$(basename "$file").bak"
    
    if [[ "$mode" == "production" ]]; then
        # Production optimization - aggressive minification
        sed -e 's/<!--.*-->//g' \
            -e 's/^[ \t]*//' \
            -e 's/[ \t]*$//' \
            -e 's/>[ \t]*</></g' \
            -e '/^$/d' \
            -e 's/  / /g' \
            "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    else
        # Development optimization - preserve formatting
        sed -e 's/<!-- DEBUG .*-->//g' \
            -e 's/^[ \t]*//' \
            -e 's/[ \t]*$//' \
            "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    fi
}

# Function to minify CSS
minify_css() {
    local file=$1
    local mode=$2
    
    if [[ ! -f "$file" ]] || [[ "$file" =~ \.min\.css$ ]]; then
        return
    fi
    
    echo "🎨 Minifying $(basename "$file")..."
    
    if [[ "$mode" == "production" ]]; then
        # Production minification
        sed -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            -e 's/\s\s*/ /g' \
            -e 's/;\s*}/}/g' \
            -e 's/,\s*/,/g' \
            -e 's/:\s*/:/g' \
            -e 's/{\s*/{/g' \
            -e 's/}\s*/}/g' \
            -e '/^$/d' \
            "$file" > "${file%.css}.min.css"
    else
        # Development - just remove comments
        sed -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            "$file" > "${file%.css}.min.css"
    fi
}

# Function to minify JavaScript
minify_js() {
    local file=$1
    local mode=$2
    
    if [[ ! -f "$file" ]] || [[ "$file" =~ \.min\.js$ ]]; then
        return
    fi
    
    echo "⚡ Minifying $(basename "$file")..."
    
    if [[ "$mode" == "production" ]]; then
        # Production minification
        sed -e 's/\/\/.*$//' \
            -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            -e 's/\s\s*/ /g' \
            -e 's/;\s*}/}/g' \
            -e 's/,\s*/,/g' \
            -e 's/\s*([+-=])\s*/\1/g' \
            -e '/^$/d' \
            "$file" > "${file%.js}.min.js"
    else
        # Development - just remove comments
        sed -e 's/\/\/.*$//' \
            -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            "$file" > "${file%.js}.min.js"
    fi
}

# Optimize all HTML files
echo "📄 Optimizing HTML files..."
find . -name "*.html" -not -path "./backup_*/ *" | while read file; do
    optimize_html "$file" "$BUILD_MODE"
done

# Minify CSS files
echo "🎨 Minifying CSS files..."
find assets/css -name "*.css" -not -name "*.min.css" 2>/dev/null | while read file; do
    minify_css "$file" "$BUILD_MODE"
done

# Minify JavaScript files
echo "⚡ Minifying JavaScript files..."
find assets/js -name "*.js" -not -name "*.min.js" 2>/dev/null | while read file; do
    minify_js "$file" "$BUILD_MODE"
done

# Update HTML to use minified versions
echo "🔗 Updating HTML references..."
if [[ "$BUILD_MODE" == "production" ]]; then
    find . -name "*.html" -not -path "./backup_*/ *" \
        -exec sed -i '' 's/assets\/css\/\([^.]*\)\.css/assets\/css\/\1.min.css/g' {} \;
    
    find . -name "*.html" -not -path "./backup_*/ *" \
        -exec sed -i '' 's/assets\/js\/\([^.]*\)\.js/assets\/js\/\1.min.js/g' {} \;
fi

# Copy Cloudflare configuration files
echo "📋 Copying Cloudflare Pages configuration..."
cp -r "../cloudflare-config/_headers" "./" 2>/dev/null || true
cp -r "../cloudflare-config/_redirects" "./" 2>/dev/null || true
cp -r "../cloudflare-config/wrangler.toml" "./" 2>/dev/null || true

# Generate enhanced sitemap.xml
echo "🗺️ Generating enhanced sitemap..."
cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://$DOMAIN/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/about</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/help</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/tools</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/privacy-policy</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/terms-of-service</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fortnite-invisible-name</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/instagram-invisible-characters</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/whatsapp-invisible-messages</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/technical-guide-invisible-characters</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <!-- French pages -->
    <url>
        <loc>https://$DOMAIN/index-fr</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/about-fr</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/help-fr</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fr/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fr/fortnite-nom-invisible</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fr/instagram-caracteres-invisibles</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fr/whatsapp-messages-invisibles</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://$DOMAIN/blog/fr/guide-technique-caracteres-invisibles</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
EOF

# Enhanced robots.txt
cat > robots.txt << EOF
User-agent: *
Allow: /
Sitemap: https://$DOMAIN/sitemap.xml

# Crawl delay to be respectful
Crawl-delay: 1

# Block irrelevant bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Block admin areas (if any)
Disallow: /admin/
Disallow: /_headers
Disallow: /_redirects

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
EOF

# Create manifest.json for PWA
cat > manifest.json << EOF
{
  "name": "The Invisible Character",
  "short_name": "Invisible Char",
  "description": "Generate and copy invisible characters for various platforms",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Calculate and display file size comparison
echo "📊 File size analysis:"
echo "=== CSS Files ==="
if ls ../assets/css/*.css 1> /dev/null 2>&1; then
    echo "Before:"
    du -sh ../assets/css/*.css 2>/dev/null | sort -hr
fi
if ls assets/css/*.min.css 1> /dev/null 2>&1; then
    echo "After:"
    du -sh assets/css/*.min.css 2>/dev/null | sort -hr
fi

echo ""
echo "=== JavaScript Files ==="
if ls ../assets/js/*.js 1> /dev/null 2>&1; then
    echo "Before:"
    du -sh ../assets/js/*.js 2>/dev/null | sort -hr
fi
if ls assets/js/*.min.js 1> /dev/null 2>&1; then
    echo "After:"
    du -sh assets/js/*.min.js 2>/dev/null | sort -hr
fi

# Create comprehensive build info
cat > build-info.txt << EOF
The Invisible Character - Build Information
==========================================
Build Date: $(date)
Build Mode: $BUILD_MODE
Build Version: 1.0.0
Build ID: $TIMESTAMP
Domain: $DOMAIN

Optimization Summary:
- HTML Files Optimized: $(find . -name "*.html" -not -path "./backup_*/ *" | wc -l)
- CSS Files Minified: $(ls assets/css/*.min.css 2>/dev/null | wc -l)
- JavaScript Files Minified: $(ls assets/js/*.min.js 2>/dev/null | wc -l)
- Total Files Processed: $(find . -type f -not -path "./backup_*/ *" | wc -l)

Files Included:
- Main Pages: $(find . -maxdepth 1 -name "*.html" | wc -l)
- Blog Pages: $(find blog/ -name "*.html" 2>/dev/null | wc -l)
- Assets: $(find assets/ -type f 2>/dev/null | wc -l)
- Configuration: 3 (_headers, _redirects, wrangler.toml)

Cloudflare Pages Ready:
✅ Static assets optimized
✅ Security headers configured
✅ Redirect rules applied
✅ SEO files generated
✅ PWA manifest created

Build completed successfully!
EOF

# Remove backup directory in production mode
if [[ "$BUILD_MODE" == "production" ]]; then
    rm -rf "backup_$TIMESTAMP"
fi

# Final summary
echo ""
echo "✅ Build completed successfully!"
echo "📁 Build directory: $(pwd)"
echo "🎯 Build mode: $BUILD_MODE"
echo "🌐 Domain: $DOMAIN"
echo "⏰ Build completed at: $(date)"
echo ""
echo "📋 Build Summary:"
echo "   - HTML files: $(find . -name "*.html" -not -path "./backup_*/ *" | wc -l)"
echo "   - CSS files minified: $(ls assets/css/*.min.css 2>/dev/null | wc -l)"
echo "   - JS files minified: $(ls assets/js/*.min.js 2>/dev/null | wc -l)"
echo "   - Total files: $(find . -type f -not -path "./backup_*/ *" | wc -l)"
echo ""
echo "🚀 Ready for deployment to Cloudflare Pages!"
echo ""
echo "Next steps:"
echo "1. Configure Cloudflare Pages with:"
echo "   - Build command: './build.sh --production'"
echo "   - Build output directory: 'build'"
echo "   - Root directory: '/'"
echo "2. Set up custom domain: $DOMAIN"
echo "3. Configure SSL certificate"
echo "4. Set up analytics and monitoring"
echo ""
echo "For manual deployment:"
echo "1. Upload the '$BUILD_DIR' directory contents to Cloudflare Pages"
echo "2. Ensure _headers and _redirects files are in the root"
echo "3. Test all links and functionality"