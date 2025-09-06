# Cloudflare Pages 项目初始化脚本

#!/bin/bash

# The Invisible Character - Cloudflare Pages Setup Script
# This script helps initialize the project for Cloudflare Pages deployment

echo "🚀 Setting up The Invisible Character for Cloudflare Pages..."
echo "=============================================================="

# Check if we're in the right directory
if [ ! -f "prompt.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p assets/{css,js,icons,images/{platforms},fonts}
mkdir -p blog
mkdir -p pages
mkdir -p .well-known

# Copy Cloudflare configuration files
echo "⚙️  Copying Cloudflare configuration..."
cp cloudflare-config/_headers ./
cp cloudflare-config/_redirects ./

# Create placeholder files
echo "📄 Creating placeholder files..."

# Create index.html with basic structure
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Invisible Character - Copy Blank Space Characters (2025)</title>
    <meta name="description" content="Free online tool to copy invisible characters. Perfect for Instagram, Fortnite, TikTok, WhatsApp. No registration required.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="/assets/icons/favicon.ico">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">The Invisible Character</h1>
            <div class="bg-white p-8 rounded-lg shadow-lg">
                <div class="text-6xl mb-6 cursor-pointer hover:scale-110 transition-transform" onclick="copyCharacter()">‌</div>
                <button onclick="copyCharacter()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Copy Character
                </button>
                <p id="feedback" class="mt-4 text-green-600 opacity-0 transition-opacity">Copied!</p>
            </div>
        </div>
    </div>
    
    <script>
        function copyCharacter() {
            const invisibleChar = '‌';
            navigator.clipboard.writeText(invisibleChar).then(() => {
                const feedback = document.getElementById('feedback');
                feedback.style.opacity = '1';
                setTimeout(() => {
                    feedback.style.opacity = '0';
                }, 2000);
            });
        }
    </script>
</body>
</html>
EOF

# Create assets directory structure files
touch assets/css/custom.css
touch assets/js/main.js
touch assets/js/i18n.js

# Download ClipboardJS
echo "⬇️  Downloading ClipboardJS..."
curl -o assets/js/clipboard.min.js https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js

# Create robots.txt
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://theinvisiblecharacter.live/sitemap.xml
EOF

# Create sitemap.xml
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://theinvisiblecharacter.live/</loc>
        <lastmod>2025-01-06</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
EOF

# Create 404 page
cat > 404.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - The Invisible Character</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-300">404</h1>
        <h2 class="text-2xl font-semibold mt-4 mb-6">Page Not Found</h2>
        <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
        </a>
    </div>
</body>
</html>
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# System files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Cloudflare specific
.cloudflare/

# Logs
*.log

# Temporary files
*.tmp
*.temp

# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment variables
.env
.env.*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

# Create README
cat > README.md << 'EOF'
# The Invisible Character

A free online tool to copy invisible characters for social media and gaming platforms.

## Features

- ✅ One-click copy invisible character
- ✅ Works on Instagram, Fortnite, TikTok, WhatsApp
- ✅ No registration required
- ✅ Mobile-friendly
- ✅ Multi-language support (EN/FR)

## Tech Stack

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- ClipboardJS

## Deployment

This site is automatically deployed to Cloudflare Pages.

## License

© 2025 tangjei414
EOF

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init
git add .
git commit -m "Initial commit: The Invisible Character website setup

- Basic HTML structure
- Cloudflare Pages configuration
- Placeholder files created
- SEO optimization ready"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the generated files"
echo "2. Customize the content in index.html"
echo "3. Create a GitHub repository"
echo "4. Connect to Cloudflare Pages"
echo "5. Deploy your site"
echo ""
echo "Happy coding! 🎉"