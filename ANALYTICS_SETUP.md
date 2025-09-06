# Google Analytics and Search Console Configuration
# For theinvisiblecharacter.live

## Google Analytics Setup

### Tracking Code Installation
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_MEASUREMENT_ID', {
    'custom_map': {
      'dimension1': 'page_type',
      'dimension2': 'language',
      'dimension3': 'tool_category'
    }
  });
  
  // Enhanced ecommerce tracking
  gtag('config', 'GA_MEASUREMENT_ID', {
    'send_page_view': true,
    'anonymize_ip': true,
    'cookie_expires': 31536000, // 1 year
    'cookie_domain': 'theinvisiblecharacter.live',
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>

### Event Tracking Configuration
<script>
// Tool usage events
function trackToolUsage(toolName, category) {
  gtag('event', 'tool_usage', {
    'event_category': category || 'tools',
    'event_label': toolName,
    'page_type': 'tool_page',
    'language': 'en'
  });
}

// Copy button tracking
function trackCopyButton(buttonType) {
  gtag('event', 'copy_click', {
    'event_category': 'interaction',
    'event_label': buttonType,
    'page_type': 'tool_page'
  });
}

// Navigation tracking
function trackNavigation(destination) {
  gtag('event', 'navigation_click', {
    'event_category': 'navigation',
    'event_label': destination,
    'page_type': 'navigation'
  });
}

// Language switch tracking
function trackLanguageChange(fromLang, toLang) {
  gtag('event', 'language_change', {
    'event_category': 'user_interaction',
    'event_label': `${fromLang}_to_${toLang}`,
    'page_type': 'language_switch'
  });
}

// Form submission tracking
function trackFormSubmission(formType) {
  gtag('event', 'form_submission', {
    'event_category': 'forms',
    'event_label': formType,
    'page_type': 'contact_page'
  });
}

// Blog engagement tracking
function trackBlogEngagement(postTitle, engagementType) {
  gtag('event', 'blog_engagement', {
    'event_category': 'blog',
    'event_label': postTitle,
    'engagement_type': engagementType,
    'page_type': 'blog_post'
  });
}

// Search tracking
function trackSearchQuery(query, resultsCount) {
  gtag('event', 'site_search', {
    'event_category': 'search',
    'event_label': query,
    'results_count': resultsCount,
    'page_type': 'search_results'
  });
}
</script>

## Google Search Console Setup

### Meta Tags for Verification
<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE">

### Structured Data Markup
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Invisible Character",
  "url": "https://theinvisiblecharacter.live",
  "description": "Generate and copy invisible characters for various platforms including Fortnite, Instagram, WhatsApp, and more",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://theinvisiblecharacter.live/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "author": {
    "@type": "Organization",
    "name": "The Invisible Character Team"
  },
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "license": "https://theinvisiblecharacter.live/terms-of-service.html"
}
</script>

### Organization Schema
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Invisible Character",
  "url": "https://theinvisiblecharacter.live",
  "logo": "https://theinvisiblecharacter.live/assets/icons/logo.png",
  "description": "Free online tool for generating invisible characters for various platforms",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Global"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "availableLanguage": ["English", "French"]
  },
  "sameAs": [
    "https://twitter.com/theinvisiblecharacter",
    "https://github.com/theinvisiblecharacter"
  ]
}
</script>

### Software Application Schema
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "The Invisible Character Generator",
  "url": "https://theinvisiblecharacter.live",
  "applicationCategory": "ToolApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Generate invisible characters",
    "Copy to clipboard functionality",
    "Multiple platform support",
    "Mobile responsive design"
  ],
  "inLanguage": ["English", "French"],
  "author": {
    "@type": "Organization",
    "name": "The Invisible Character Team"
  }
}
</script>

## Open Graph Tags

### Standard Open Graph Tags
<meta property="og:title" content="The Invisible Character - Generate Invisible Characters">
<meta property="og:description" content="Free online tool to generate invisible characters for Fortnite, Instagram, WhatsApp and more. Copy invisible text with one click.">
<meta property="og:url" content="https://theinvisiblecharacter.live">
<meta property="og:type" content="website">
<meta property="og:image" content="https://theinvisiblecharacter.live/assets/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="The Invisible Character">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="fr_FR">

### Twitter Card Tags
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@theinvisiblecharacter">
<meta name="twitter:creator" content="@theinvisiblecharacter">
<meta name="twitter:title" content="The Invisible Character - Generate Invisible Characters">
<meta name="twitter:description" content="Free online tool to generate invisible characters for Fortnite, Instagram, WhatsApp and more. Copy invisible text with one click.">
<meta name="twitter:image" content="https://theinvisiblecharacter.live/assets/images/twitter-card.jpg">
<meta name="twitter:image:alt" content="The Invisible Character Tool Interface">

## Additional SEO Tags

### Additional Meta Tags
<link rel="canonical" href="https://theinvisiblecharacter.live">
<link rel="alternate" hreflang="en" href="https://theinvisiblecharacter.live">
<link rel="alternate" hreflang="fr" href="https://theinvisiblecharacter.live/index-fr.html">
<link rel="alternate" hreflang="x-default" href="https://theinvisiblecharacter.live">

### PWA Manifest
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
<link rel="apple-touch-icon" sizes="512x512" href="/assets/icons/icon-512.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="The Invisible Character">
<meta name="theme-color" content="#3b82f6">
<meta name="msapplication-TileColor" content="#3b82f6">
<meta name="msapplication-config" content="/browserconfig.xml">

## Implementation Instructions

### For Each HTML Page
1. Copy the Google Analytics script to the `<head>` section
2. Add the appropriate structured data for the page type
3. Update Open Graph tags with page-specific content
4. Add canonical URL and hreflang tags
5. Include the event tracking functions in the JavaScript

### For Blog Posts
1. Add Article schema to each blog post
2. Update Open Graph tags with post-specific content
3. Add breadcrumbs structured data
4. Include publication date and author information

### For Tool Pages
1. Add SoftwareApplication schema
2. Include tool-specific event tracking
3. Add HowTo schema if applicable
4. Include usage instructions structured data

## Monitoring and Maintenance

### Google Analytics Setup
1. Create a Google Analytics 4 property
2. Set up the measurement ID (GA_MEASUREMENT_ID)
3. Configure custom dimensions as needed
4. Set up goals and conversions
5. Create dashboards for key metrics

### Search Console Setup
1. Add the property to Google Search Console
2. Verify ownership using the meta tag
3. Submit the sitemap
4. Monitor indexing status
5. Set up email alerts for issues

### Regular Tasks
- Monitor Google Analytics for unusual traffic patterns
- Check Search Console for indexing issues
- Update sitemap when adding new content
- Monitor Core Web Vitals
- Check for broken links regularly

## Security Considerations

### Data Privacy
- Anonymize IP addresses in Google Analytics
- Enable cookie consent banner if required
- Respect Do Not Track requests
- Provide opt-out options

### Performance
- Load analytics scripts asynchronously
- Use local caching where possible
- Minimize the impact on page load times
- Consider using Google Tag Manager for better management

## Configuration File

Create a file `analytics-config.json` in the project root:
```json
{
  "google_analytics": {
    "measurement_id": "GA_MEASUREMENT_ID",
    "anonymize_ip": true,
    "cookie_domain": "theinvisiblecharacter.live",
    "custom_dimensions": {
      "page_type": 1,
      "language": 2,
      "tool_category": 3
    }
  },
  "search_console": {
    "verification_code": "YOUR_VERIFICATION_CODE",
    "site_url": "https://theinvisiblecharacter.live"
  },
  "social": {
    "twitter_handle": "@theinvisiblecharacter",
    "facebook_app_id": "YOUR_FACEBOOK_APP_ID"
  }
}
```