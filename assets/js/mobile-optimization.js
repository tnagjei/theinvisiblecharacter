// Mobile Optimization JavaScript for TheInvisibleCharacter.live

// ===== 移动端检测和初始化 =====
class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isIOS = this.detectIOS();
        this.isAndroid = this.detectAndroid();
        this.isSafari = this.detectSafari();
        this.isChrome = this.detectChrome();
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }
    
    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    detectAndroid() {
        return /Android/.test(navigator.userAgent);
    }
    
    detectSafari() {
        return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    }
    
    detectChrome() {
        return /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    }
    
    init() {
        if (this.isMobile) {
            this.setupMobileOptimizations();
            this.setupTouchInteractions();
            this.setupPerformanceOptimizations();
            this.setupAccessibility();
            this.setupOfflineSupport();
        }
    }
    
    // ===== 移动端设置 =====
    setupMobileOptimizations() {
        // 添加移动端类名
        document.body.classList.add('mobile-device');
        
        if (this.isIOS) {
            document.body.classList.add('ios-device');
        }
        
        if (this.isAndroid) {
            document.body.classList.add('android-device');
        }
        
        if (this.isSafari) {
            document.body.classList.add('safari-browser');
        }
        
        // 设置视口高度
        this.setupViewportHeight();
        
        // 防止双击缩放
        this.preventDoubleTapZoom();
        
        // 设置触摸反馈
        this.setupTouchFeedback();
        
        // 设置底部导航
        this.setupBottomNavigation();
        
        // 设置返回顶部按钮
        this.setupBackToTop();
        
        // 设置键盘处理
        this.setupKeyboardHandling();
    }
    
    setupViewportHeight() {
        // 修复iOS 100vh问题
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
    }
    
    preventDoubleTapZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    setupTouchFeedback() {
        // 为所有可点击元素添加触摸反馈
        const clickableElements = document.querySelectorAll('button, .btn, .clickable, a');
        
        clickableElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                element.classList.remove('touch-active');
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 200);
            });
        });
    }
    
    setupBottomNavigation() {
        // 创建底部导航
        const bottomNav = document.createElement('nav');
        bottomNav.className = 'bottom-nav';
        bottomNav.innerHTML = `
            <div class="flex justify-around items-center">
                <a href="#tools" class="bottom-nav-item" data-page="tools">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Tools</span>
                </a>
                <a href="#features" class="bottom-nav-item" data-page="features">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span>Features</span>
                </a>
                <a href="about.html" class="bottom-nav-item" data-page="about">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>About</span>
                </a>
                <a href="help.html" class="bottom-nav-item" data-page="help">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Help</span>
                </a>
            </div>
        `;
        
        document.body.appendChild(bottomNav);
        document.body.classList.add('has-bottom-nav');
        
        // 设置当前活动页面
        this.updateActiveBottomNavItem();
        
        // 监听滚动事件更新活动项
        window.addEventListener('scroll', () => {
            this.updateActiveBottomNavItem();
        });
    }
    
    updateActiveBottomNavItem() {
        const sections = ['tools', 'features'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navItem = document.querySelector(`[data-page="${sectionId}"]`);
            
            if (section && navItem) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    }
    
    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
        `;
        backToTop.setAttribute('aria-label', 'Back to top');
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(backToTop);
        
        // 监听滚动事件显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }
    
    setupKeyboardHandling() {
        // 监听键盘弹出/收起
        const originalHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = originalHeight - currentHeight;
            
            if (heightDiff > 150) {
                // 键盘弹出
                document.body.classList.add('keyboard-open');
            } else {
                // 键盘收起
                document.body.classList.remove('keyboard-open');
            }
        });
        
        // 自动调整输入框位置
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }
    
    // ===== 触摸交互优化 =====
    setupTouchInteractions() {
        this.setupSwipeGestures();
        this.setupLongPress();
        this.setupTouchScrolling();
    }
    
    setupSwipeGestures() {
        const swipeableElements = document.querySelectorAll('.swipeable');
        
        swipeableElements.forEach(element => {
            let startX = 0;
            let startY = 0;
            let startTime = 0;
            
            element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
            });
            
            element.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const endTime = Date.now();
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const deltaTime = endTime - startTime;
                
                // 检测滑动方向
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
                    if (deltaX > 0) {
                        // 向右滑动
                        this.handleSwipeRight(element);
                    } else {
                        // 向左滑动
                        this.handleSwipeLeft(element);
                    }
                } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50 && deltaTime < 300) {
                    if (deltaY > 0) {
                        // 向下滑动
                        this.handleSwipeDown(element);
                    } else {
                        // 向上滑动
                        this.handleSwipeUp(element);
                    }
                }
            });
        });
    }
    
    handleSwipeLeft(element) {
        // 处理向左滑动
        if (element.classList.contains('character-card')) {
            // 复制字符
            const copyBtn = element.querySelector('.copy-character-btn');
            if (copyBtn) {
                copyBtn.click();
            }
        }
    }
    
    handleSwipeRight(element) {
        // 处理向右滑动
        console.log('Swipe right detected');
    }
    
    handleSwipeUp(element) {
        // 处理向上滑动
        console.log('Swipe up detected');
    }
    
    handleSwipeDown(element) {
        // 处理向下滑动
        console.log('Swipe down detected');
    }
    
    setupLongPress() {
        const longPressElements = document.querySelectorAll('.long-press');
        
        longPressElements.forEach(element => {
            let pressTimer = null;
            
            element.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    this.handleLongPress(element);
                }, 500);
            });
            
            element.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });
            
            element.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            });
        });
    }
    
    handleLongPress(element) {
        // 处理长按
        if (element.classList.contains('character-card')) {
            // 显示详细信息
            this.showCharacterDetails(element);
        }
    }
    
    setupTouchScrolling() {
        // 优化触摸滚动
        const scrollContainers = document.querySelectorAll('.scroll-container');
        
        scrollContainers.forEach(container => {
            container.style.webkitOverflowScrolling = 'touch';
            
            // 防止弹性滚动
            container.addEventListener('touchmove', (e) => {
                const scrollTop = container.scrollTop;
                const scrollHeight = container.scrollHeight;
                const height = container.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].clientY > 0) ||
                    (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
    
    // ===== 性能优化 =====
    setupPerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupIntersectionObserver();
        this.setupDebouncing();
        this.setupThrottling();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    setupImageOptimization() {
        // 优化图片加载
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.add('error');
            });
        });
    }
    
    setupIntersectionObserver() {
        // 设置 IntersectionObserver 用于动画触发
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    setupDebouncing() {
        // 防抖函数
        window.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }
    
    setupThrottling() {
        // 节流函数
        window.throttle = (func, limit) => {
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
        };
    }
    
    // ===== 可访问性优化 =====
    setupAccessibility() {
        this.setupFocusManagement();
        this.setupScreenReader();
        this.setupReducedMotion();
    }
    
    setupFocusManagement() {
        // 管理焦点
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }
    
    setupScreenReader() {
        // 屏幕阅读器优化
        const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby]');
        
        ariaElements.forEach(element => {
            // 确保 ARIA 标签正确
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-describedby')) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
        });
    }
    
    setupReducedMotion() {
        // 减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    // ===== 离线支持 =====
    setupOfflineSupport() {
        this.setupServiceWorker();
        this.setupOfflineIndicator();
        this.setupCacheManagement();
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
    
    setupOfflineIndicator() {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.textContent = 'You are offline. Some features may be limited.';
        
        document.body.appendChild(offlineIndicator);
        
        window.addEventListener('online', () => {
            offlineIndicator.classList.remove('show');
        });
        
        window.addEventListener('offline', () => {
            offlineIndicator.classList.add('show');
        });
    }
    
    setupCacheManagement() {
        // 缓存管理
        if ('caches' in window) {
            // 清理旧缓存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== 'v1') {
                            return caches.delete(cacheName);
                        }
                    })
                );
            });
        }
    }
    
    // ===== 实用工具方法 =====
    
    // 显示复制反馈
    showCopyFeedback(message = 'Copied!') {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // 显示加载状态
    showLoading(element) {
        element.classList.add('loading');
        element.disabled = true;
    }
    
    hideLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
    
    // 显示字符详情
    showCharacterDetails(element) {
        const character = element.querySelector('.character-preview').textContent;
        const name = element.querySelector('h4').textContent;
        const description = element.querySelector('p').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${description}</p>
                    <div class="mt-4">
                        <label class="block text-sm font-medium mb-2">Character:</label>
                        <div class="character-preview">${character}</div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium mb-2">Unicode:</label>
                        <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            ${this.getUnicodeInfo(character)}
                        </code>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${character}'); mobileOptimizer.showCopyFeedback('Copied!'); this.closest('.modal').remove();">
                        Copy Character
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove();">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // 获取Unicode信息
    getUnicodeInfo(character) {
        const codePoint = character.codePointAt(0);
        return `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
    }
    
    // 设置搜索建议
    setupSearchSuggestions() {
        const searchInput = document.getElementById('character-search');
        if (!searchInput) return;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionsContainer);
        
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                this.showSearchSuggestions(query, suggestionsContainer);
            } else {
                suggestionsContainer.innerHTML = '';
            }
        }, 300));
        
        // 点击外部关闭建议
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.innerHTML = '';
            }
        });
    }
    
    showSearchSuggestions(query, container) {
        const characters = this.getCharactersData();
        const filtered = characters.filter(char => 
            char.name.toLowerCase().includes(query) || 
            char.category.toLowerCase().includes(query)
        );
        
        if (filtered.length > 0) {
            container.innerHTML = filtered.slice(0, 5).map(char => `
                <div class="search-suggestion-item" onclick="mobileOptimizer.selectSuggestion('${char.name}')">
                    <strong>${char.name}</strong>
                    <div class="text-sm text-gray-500">${char.category}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="search-suggestion-item">No results found</div>';
        }
    }
    
    selectSuggestion(characterName) {
        const searchInput = document.getElementById('character-search');
        searchInput.value = characterName;
        document.querySelector('.search-suggestions').innerHTML = '';
        searchInput.dispatchEvent(new Event('input'));
    }
    
    getCharactersData() {
        // 获取字符数据（从全局变量或API）
        return window.charactersData || [];
    }
}

// ===== 初始化 =====
let mobileOptimizer;

document.addEventListener('DOMContentLoaded', () => {
    mobileOptimizer = new MobileOptimizer();
});

// ===== 导出全局方法 =====
window.mobileOptimizer = mobileOptimizer;

// ===== 兼容性检查 =====
if ('IntersectionObserver' in window) {
    // IntersectionObserver 可用
} else {
    // 降级处理
    console.log('IntersectionObserver not supported');
}

if ('serviceWorker' in navigator) {
    // Service Worker 可用
} else {
    // 降级处理
    console.log('Service Worker not supported');
}

// ===== 性能监控 =====
if ('performance' in window) {
    // 性能监控
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}

// ===== 错误处理 =====
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    // 可以发送错误到服务器
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // 可以发送错误到服务器
});