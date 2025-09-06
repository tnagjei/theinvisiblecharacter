# Cloudflare Pages Configuration for TheInvisibleCharacter.live

## Build Configuration

### Build Command
```bash
#!/bin/bash
# Build script for Cloudflare Pages

echo "Starting build process..."

# Install dependencies if needed
# npm install

# Run optimization script
if [ -f "optimize-all.sh" ]; then
    chmod +x optimize-all.sh
    ./optimize-all.sh
fi

# Minify CSS files
echo "Minifying CSS files..."
for css_file in assets/css/*.css; do
    if [[ -f "$css_file" && ! "$css_file" =~ \.min\.css$ ]]; then
        echo "Minifying $css_file..."
        # Simple minification using sed (for production, use cssnano)
        sed -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            -e 's/\s\s*/ /g' \
            -e '/^$/d' \
            "$css_file" > "${css_file%.css}.min.css"
    fi
done

# Minify JavaScript files
echo "Minifying JavaScript files..."
for js_file in assets/js/*.js; do
    if [[ -f "$js_file" && ! "$js_file" =~ \.min\.js$ ]]; then
        echo "Minifying $js_file..."
        # Simple minification (for production, use terser)
        sed -e 's/\/\/.*$//' \
            -e 's/\/\*.*\*\///g' \
            -e 's/^\s*//' \
            -e 's/\s*$//' \
            -e 's/\s\s*/ /g' \
            -e '/^$/d' \
            "$js_file" > "${js_file%.js}.min.js"
    fi
done

# Update HTML to use minified versions
echo "Updating HTML to use minified assets..."
find . -name "*.html" -not -path "./backup/*" -not -path "./performance-results/*" \
    -exec sed -i '' 's/assets\/css\/\([^.]*\)\.css/assets\/css\/\1.min.css/g' {} \;

find . -name "*.html" -not -path "./backup/*" -not -path "./performance-results/*" \
    -exec sed -i '' 's/assets\/js\/\([^.]*\)\.js/assets\/js\/\1.min.js/g' {} \;

echo "Build complete!"
```

### Build Settings in Cloudflare Pages Dashboard:
- **Build command:** `./build.sh`
- **Build output directory:** `/` (root directory)
- **Node.js version:** `18` (if using npm)

## _headers File for Cache Control
Create `_headers` file in root directory:

```
# Cache static assets for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# Cache HTML files for 5 minutes
*.html
  Cache-Control: public, max-age=300, stale-while-revalidate=60

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  
# Enable Brotli compression
  Content-Encoding: br
```

## _redirects File for Clean URLs
Create `_redirects` file in root directory:

```
# Language redirects
/index-fr.html /fr/ 302
/about-fr.html /fr/about 302
/help-fr.html /fr/help 302

# Blog redirects
/blog/index.html /blog/ 302
/blog/fr/index.html /fr/blog/ 302

# Clean URLs
/about.html /about 302
/help.html /help 302
/tools.html /tools 302
/privacy-policy.html /privacy 302
/terms-of-service.html /terms 302

# 404 handler
/* /404.html 404
```

## Environment Variables
Set these in Cloudflare Pages environment variables:

```
NODE_ENV=production
API_URL=https://api.theinvisiblecharacter.live
ANALYTICS_ID=your-analytics-id
```

## Functions Directory (Optional)
Create `functions` directory for edge functions:

```
functions/
├── api/
│   └── characters.js
└── utils/
    └── cors.js
```

Example edge function (`functions/api/characters.js`):
```javascript
export async function onRequest(context) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        // Your API logic here
        return new Response(JSON.stringify({ data: [] }), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}
```

## Wrangler Configuration (Optional)
Create `wrangler.toml` for advanced configuration:

```toml
name = "theinvisiblecharacter"
type = "webpack"
account_id = "your-account-id"
workers_dev = true

[build]
command = "npm run build"

[build.upload]
format = "modules"
dir = "dist"

[[redirects]]
from = "/api/*"
to = "/api/index.js"
status = 200

[[headers]]
for = "/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

## Deployment Script
Create `deploy.sh` for easy deployment:

```bash
#!/bin/bash
echo "Deploying to Cloudflare Pages..."

# Ensure all files are optimized
./optimize-all.sh

# Run tests if available
if [ -f "test-performance.sh" ]; then
    echo "Running performance tests..."
    ./test-performance.sh
fi

# Deploy using Wrangler (if configured)
if command -v wrangler &> /dev/null; then
    wrangler pages deploy . --project-name=theinvisiblecharacter
else
    echo "Deploy through Cloudflare dashboard:"
    echo "1. Connect your GitHub repository"
    echo "2. Set build command to './build.sh'"
    echo "3. Set output directory to '/'"
    echo "4. Deploy!"
fi

echo "Deployment complete!"
```

## Performance Monitoring

After deployment, monitor performance using:

1. **Cloudflare Analytics**
   - Real-time visitor analytics
   - Performance metrics
   - Security insights

2. **Google PageSpeed Insights**
   - Regular performance audits
   - Core Web Vitals tracking
   - Mobile optimization reports

3. **Web Vitals Tracking**
   Add to your JavaScript:
   ```javascript
   // Track Core Web Vitals
   const webVitals = {
       FCP: 0,
       LCP: 0,
       FID: 0,
       CLS: 0,
       TTFB: 0
   };
   
   // Send to analytics
   function sendToAnalytics(metric) {
       // Send to your analytics service
       console.log('Performance metric:', metric);
   }
   ```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test language switching (EN/FR)
- [ ] Test all tools functionality
- [ ] Verify mobile responsiveness
- [ ] Check Core Web Vitals scores
- [ ] Test form submissions
- [ ] Verify social media sharing
- [ ] Test 404 page
- [ ] Check SSL certificate
- [ ] Verify caching headers
- [ ] Test offline functionality (if PWA)

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check file permissions
   - Verify build command syntax
   - Check for missing dependencies

2. **Styles Not Loading**
   - Verify CSS file paths
   - Check MIME types in _headers
   - Clear browser cache

3. **JavaScript Errors**
   - Check console for errors
   - Verify file paths
   - Check for syntax errors

4. **Poor Performance**
   - Run Lighthouse audit
   - Check for render-blocking resources
   - Verify caching headers

## Support

For Cloudflare Pages support:
- Documentation: https://developers.cloudflare.com/pages/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/