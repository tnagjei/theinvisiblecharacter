/**
 * Native clipboard integration with textarea fallback.
 */

class ClipboardManager {
    constructor() {
        this.copyHistory = [];
        this.maxHistory = 10;
        this.clipboardReady = false;
        this.isClipboardSupported = this.checkClipboardSupport();
        this.init();
    }

    init() {
        this.loadCopyHistory();
        this.setupClipboardEvents();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeClipboard());
        } else {
            this.initializeClipboard();
        }
    }

    checkClipboardSupport() {
        return Boolean(navigator.clipboard) || document.queryCommandSupported?.('copy') || 'execCommand' in document;
    }

    initializeClipboard() {
        if (this.clipboardReady) return;
        this.clipboardReady = true;
        this.setupCopyButtons(document);
        this.observeDynamicButtons();
    }

    setupCopyButtons(rootNode) {
        const buttons = rootNode.querySelectorAll?.('[data-clipboard-text], [data-clipboard-target]') || [];
        buttons.forEach(button => this.setupCopyButton(button));
    }

    setupCopyButton(button) {
        if (button.dataset.clipboardBound === 'true') return;
        button.dataset.clipboardBound = 'true';
        button.addEventListener('click', event => {
            event.preventDefault();
            const text = this.getButtonText(button);
            this.copyText(text, button);
        });
    }

    getButtonText(button) {
        const targetSelector = button.getAttribute('data-clipboard-target');
        const target = targetSelector ? document.querySelector(targetSelector) : null;
        return button.getAttribute('data-clipboard-text') || target?.textContent || button.textContent || '';
    }

    observeDynamicButtons() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.matches?.('[data-clipboard-text], [data-clipboard-target]')) {
                        this.setupCopyButton(node);
                    }
                    this.setupCopyButtons(node);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        this.observer = observer;
    }

    setupClipboardEvents() {
        document.addEventListener('copyText', event => {
            this.copyText(event.detail.text, event.detail.trigger);
        });

        document.addEventListener('copyWithOptions', event => {
            this.copyWithOptions(event.detail.text, event.detail.options);
        });

        document.addEventListener('getCopyHistory', event => {
            this.emitEvent('copyHistoryData', {
                history: this.copyHistory,
                requestId: event.detail.requestId
            });
        });

        document.addEventListener('clearCopyHistory', () => {
            this.clearCopyHistory();
        });

        document.addEventListener('charactersCopied', event => {
            this.handleCharacterCopy(event.detail);
        });

        document.addEventListener('themeChanged', event => {
            this.updateButtonStyles(event.detail.theme);
        });
    }

    copyText(text, trigger = null) {
        if (!this.isClipboardSupported) {
            this.handleCopyError(trigger, text);
            return Promise.resolve(false);
        }

        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text)
                .then(() => {
                    this.handleCopySuccess(trigger, text);
                    return true;
                })
                .catch(() => this.fallbackCopyText(text, trigger));
        }

        return this.fallbackCopyText(text, trigger);
    }

    fallbackCopyText(text, trigger) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            const copied = document.execCommand('copy');
            if (copied) this.handleCopySuccess(trigger, text);
            else this.handleCopyError(trigger, text);
            return Promise.resolve(copied);
        } catch (error) {
            this.handleCopyError(trigger, text);
            return Promise.resolve(false);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    copyWithOptions(text, options = {}) {
        const { trigger = null, customMessage = null, timeout = 2000 } = options;
        return this.copyText(text, trigger).then(copied => {
            if (copied && customMessage) this.showCopyFeedback(trigger, customMessage, timeout);
            return copied;
        });
    }

    handleCopySuccess(trigger, text) {
        this.updateButtonState(trigger, 'success');
        this.addToCopyHistory(text);
        this.showCopyFeedback(trigger, 'Copied');
        this.emitEvent('copySuccess', { trigger, text, timestamp: new Date().toISOString() });

        setTimeout(() => this.updateButtonState(trigger, 'default'), 2000);
        if ('vibrate' in navigator) navigator.vibrate(50);
    }

    handleCopyError(trigger, text) {
        this.updateButtonState(trigger, 'error');
        this.showCopyFeedback(trigger, 'Copy failed', 3000);
        this.emitEvent('copyError', { trigger, text, timestamp: new Date().toISOString() });
        setTimeout(() => this.updateButtonState(trigger, 'default'), 3000);
    }

    handleCharacterCopy(detail) {
        const { characterIds, count } = detail;
        const characters = window.invisibleCharacterLibrary?.getCharactersByIds(characterIds) || [];
        const text = characters.map(character => character.character).join('');
        this.addToCopyHistory(text, {
            type: 'characters',
            characterIds,
            count,
            characterNames: characters.map(character => character.name)
        });
    }

    updateButtonState(button, state) {
        if (!button) return;

        button.classList.remove('copy-success', 'copy-error', 'copy-loading');
        if (state !== 'default') button.classList.add(`copy-${state}`);

        const originalText = button.getAttribute('data-original-text');
        const successText = button.getAttribute('data-success-text');
        const errorText = button.getAttribute('data-error-text');

        if (state === 'success' && successText) button.textContent = successText;
        if (state === 'error' && errorText) button.textContent = errorText;
        if (state === 'default' && originalText) button.textContent = originalText;
    }

    showCopyFeedback(trigger, message = 'Copied', timeout = 2000) {
        if (!trigger) return;

        let feedback = trigger.querySelector('.copy-feedback');
        if (!feedback) {
            feedback = document.createElement('span');
            feedback.className = 'copy-feedback';
            trigger.style.position = 'relative';
            trigger.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.display = 'block';
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
        if (this.copyHistory.length > this.maxHistory) {
            this.copyHistory = this.copyHistory.slice(0, this.maxHistory);
        }
        this.saveCopyHistory();
        this.emitEvent('copyHistoryUpdated', { item: historyItem, total: this.copyHistory.length });
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
            this.copyHistory = saved ? JSON.parse(saved) : [];
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
        document.querySelectorAll('[data-clipboard-text], [data-clipboard-target]').forEach(button => {
            button.classList.remove('light-theme', 'dark-theme');
            button.classList.add(`${theme}-theme`);
        });
    }

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
        return this.isClipboardSupported;
    }

    destroy() {
        this.observer?.disconnect();
        this.copyHistory = [];
    }

    emitEvent(eventName, data) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.clipboardManager = new ClipboardManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClipboardManager;
}

if (typeof exports !== 'undefined') {
    exports.ClipboardManager = ClipboardManager;
}
