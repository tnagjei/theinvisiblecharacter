/**
 * Performance Optimization Script
 * Handles lazy loading, resource optimization, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupResourceHints();
        this.setupPerformanceMonitoring();
        this.setupIntersectionObserver();
        this.setupServiceWorker();
        this.optimizeImages();
        this.setupCaching();
    }

    // Lazy loading for images and iframes
    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.src = element.dataset.src;
                        element.classList.add('loaded');
                        observer.unobserve(element);
                    }
                });
            });

            lazyElements.forEach(element => {
                imageObserver.observe(element);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyElements.forEach(element => {
                element.src = element.dataset.src;
                element.classList.add('loaded');
            });
        }
    }

    // Resource hints for better performance
    setupResourceHints() {
        // Preconnect to external domains
        const preconnectDomains = [
            'https://cdn.tailwindcss.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });

        // DNS prefetch for potential future connections
        const dnsPrefetchDomains = [
            'https://theinvisiblecharacter.live'
        ];

        dnsPrefetchDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor page load metrics
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const metrics = {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        pageLoad: perfData.loadEventEnd - perfData.loadEventStart,
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    };

                    // Log metrics for debugging
                    console.log('Performance Metrics:', metrics);

                    // Send to analytics if available
                    this.sendPerformanceMetrics(metrics);
                }, 0);
            });
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : 0;
    }

    sendPerformanceMetrics(metrics) {
        // This would typically send to your analytics service
        // For now, we'll just log it
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', {
                custom_parameter_1: metrics.domContentLoaded,
                custom_parameter_2: metrics.pageLoad,
                custom_parameter_3: metrics.firstPaint,
                custom_parameter_4: metrics.firstContentfulPaint
            });
        }
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe elements that should animate when visible
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    // Service Worker registration for offline support
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }
    }

    // Image optimization
    optimizeImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach(img => {
            // Add loading="lazy" to images that are not in the viewport
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            // Optimize images with WebP support
            this.optimizeImageFormat(img);
        });
    }

    optimizeImageFormat(img) {
        const src = img.src;
        if (src && !src.includes('data:')) {
            // Check if WebP is supported
            if (this.supportsWebP()) {
                // Replace image extensions with WebP if available
                const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                // You would need to implement actual WebP conversion on the server
                // img.src = webpSrc;
            }
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Setup caching strategies
    setupCaching() {
        // Cache common resources in localStorage
        this.cacheResources();
        
        // Setup request caching
        this.setupRequestCache();
    }

    cacheResources() {
        const cacheKey = 'tic_resources_cache';
        const cacheVersion = '1.0';
        
        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (!cachedData || JSON.parse(cachedData).version !== cacheVersion) {
                // Cache new data
                const dataToCache = {
                    version: cacheVersion,
                    timestamp: Date.now(),
                    resources: {
                        // Add any static resources that should be cached
                    }
                };
                
                localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            }
        } catch (error) {
            console.warn('Local storage caching failed:', error);
        }
    }

    setupRequestCache() {
        // Simple in-memory cache for API requests
        const requestCache = new Map();
        
        // Cache fetch requests
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            const cacheKey = typeof url === 'string' ? url : url.toString();
            
            // Check cache first
            if (requestCache.has(cacheKey)) {
                const cached = requestCache.get(cacheKey);
                if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                    return Promise.resolve(cached.response);
                }
            }
            
            // Make the request
            const response = await originalFetch.apply(this, args);
            
            // Cache the response
            requestCache.set(cacheKey, {
                response: response.clone(),
                timestamp: Date.now()
            });
            
            return response;
        };
    }

    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance optimization
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize scroll events
    optimizeScrollEvents() {
        const scrollHandler = this.throttle(() => {
            // Handle scroll events
            this.handleScroll();
        }, 16); // 60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Optimize resize events
    optimizeResizeEvents() {
        const resizeHandler = this.debounce(() => {
            // Handle resize events
            this.handleResize();
        }, 250);

        window.addEventListener('resize', resizeHandler);
    }

    handleResize() {
        // Handle responsive adjustments
        this.adjustLayoutForScreenSize();
    }

    adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        
        // Adjust layout based on screen size
        if (width < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // Memory optimization
    optimizeMemory() {
        // Clean up unused event listeners
        this.cleanupEventListeners();
        
        // Optimize large arrays
        this.optimizeArrays();
    }

    cleanupEventListeners() {
        // This would require tracking event listeners
        // For now, it's a placeholder for future implementation
    }

    optimizeArrays() {
        // Optimize large arrays by using typed arrays when possible
        // This is a placeholder for future optimization
    }

    // Network optimization
    optimizeNetwork() {
        // Setup network information monitoring
        this.setupNetworkMonitoring();
        
        // Optimize requests based on network conditions
        this.optimizeRequests();
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                this.adjustForNetworkConditions(connection);
            });
            
            this.adjustForNetworkConditions(connection);
        }
    }

    adjustForNetworkConditions(connection) {
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
            // Reduce data usage
            this.reduceDataUsage();
        } else {
            // Normal data usage
            this.normalDataUsage();
        }
    }

    reduceDataUsage() {
        // Disable auto-loading of heavy resources
        document.body.classList.add('low-data-mode');
        
        // Reduce image quality
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.lowSrc) {
                img.src = img.dataset.lowSrc;
            }
        });
    }

    normalDataUsage() {
        document.body.classList.remove('low-data-mode');
    }

    optimizeRequests() {
        // Group and batch requests
        this.setupRequestBatching();
    }

    setupRequestBatching() {
        // Implement request batching for better performance
        // This is a placeholder for future implementation
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Make it globally available for debugging
    if (typeof window !== 'undefined') {
        window.performanceOptimizer = performanceOptimizer;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}