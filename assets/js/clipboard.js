/**
 * Clipboard Integration System
 * Enhanced clipboard functionality with ClipboardJS integration
 */

class ClipboardManager {
    constructor() {
        this.clipboardInstances = new Map();
        this.copyHistory = [];
        this.maxHistory = 10;
        this.isSupported = this.checkClipboardSupport();
        this.init();
    }

    init() {
        // Load ClipboardJS from CDN
        this.loadClipboardJS();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load copy history
        this.loadCopyHistory();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeClipboard());
        } else {
            this.initializeClipboard();
        }
    }

    checkClipboardSupport() {
        return 'clipboard' in navigator || 'execCommand' in document;
    }

    loadClipboardJS() {
        // Check if ClipboardJS is already loaded
        if (typeof ClipboardJS !== 'undefined') {
            return;
        }

        // Load ClipboardJS from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js';
        script.integrity = 'sha512-7O5pXpc0oCRrxk8RUfDYFgn0nO1t+jLuIOQdOMRpCRAPGMuqH85tuyEeeyI1rgQyPcBq4Cm2qZ0jE9Qe1s5L9g==';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        
        script.onload = () => {
            console.log('ClipboardJS loaded successfully');
            this.initializeClipboard();
        };
        
        script.onerror = () => {
            console.warn('Failed to load ClipboardJS, using fallback');
            this.useFallback = true;
        };
        
        document.head.appendChild(script);
    }

    initializeClipboard() {
        if (typeof ClipboardJS === 'undefined' && !this.useFallback) {
            return;
        }

        // Initialize ClipboardJS for all copy buttons
        this.initializeCopyButtons();
        
        // Initialize dynamic clipboard instances
        this.initializeDynamicClipboard();
        
        // Setup clipboard event listeners
        this.setupClipboardEvents();
    }

    initializeCopyButtons() {
        // Find all elements with data-clipboard-text or data-clipboard-target
        const copyButtons = document.querySelectorAll('[data-clipboard-text], [data-clipboard-target]');
        
        copyButtons.forEach(button => {
            this.createClipboardInstance(button);
        });
    }

    createClipboardInstance(button) {
        if (this.useFallback) {
            this.setupFallbackCopy(button);
            return;
        }

        try {
            const clipboard = new ClipboardJS(button, {
                text: function(trigger) {
                    return trigger.getAttribute('data-clipboard-text') || 
                           document.querySelector(trigger.getAttribute('data-clipboard-target'))?.textContent || 
                           trigger.textContent;
                },
                target: function(trigger) {
                    const targetSelector = trigger.getAttribute('data-clipboard-target');
                    return targetSelector ? document.querySelector(targetSelector) : trigger;
                },
                container: document.body
            });

            clipboard.on('success', (e) => {
                this.handleCopySuccess(e.trigger, e.text);
            });

            clipboard.on('error', (e) => {
                this.handleCopyError(e.trigger, e.text);
            });

            this.clipboardInstances.set(button, clipboard);
        } catch (error) {
            console.error('Failed to create clipboard instance:', error);
            this.setupFallbackCopy(button);
        }
    }

    setupFallbackCopy(button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            let textToCopy = button.getAttribute('data-clipboard-text') || 
                           document.querySelector(button.getAttribute('data-clipboard-target'))?.textContent || 
                           button.textContent;

            this.fallbackCopyText(textToCopy, button);
        });
    }

    fallbackCopyText(text, trigger) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.handleCopySuccess(trigger, text);
            } else {
                this.handleCopyError(trigger, text);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.handleCopyError(trigger, text);
        }

        document.body.removeChild(textArea);
    }

    initializeDynamicClipboard() {
        // Watch for dynamically added copy buttons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const buttons = node.querySelectorAll('[data-clipboard-text], [data-clipboard-target]');
                        buttons.forEach(button => {
                            if (!this.clipboardInstances.has(button)) {
                                this.createClipboardInstance(button);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        this.observer = observer;
    }

    setupClipboardEvents() {
        // Listen for copy events from other components
        document.addEventListener('copyText', (e) => {
            this.copyText(e.detail.text, e.detail.trigger);
        });

        // Listen for copy requests with options
        document.addEventListener('copyWithOptions', (e) => {
            this.copyWithOptions(e.detail.text, e.detail.options);
        });

        // Listen for copy history requests
        document.addEventListener('getCopyHistory', (e) => {
            this.emitEvent('copyHistoryData', {
                history: this.copyHistory,
                requestId: e.detail.requestId
            });
        });

        // Listen for clear copy history
        document.addEventListener('clearCopyHistory', () => {
            this.clearCopyHistory();
        });
    }

    setupEventListeners() {
        // Listen for character copy events
        document.addEventListener('charactersCopied', (e) => {
            this.handleCharacterCopy(e.detail);
        });

        // Listen for theme changes to update button styles
        document.addEventListener('themeChanged', (e) => {
            this.updateButtonStyles(e.detail.theme);
        });
    }

    copyText(text, trigger = null) {
        if (!this.isSupported) {
            this.emitEvent('copyNotSupported', { text, trigger });
            return;
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.handleCopySuccess(trigger, text);
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                this.fallbackCopyText(text, trigger);
            });
        } else {
            this.fallbackCopyText(text, trigger);
        }
    }

    copyWithOptions(text, options = {}) {
        const {
            trigger = null,
            showFeedback = true,
            addToHistory = true,
            customMessage = null,
            timeout = 2000
        } = options;

        this.copyText(text, trigger);

        if (showFeedback) {
            this.showCopyFeedback(trigger, customMessage || '已复制!', timeout);
        }

        if (addToHistory) {
            this.addToCopyHistory(text);
        }
    }

    handleCopySuccess(trigger, text) {
        // Update button state
        this.updateButtonState(trigger, 'success');
        
        // Add to history
        this.addToCopyHistory(text);
        
        // Show feedback
        this.showCopyFeedback(trigger, '已复制!');
        
        // Emit success event
        this.emitEvent('copySuccess', {
            trigger,
            text,
            timestamp: new Date().toISOString()
        });

        // Reset button state after delay
        setTimeout(() => {
            this.updateButtonState(trigger, 'default');
        }, 2000);

        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    handleCopyError(trigger, text) {
        // Update button state
        this.updateButtonState(trigger, 'error');
        
        // Show error feedback
        this.showCopyFeedback(trigger, '复制失败', 3000);
        
        // Emit error event
        this.emitEvent('copyError', {
            trigger,
            text,
            timestamp: new Date().toISOString()
        });

        // Reset button state after delay
        setTimeout(() => {
            this.updateButtonState(trigger, 'default');
        }, 3000);
    }

    handleCharacterCopy(detail) {
        const { characterIds, count } = detail;
        
        // Get character information
        const characters = window.invisibleCharacterLibrary?.getCharactersByIds(characterIds) || [];
        const text = characters.map(char => char.character).join('');
        
        // Add to history with character information
        this.addToCopyHistory(text, {
            type: 'characters',
            characterIds,
            count,
            characterNames: characters.map(char => char.name)
        });
    }

    updateButtonState(button, state) {
        if (!button) return;

        // Remove existing state classes
        button.classList.remove('copy-success', 'copy-error', 'copy-loading');
        
        // Add new state class
        if (state !== 'default') {
            button.classList.add(`copy-${state}`);
        }

        // Update button text if it has data attributes
        const originalText = button.getAttribute('data-original-text');
        const successText = button.getAttribute('data-success-text');
        const errorText = button.getAttribute('data-error-text');

        switch (state) {
            case 'success':
                if (successText) {
                    button.textContent = successText;
                }
                break;
            case 'error':
                if (errorText) {
                    button.textContent = errorText;
                }
                break;
            case 'default':
                if (originalText) {
                    button.textContent = originalText;
                }
                break;
        }
    }

    showCopyFeedback(trigger, message = '已复制!', timeout = 2000) {
        if (!trigger) return;

        // Create or update feedback element
        let feedback = trigger.querySelector('.copy-feedback');
        
        if (!feedback) {
            feedback = document.createElement('span');
            feedback.className = 'copy-feedback absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap';
            trigger.style.position = 'relative';
            trigger.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.display = 'block';

        // Hide feedback after timeout
        setTimeout(() => {
            feedback.style.display = 'none';
        }, timeout);
    }

    addToCopyHistory(text, metadata = {}) {
        const historyItem = {
            id: Date.now(),
            text,
            length: text.length,
            timestamp: new Date().toISOString(),
            ...metadata
        };

        this.copyHistory.unshift(historyItem);
        
        // Limit history size
        if (this.copyHistory.length > this.maxHistory) {
            this.copyHistory = this.copyHistory.slice(0, this.maxHistory);
        }

        // Save to localStorage
        this.saveCopyHistory();

        // Emit history updated event
        this.emitEvent('copyHistoryUpdated', {
            item: historyItem,
            total: this.copyHistory.length
        });
    }

    saveCopyHistory() {
        try {
            localStorage.setItem('copyHistory', JSON.stringify(this.copyHistory));
        } catch (error) {
            console.warn('Failed to save copy history:', error);
        }
    }

    loadCopyHistory() {
        try {
            const saved = localStorage.getItem('copyHistory');
            if (saved) {
                this.copyHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load copy history:', error);
            this.copyHistory = [];
        }
    }

    clearCopyHistory() {
        this.copyHistory = [];
        localStorage.removeItem('copyHistory');
        this.emitEvent('copyHistoryCleared', {});
    }

    updateButtonStyles(theme) {
        // Update copy button styles based on theme
        const buttons = document.querySelectorAll('[data-clipboard-text], [data-clipboard-target]');
        
        buttons.forEach(button => {
            // Add theme-specific classes
            button.classList.remove('light-theme', 'dark-theme');
            button.classList.add(`${theme}-theme`);
        });
    }

    setupEventListeners() {
        // Listen for copy events from other components
        document.addEventListener('copyText', (e) => {
            this.copyText(e.detail.text, e.detail.trigger);
        });

        // Listen for character copy events
        document.addEventListener('charactersCopied', (e) => {
            this.handleCharacterCopy(e.detail);
        });

        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.updateButtonStyles(e.detail.theme);
        });
    }

    // Public API methods
    copy(text, options = {}) {
        return this.copyWithOptions(text, options);
    }

    getHistory() {
        return [...this.copyHistory];
    }

    clearHistory() {
        this.clearCopyHistory();
    }

    isSupported() {
        return this.isSupported;
    }

    // Destroy method for cleanup
    destroy() {
        // Destroy all clipboard instances
        this.clipboardInstances.forEach((clipboard) => {
            clipboard.destroy();
        });
        this.clipboardInstances.clear();

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Clear history
        this.copyHistory = [];
    }

    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}

// Initialize clipboard manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.clipboardManager = new ClipboardManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClipboardManager;
}

// Export for ES modules
if (typeof export !== 'undefined') {
    export { ClipboardManager };
}