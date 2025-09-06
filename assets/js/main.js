/**
 * Main Application Controller
 * Integrates all components and manages the application state
 */

class InvisibleCharacterApp {
    constructor() {
        this.isInitialized = false;
        this.currentView = 'home';
        this.userPreferences = {
            autoCopy: true,
            showTooltips: true,
            animations: true,
            soundEffects: false,
            language: 'zh-CN'
        };
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('Initializing Invisible Character App...');
        
        // Load user preferences
        this.loadPreferences();
        
        // Initialize components
        this.initializeComponents();
        
        // Setup routing
        this.setupRouting();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Initialize UI
        this.initializeUI();
        
        // Check for URL parameters
        this.handleUrlParameters();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Emit initialization complete event
        this.emitEvent('appInitialized', {
            timestamp: new Date().toISOString(),
            preferences: this.userPreferences
        });
        
        console.log('Invisible Character App initialized successfully');
    }

    initializeComponents() {
        // Initialize theme manager
        if (typeof ThemeManager !== 'undefined') {
            this.components.theme = window.themeManager || new ThemeManager();
        }

        // Initialize character library
        if (typeof InvisibleCharacterLibrary !== 'undefined') {
            this.components.library = window.invisibleCharacterLibrary || new InvisibleCharacterLibrary();
        }

        // Initialize clipboard manager
        if (typeof ClipboardManager !== 'undefined') {
            this.components.clipboard = window.clipboardManager || new ClipboardManager();
        }

        // Initialize detector
        if (typeof InvisibleCharacterDetector !== 'undefined') {
            this.components.detector = window.invisibleCharacterDetector || new InvisibleCharacterDetector();
        }

        // Setup component event listeners
        this.setupComponentEventListeners();
    }

    setupComponentEventListeners() {
        // Theme change events
        document.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        // Character selection events
        document.addEventListener('selectionChanged', (e) => {
            this.handleCharacterSelection(e.detail);
        });

        // Copy events
        document.addEventListener('copySuccess', (e) => {
            this.handleCopySuccess(e.detail);
        });

        // Detection events
        document.addEventListener('detectionCompleted', (e) => {
            this.handleDetectionCompleted(e.detail);
        });

        // Library events
        document.addEventListener('libraryInitialized', (e) => {
            this.handleLibraryInitialized(e.detail);
        });
    }

    setupRouting() {
        // Simple hash-based routing
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Handle initial route
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateToView(hash);
    }

    navigateToView(viewName) {
        if (this.currentView === viewName) return;

        // Hide current view
        this.hideView(this.currentView);
        
        // Show new view
        this.showView(viewName);
        
        // Update current view
        this.currentView = viewName;
        
        // Update navigation
        this.updateNavigation(viewName);
        
        // Emit view change event
        this.emitEvent('viewChanged', { view: viewName });
    }

    hideView(viewName) {
        const view = document.querySelector(`[data-view="${viewName}"]`);
        if (view) {
            view.classList.add('hidden');
            view.classList.remove('animate-fade-in');
        }
    }

    showView(viewName) {
        const view = document.querySelector(`[data-view="${viewName}"]`);
        if (view) {
            view.classList.remove('hidden');
            view.classList.add('animate-fade-in');
        }
    }

    updateNavigation(viewName) {
        // Update navigation active states
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            const targetView = link.getAttribute('href').slice(1);
            if (targetView === viewName) {
                link.classList.add('text-blue-600', 'font-semibold');
                link.classList.remove('text-apple-gray-600');
            } else {
                link.classList.remove('text-blue-600', 'font-semibold');
                link.classList.add('text-apple-gray-600');
            }
        });
    }

    setupGlobalEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.handleOfflineStatus();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });
    }

    handleKeyboardShortcuts(e) {
        // Ignore if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + K: Quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSearch();
        }

        // Ctrl/Cmd + N: New character
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showCharacterGenerator();
        }

        // Ctrl/Cmd + D: Toggle theme (handled by theme manager)
        // Ctrl/Cmd + C: Copy selected characters
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            this.copySelectedCharacters();
        }

        // Escape: Close modals/overlays
        if (e.key === 'Escape') {
            this.closeModals();
        }

        // F1: Help
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }
    }

    initializeUI() {
        // Initialize character grid
        this.initializeCharacterGrid();
        
        // Initialize detector UI
        this.initializeDetectorUI();
        
        // Initialize copy buttons
        this.initializeCopyButtons();
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize animations
        this.initializeAnimations();
        
        // Setup mobile menu
        this.setupMobileMenu();
        
        // Setup selection controls
        this.setupSelectionControls();
        
        // Setup detector controls
        this.setupDetectorControls();
    }

    initializeCharacterGrid() {
        const gridContainer = document.querySelector('#character-grid');
        if (!gridContainer) return;

        const characters = this.components.library?.getCharacters() || [];
        
        characters.forEach(character => {
            const characterCard = this.createCharacterCard(character);
            gridContainer.appendChild(characterCard);
        });

        // Setup search and filter
        this.setupCharacterSearch();
        this.setupCharacterFilters();
    }

    createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = 'character-card bg-white dark:bg-apple-gray-800 rounded-lg p-4 border border-apple-gray-200 dark:border-apple-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer';
        card.dataset.characterId = character.id;
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="character-preview text-2xl font-mono bg-apple-gray-100 dark:bg-apple-gray-700 px-2 py-1 rounded">${character.character}</span>
                    <span class="text-xs text-apple-gray-500 dark:text-apple-gray-400">${character.unicode}</span>
                </div>
                <button class="copy-character-btn p-2 rounded hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors" 
                        data-clipboard-text="${character.character}"
                        data-character-id="${character.id}"
                        title="复制字符">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </button>
            </div>
            <h3 class="font-semibold text-sm mb-1">${character.name}</h3>
            <p class="text-xs text-apple-gray-600 dark:text-apple-gray-400 mb-2">${character.description}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs bg-apple-gray-100 dark:bg-apple-gray-700 px-2 py-1 rounded">${character.category}</span>
                <div class="flex items-center space-x-1">
                    <span class="text-xs text-apple-gray-500">热度:</span>
                    <div class="flex space-x-1">
                        ${this.createPopularityStars(character.popularity)}
                    </div>
                </div>
            </div>
        `;

        // Add click handler for character selection
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.copy-character-btn')) {
                this.toggleCharacterSelection(character.id);
            }
        });

        return card;
    }

    createPopularityStars(popularity) {
        const stars = Math.floor(popularity / 20);
        let html = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                html += '<svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else {
                html += '<svg class="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            }
        }
        
        return html;
    }

    setupCharacterSearch() {
        const searchInput = document.querySelector('#character-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            this.components.library?.setSearchTerm(searchTerm);
            this.updateCharacterGrid();
        });
    }

    setupCharacterFilters() {
        const filterSelect = document.querySelector('#character-filter');
        if (!filterSelect) return;

        filterSelect.addEventListener('change', (e) => {
            const category = e.target.value;
            this.updateCharacterGrid({ category });
        });
    }

    updateCharacterGrid(filters = {}) {
        const gridContainer = document.querySelector('#character-grid');
        if (!gridContainer) return;

        const characters = this.components.library?.getCharacters(filters) || [];
        
        // Clear existing cards
        gridContainer.innerHTML = '';
        
        // Add new cards
        characters.forEach(character => {
            const characterCard = this.createCharacterCard(character);
            gridContainer.appendChild(characterCard);
        });
    }

    initializeDetectorUI() {
        const detectorInput = document.querySelector('#detector-input');
        const detectButton = document.querySelector('#detect-button');
        const resultsContainer = document.querySelector('#detection-results');

        if (!detectorInput || !detectButton) return;

        detectButton.addEventListener('click', () => {
            const text = detectorInput.value;
            if (text.trim()) {
                this.components.detector?.detectInvisibleCharacters(text);
            }
        });

        // Real-time detection
        detectorInput.addEventListener('input', (e) => {
            const text = e.target.value;
            if (text.trim() && this.userPreferences.realTimeDetection) {
                // Debounce real-time detection
                clearTimeout(this.realTimeDetectionTimeout);
                this.realTimeDetectionTimeout = setTimeout(() => {
                    this.components.detector?.detectInvisibleCharacters(text, { autoDetect: true });
                }, 500);
            }
        });
    }

    initializeCopyButtons() {
        // Clipboard manager handles this automatically
        // Just add custom styling and behavior if needed
        document.addEventListener('copySuccess', (e) => {
            this.showNotification('复制成功！', 'success');
        });

        document.addEventListener('copyError', (e) => {
            this.showNotification('复制失败，请重试', 'error');
        });
    }

    initializeTooltips() {
        if (!this.userPreferences.showTooltips) return;

        // Simple tooltip implementation
        const tooltipElements = document.querySelectorAll('[title]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('title'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    initializeAnimations() {
        if (!this.userPreferences.animations) return;

        // Add animation classes to elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupMobileMenu() {
        const mobileMenuButton = document.querySelector('#mobile-menu-button');
        const mobileMenu = document.querySelector('#mobile-menu');
        
        if (!mobileMenuButton || !mobileMenu) return;

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    setupSelectionControls() {
        // Copy selected characters button
        const copySelectedBtn = document.querySelector('#copy-selected');
        if (copySelectedBtn) {
            copySelectedBtn.addEventListener('click', () => {
                this.copySelectedCharacters();
            });
        }

        // Select all button
        const selectAllBtn = document.querySelector('#select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.components.library?.selectAllCharacters(true);
            });
        }

        // Clear selection button
        const clearSelectionBtn = document.querySelector('#clear-selection');
        if (clearSelectionBtn) {
            clearSelectionBtn.addEventListener('click', () => {
                this.components.library?.selectAllCharacters(false);
            });
        }
    }

    setupDetectorControls() {
        // Clear detector button
        const clearDetectorBtn = document.querySelector('#clear-detector');
        if (clearDetectorBtn) {
            clearDetectorBtn.addEventListener('click', () => {
                const detectorInput = document.querySelector('#detector-input');
                const resultsContainer = document.querySelector('#detection-results');
                if (detectorInput) {
                    detectorInput.value = '';
                }
                if (resultsContainer) {
                    resultsContainer.classList.add('hidden');
                }
            });
        }

        // Real-time detection checkbox
        const realTimeCheckbox = document.querySelector('#real-time-detection');
        if (realTimeCheckbox) {
            realTimeCheckbox.addEventListener('change', (e) => {
                this.userPreferences.realTimeDetection = e.target.checked;
                this.savePreferences();
                
                if (e.target.checked) {
                    this.components.detector?.toggleRealTimeDetection(true);
                } else {
                    this.components.detector?.toggleRealTimeDetection(false);
                }
            });
        }
    }

    // Event handlers
    handleThemeChange(theme) {
        // Update UI based on theme
        document.body.classList.toggle('dark', theme === 'dark');
        this.savePreferences();
    }

    handleCharacterSelection(detail) {
        // Update UI based on character selection
        const { characterId, selected, totalSelected } = detail;
        const card = document.querySelector(`[data-character-id="${characterId}"]`);
        
        if (card) {
            card.classList.toggle('ring-2', selected);
            card.classList.toggle('ring-blue-500', selected);
        }

        // Update selection counter
        const counter = document.querySelector('#selection-counter');
        if (counter) {
            const counterSpan = counter.querySelector('span');
            if (counterSpan) {
                counterSpan.textContent = totalSelected;
            }
            counter.classList.toggle('hidden', totalSelected === 0);
        }

        // Update copy selected button
        const copySelectedBtn = document.querySelector('#copy-selected');
        if (copySelectedBtn) {
            copySelectedBtn.disabled = totalSelected === 0;
        }
    }

    handleCopySuccess(detail) {
        // Show copy feedback
        const { trigger } = detail;
        if (trigger) {
            this.showCopyFeedback(trigger);
        }
    }

    handleDetectionCompleted(detail) {
        // Update detection results UI
        const { results, totalMatches, hasInvisibleCharacters } = detail;
        const resultsContainer = document.querySelector('#detection-results');
        
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            this.renderDetectionResults(resultsContainer, detail);
        }

        // Show notification
        if (hasInvisibleCharacters) {
            this.showNotification(`检测到 ${totalMatches} 个隐形字符`, 'warning');
        } else {
            this.showNotification('未检测到隐形字符', 'success');
        }
    }

    handleLibraryInitialized(detail) {
        // Update UI when library is initialized
        console.log('Character library initialized:', detail);
    }

    renderDetectionResults(container, detectionResult) {
        const { results, totalMatches, text } = detectionResult;
        
        container.innerHTML = `
            <div class="bg-white dark:bg-apple-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">检测结果</h3>
                
                ${totalMatches > 0 ? `
                    <div class="mb-4">
                        <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-2">
                            在文本中检测到 <span class="font-semibold text-red-600">${totalMatches}</span> 个隐形字符
                        </p>
                        <div class="space-y-2">
                            ${results.map(result => `
                                <div class="flex items-center justify-between p-2 bg-apple-gray-50 dark:bg-apple-gray-700 rounded">
                                    <div>
                                        <span class="font-medium">${result.pattern}</span>
                                        <span class="text-sm text-apple-gray-500 ml-2">${result.unicode}</span>
                                        <span class="text-xs text-apple-gray-400 ml-2">(${result.count}个)</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded ${
                                        result.risk === 'high' ? 'bg-red-100 text-red-800' :
                                        result.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }">
                                        ${result.risk}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
                                onclick="app.cleanDetectedText('${text.replace(/'/g, "\\'")}')">
                            清理隐形字符
                        </button>
                        <button class="px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors"
                                onclick="app.exportDetectionResults()">
                            导出结果
                        </button>
                    </div>
                ` : `
                    <p class="text-green-600 dark:text-green-400">文本中未检测到隐形字符</p>
                `}
            </div>
        `;
    }

    // Utility methods
    toggleCharacterSelection(characterId) {
        this.components.library?.toggleCharacterSelection(characterId);
    }

    copySelectedCharacters() {
        const selected = this.components.library?.getSelectedCharacters() || [];
        if (selected.length > 0) {
            const text = selected.map(char => char.character).join('');
            this.components.clipboard?.copy(text);
        }
    }

    showQuickSearch() {
        // Implement quick search modal
        console.log('Quick search not implemented yet');
    }

    showCharacterGenerator() {
        // Navigate to generator view
        this.navigateToView('generator');
    }

    showHelp() {
        // Show help modal
        console.log('Help not implemented yet');
    }

    closeModals() {
        // Close all open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showCopyFeedback(trigger) {
        if (!trigger) return;
        
        const feedback = document.createElement('span');
        feedback.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap';
        feedback.textContent = '已复制!';
        
        trigger.style.position = 'relative';
        trigger.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    showTooltip(element, text) {
        // Simple tooltip implementation
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white text-xs px-2 py-1 rounded z-50';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        element.tooltip = tooltip;
    }

    hideTooltip() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    handleResize() {
        // Handle responsive layout changes
        console.log('Window resized');
    }

    handleOnlineStatus() {
        this.showNotification('网络连接已恢复', 'success');
    }

    handleOfflineStatus() {
        this.showNotification('网络连接已断开', 'warning');
    }

    handleVisibilityChange() {
        // Handle tab visibility changes
        if (document.hidden) {
            // Pause animations, timers, etc.
        } else {
            // Resume animations, timers, etc.
        }
    }

    handleBeforeUnload(e) {
        // Handle page unload
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    }

    handleUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        
        // Handle specific URL parameters
        if (params.has('character')) {
            const characterId = params.get('character');
            this.showCharacterDetails(characterId);
        }
        
        if (params.has('action')) {
            const action = params.get('action');
            this.handleAction(action);
        }
    }

    showCharacterDetails(characterId) {
        // Show character details modal or navigate to character view
        console.log('Show character details:', characterId);
    }

    handleAction(action) {
        switch (action) {
            case 'generate':
                this.navigateToView('generator');
                break;
            case 'detect':
                this.navigateToView('detector');
                break;
            case 'about':
                this.navigateToView('about');
                break;
        }
    }

    hasUnsavedChanges() {
        // Check if there are unsaved changes
        return false; // Implement as needed
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem('userPreferences');
            if (saved) {
                this.userPreferences = {
                    ...this.userPreferences,
                    ...JSON.parse(saved)
                };
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
    }

    savePreferences() {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }

    cleanDetectedText(text) {
        const result = this.components.detector?.cleanInvisibleCharacters(text);
        if (result) {
            const detectorInput = document.querySelector('#detector-input');
            if (detectorInput) {
                detectorInput.value = result.cleanedText;
                this.showNotification(`已清理 ${result.removedCount} 个隐形字符`, 'success');
            }
        }
    }

    exportDetectionResults() {
        this.components.detector?.exportResults('json');
    }

    // Public API
    getComponent(name) {
        return this.components[name];
    }

    navigateTo(view) {
        this.navigateToView(view);
    }

    showNotification(message, type = 'info') {
        this.showNotification(message, type);
    }

    // Emit events
    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Destroy method
    destroy() {
        // Clean up all components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Clear event listeners
        this.components = {};
        this.isInitialized = false;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new InvisibleCharacterApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvisibleCharacterApp;
}

// Export for ES modules
if (typeof export !== 'undefined') {
    export { InvisibleCharacterApp };
}