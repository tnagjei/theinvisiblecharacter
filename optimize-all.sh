#!/bin/bash

# Performance Optimization Script for TheInvisibleCharacter.live
# This script optimizes all HTML files for better performance

echo "Starting performance optimization for all pages..."

# Create backup directory
mkdir -p backup

# Function to optimize HTML file
optimize_html() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "Optimizing $filename..."
    
    # Create backup
    cp "$file" "backup/$filename.bak"
    
    # Apply optimizations using sed
    # 1. Add preconnect and DNS prefetch
    sed -i '' '/<head>/a\
    <!-- Preconnect to external domains -->\
    <link rel="preconnect" href="https://cdn.tailwindcss.com">\
    <link rel="preconnect" href="https://fonts.googleapis.com">\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
    \
    <!-- DNS Prefetch -->\
    <link rel="dns-prefetch" href="//cdn.tailwindcss.com">\
    <link rel="dns-prefetch" href="//fonts.googleapis.com">\
    <link rel="dns-prefetch" href="//fonts.gstatic.com">' "$file"
    
    # 2. Make CSS async
    sed -i '' 's|<link rel="stylesheet" href="assets/css/mobile-optimization.css">|<link rel="stylesheet" href="assets/css/mobile-optimization.css" media="print" onload="this.media='\''all'\''">|g' "$file"
    
    # 3. Add defer to non-critical JS
    sed -i '' 's|<script src="assets/js/|<script defer src="assets/js/|g' "$file"
    
    # 4. Add critical CSS (simplified version)
    sed -i '' '/<head>/a\
    <!-- Critical CSS Inlined -->\
    <style>\
        *{margin:0;padding:0;box-sizing:border-box}html{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;line-height:1.5;-webkit-text-size-adjust:100%}body{background-color:#fff;color:#1d1d1f;transition:background-color .3s,color .3s}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.bg-white{background-color:#fff}.dark\\:bg-apple-gray-900:is(.dark *){background-color:#000}.text-apple-gray-900{color:#1d1d1f}.dark\\:text-white:is(.dark *){color:#fff}.font-sf{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.transition-colors{transition-property:background-color,border-color,text-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s}.duration-300{transition-duration:.3s}.pt-16{padding-top:4rem}.min-h-screen{min-height:100vh}.flex{display:flex}.items-center{align-items:center}.justify-center{justify-content:center}.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}.from-apple-gray-50{--tw-gradient-from:#fafafa;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(250,250,250,0))}.to-white{--tw-gradient-to:#fff}.dark\\:from-apple-gray-900:is(.dark *){--tw-gradient-from:#000;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(0,0,0,0))}.dark\\:to-apple-gray-800:is(.dark *){--tw-gradient-to:#1d1d1f}.max-w-7xl{max-width:80rem}.mx-auto{margin-left:auto;margin-right:auto}.px-4{padding-left:1rem;padding-right:1rem}.sm\\:px-6:is(.sm *){padding-left:1.5rem;padding-right:1.5rem}.lg\\:px-8:is(.lg *){padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.py-20{padding-top:5rem;padding-bottom:5rem}.text-5xl{font-size:3rem}.md\\:text-7xl:is(.md *){font-size:4.5rem}.font-bold{font-weight:700}.mb-6{margin-bottom:1.5rem}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.text-transparent{color:transparent}.text-xl{font-size:1.25rem}.md\\:text-2xl:is(.md *){font-size:1.5rem}.text-apple-gray-600{color:#6e6e73}.dark\\:text-apple-gray-300:is(.dark *){color:#d1d1d6}.mb-8{margin-bottom:2rem}.max-w-3xl{max-width:48rem}.flex-col{flex-direction:column}.sm\\:flex-row:is(.sm *){flex-direction:row}.gap-4{gap:1rem}.mb-8{margin-bottom:2rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:px-8:is(.sm *){padding-left:2rem;padding-right:2rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.sm\\:py-4:is(.sm *){padding-top:1rem;padding-bottom:1rem}.bg-apple-gray-900{background-color:#000}.text-white{color:#fff}.rounded-xl{border-radius:.75rem}.hover\\:bg-apple-gray-800:hover{background-color:#1d1d1f}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05}.font-medium{font-weight:500}.text-base{font-size:1rem}.sm\\:text-lg:is(.sm *){font-size:1.125rem}.border{border-width:1px}.border-apple-gray-300{border-color:#d1d1d6}.dark\\:border-apple-gray-600:is(.dark *){border-color:#48484a}.hover\\:bg-apple-gray-100:hover{background-color:#f5f5f7}.dark\\:hover\\:bg-apple-gray-800:is(.dark *):hover{background-color:#1d1d1f}.flex-wrap{flex-wrap:wrap}.justify-center{justify-content:center}.gap-8{gap:2rem}.text-sm{font-size:.875rem}.dark\\:text-apple-gray-400:is(.dark *){color:#a1a1a6}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.w-4{width:1rem}.h-4{height:1rem}.fill-current{fill:currentColor}.animate-fade-in{animation:fadeIn .5s ease-in-out}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}\
    </style>' "$file"
    
    # 5. Add preload for critical resources
    sed -i '' '/<head>/a\
    <!-- Preload critical resources -->\
    <link rel="preload" href="assets/css/theme.css" as="style" onload="this.onload=null;this.rel='\''stylesheet'\''">\
    <link rel="preload" href="assets/css/style.css" as="style" onload="this.onload=null;this.rel='\''stylesheet'\''">\
    <link rel="preload" href="assets/js/theme.js" as="script">' "$file"
    
    # 6. Make Tailwind async
    sed -i '' 's|<script src="https://cdn.tailwindcss.com"></script>|<script src="https://cdn.tailwindcss.com" async></script>|g' "$file"
    
    # 7. Add no-JS fallback
    sed -i '' '/<\/head>/i\
    <!-- No-JS fallback -->\
    <noscript>\
        <link rel="stylesheet" href="assets/css/theme.css">\
        <link rel="stylesheet" href="assets/css/style.css">\
        <link rel="stylesheet" href="assets/css/mobile-optimization.css">\
    </noscript>' "$file"
    
    echo "✓ Optimized $filename"
}

# Optimize all HTML files in root directory
for file in *.html; do
    if [[ "$file" != "test.html" && "$file" != "mobile-test.html" ]]; then
        optimize_html "$file"
    fi
done

# Optimize HTML files in blog directory
for file in blog/*.html; do
    optimize_html "$file"
done

# Optimize HTML files in blog/fr directory
for file in blog/fr/*.html; do
    optimize_html "$file"
done

echo "All pages have been optimized!"
echo "Backups are stored in the backup/ directory"

# Create optimized CSS and JS files
echo "Creating optimized CSS and JS files..."

# Minify CSS files
for css_file in assets/css/*.css; do
    if [[ -f "$css_file" ]]; then
        echo "Minifying $css_file..."
        # Remove comments and extra whitespace
        sed -e 's/\/\*.*\*\///g' -e 's/^\s*//' -e 's/\s*$//' -e 's/\s\s*/ /g' -e '/^$/d' "$css_file" > "${css_file%.css}.min.css"
    fi
done

# Create optimized build script
cat > build.sh << 'EOF'
#!/bin/bash
# Build script for production deployment

echo "Building for production..."

# Minify all CSS
for css_file in assets/css/*.css; do
    if [[ -f "$css_file" && ! "$css_file" =~ \.min\.css$ ]]; then
        echo "Minifying $css_file..."
        cssnano "$css_file" "${css_file%.css}.min.css"
    fi
done

# Minify all JS
for js_file in assets/js/*.js; do
    if [[ -f "$js_file" && ! "$js_file" =~ \.min\.js$ ]]; then
        echo "Minifying $js_file..."
        terser "$js_file" -o "${js_file%.js}.min.js" --compress --mangle
    fi
done

# Update HTML to use minified versions
find . -name "*.html" -not -path "./backup/*" -exec sed -i '' 's/assets\/css\/\([^.]*\)\.css/assets\/css\/\1.min.css/g' {} \;
find . -name "*.html" -not -path "./backup/*" -exec sed -i '' 's/assets\/js\/\([^.]*\)\.js/assets\/js\/\1.min.js/g' {} \;

echo "Build complete!"
EOF

chmod +x build.sh

echo "Performance optimization complete!"
echo "Next steps:"
echo "1. Run './build.sh' to minify CSS and JS"
echo "2. Test all pages locally"
echo "3. Deploy to Cloudflare Pages"