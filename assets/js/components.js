/**
 * Invisible Character Tool Components
 * Specialized components for the invisible character functionality
 */

// Invisible Character Generator Component
class InvisibleCharacterGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 class="text-2xl font-bold mb-6 text-center">Invisible Character Generator</h3>
                
                <div class="space-y-6">
                    <!-- Character Type Selection -->
                    <div>
                        <label class="block text-sm font-medium mb-3">Choose character type</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button class="character-type-btn active" data-type="zero-width-space">
                                <span class="font-medium">Zero Width Space</span>
                                <span class="text-xs opacity-70">U+200B</span>
                            </button>
                            <button class="character-type-btn" data-type="zero-width-joiner">
                                <span class="font-medium">Zero Width Joiner</span>
                                <span class="text-xs opacity-70">U+200D</span>
                            </button>
                            <button class="character-type-btn" data-type="zero-width-non-joiner">
                                <span class="font-medium">Zero Width Non-Joiner</span>
                                <span class="text-xs opacity-70">U+200C</span>
                            </button>
                            <button class="character-type-btn" data-type="left-to-right-mark">
                                <span class="font-medium">Left-to-Right Mark</span>
                                <span class="text-xs opacity-70">U+200E</span>
                            </button>
                        </div>
                    </div>

                    <!-- Quantity Input -->
                    <div>
                        <label for="quantity" class="block text-sm font-medium mb-2">Quantity</label>
                        <input type="number" id="quantity" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700" value="1" min="1" max="100">
                    </div>

                    <!-- Format Selection -->
                    <div>
                        <label class="block text-sm font-medium mb-3">Output format</label>
                        <select id="format" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700">
                            <option value="unicode">Unicode character</option>
                            <option value="html">HTML entity</option>
                            <option value="css">CSS escape</option>
                            <option value="javascript">JavaScript escape</option>
                        </select>
                    </div>

                    <!-- Generate Button -->
                    <button id="generate-btn" class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                        Generate Invisible Characters
                    </button>

                    <!-- Result Display -->
                    <div id="result-container" class="hidden">
                        <label class="block text-sm font-medium mb-2">Generated result</label>
                        <div class="relative">
                            <textarea id="result" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm" rows="3" readonly></textarea>
                            <button id="copy-btn" class="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                                Copy
                            </button>
                        </div>
                        <div id="copy-feedback" class="hidden mt-2 text-sm text-green-600 dark:text-green-400">
                            Copied to clipboard
                        </div>
                    </div>

                    <!-- Preview -->
                    <div id="preview-container" class="hidden">
                        <label class="block text-sm font-medium mb-2">Preview</label>
                        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div class="flex items-center justify-between">
                                <span>Text before</span>
                                <span id="preview-text" class="font-mono text-sm"></span>
                                <span>Text after</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Character type selection
        this.container.querySelectorAll('.character-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.character-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateCharacters();
        });

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Quantity input validation
        document.getElementById('quantity').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value > 100) e.target.value = 100;
            if (value < 1) e.target.value = 1;
        });
    }

    generateCharacters() {
        const type = this.container.querySelector('.character-type-btn.active').dataset.type;
        const quantity = parseInt(document.getElementById('quantity').value);
        const format = document.getElementById('format').value;

        const characters = this.getCharactersByType(type);
        let result = '';

        switch (format) {
            case 'unicode':
                result = characters.char.repeat(quantity);
                break;
            case 'html':
                result = characters.html.repeat(quantity);
                break;
            case 'css':
                result = characters.css.repeat(quantity);
                break;
            case 'javascript':
                result = characters.javascript.repeat(quantity);
                break;
        }

        // Display result
        document.getElementById('result').value = result;
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('preview-container').classList.remove('hidden');
        document.getElementById('preview-text').textContent = result;

        // Add animation
        this.animateResult();
    }

    getCharactersByType(type) {
        const characterMap = {
            'zero-width-space': {
                char: '\u200B',
                html: '&#8203;',
                css: '\\200B',
                javascript: '\\u200B'
            },
            'zero-width-joiner': {
                char: '\u200D',
                html: '&#8205;',
                css: '\\200D',
                javascript: '\\u200D'
            },
            'zero-width-non-joiner': {
                char: '\u200C',
                html: '&#8204;',
                css: '\\200C',
                javascript: '\\u200C'
            },
            'left-to-right-mark': {
                char: '\u200E',
                html: '&#8206;',
                css: '\\200E',
                javascript: '\\u200E'
            }
        };

        return characterMap[type] || characterMap['zero-width-space'];
    }

    copyToClipboard() {
        const result = document.getElementById('result');
        result.select();
        document.execCommand('copy');

        // Show feedback
        const feedback = document.getElementById('copy-feedback');
        feedback.classList.remove('hidden');
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 2000);
    }

    animateResult() {
        const container = document.getElementById('result-container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 10);
    }
}

// Invisible Character Detector Component
class InvisibleCharacterDetector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 class="text-2xl font-bold mb-6 text-center">Invisible CharactersDetector</h3>
                
                <div class="space-y-6">
                    <!-- Input Area -->
                    <div>
                        <label for="detect-input" class="block text-sm font-medium mb-2">Input text</label>
                        <textarea id="detect-input" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700" rows="4" placeholder="Enter or paste text to detect invisible characters..."></textarea>
                    </div>

                    <!-- Detect Button -->
                    <button id="detect-btn" class="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105">
                        Detect Invisible Characters
                    </button>

                    <!-- Results -->
                    <div id="detect-results" class="hidden space-y-4">
                        <!-- Summary -->
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 class="font-medium mb-2">Detection summary</h4>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600 dark:text-gray-400">Total characters:</span>
                                    <span id="total-chars" class="font-medium ml-2">0</span>
                                </div>
                                <div>
                                    <span class="text-gray-600 dark:text-gray-400">Invisible Characters:</span>
                                    <span id="invisible-chars" class="font-medium ml-2 text-red-600">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Detailed Results -->
                        <div>
                            <h4 class="font-medium mb-2">Detailed results</h4>
                            <div id="detailed-results" class="space-y-2 max-h-60 overflow-y-auto"></div>
                        </div>

                        <!-- Clean Text -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Clean text</label>
                            <div class="relative">
                                <textarea id="clean-text" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm" rows="3" readonly></textarea>
                                <button id="copy-clean-btn" class="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('detect-btn').addEventListener('click', () => {
            this.detectInvisibleCharacters();
        });

        document.getElementById('copy-clean-btn').addEventListener('click', () => {
            this.copyCleanText();
        });

        // Auto-detect on input
        document.getElementById('detect-input').addEventListener('input', () => {
            clearTimeout(this.detectTimeout);
            this.detectTimeout = setTimeout(() => {
                this.detectInvisibleCharacters();
            }, 500);
        });
    }

    detectInvisibleCharacters() {
        const input = document.getElementById('detect-input').value;
        const invisibleChars = this.findInvisibleCharacters(input);

        this.displayResults(input, invisibleChars);
    }

    findInvisibleCharacters(text) {
        const invisibleCharPatterns = [
            { char: '\u200B', name: 'Zero Width Space', code: 'U+200B' },
            { char: '\u200C', name: 'Zero Width Non-Joiner', code: 'U+200C' },
            { char: '\u200D', name: 'Zero Width Joiner', code: 'U+200D' },
            { char: '\u200E', name: 'Left-to-Right Mark', code: 'U+200E' },
            { char: '\u200F', name: 'Right-to-Left Mark', code: 'U+200F' },
            { char: '\u2060', name: 'Word Joiner', code: 'U+2060' },
            { char: '\uFEFF', name: 'Zero Width No-Break Space', code: 'U+FEFF' }
        ];

        const results = [];
        
        invisibleCharPatterns.forEach(pattern => {
            const regex = new RegExp(pattern.char, 'g');
            let match;
            while ((match = regex.exec(text)) !== null) {
                results.push({
                    ...pattern,
                    position: match.index,
                    context: this.getContext(text, match.index, 10)
                });
            }
        });

        return results;
    }

    getContext(text, position, radius) {
        const start = Math.max(0, position - radius);
        const end = Math.min(text.length, position + radius + 1);
        return text.substring(start, end);
    }

    displayResults(originalText, invisibleChars) {
        const resultsContainer = document.getElementById('detect-results');
        
        if (invisibleChars.length === 0) {
            resultsContainer.innerHTML = `
                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-green-800 dark:text-green-200">No invisible characters detected</span>
                    </div>
                </div>
            `;
            resultsContainer.classList.remove('hidden');
            return;
        }

        // Update summary
        document.getElementById('total-chars').textContent = originalText.length;
        document.getElementById('invisible-chars').textContent = invisibleChars.length;

        // Display detailed results
        const detailedResults = document.getElementById('detailed-results');
        detailedResults.innerHTML = invisibleChars.map(char => `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-medium">${char.name}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">${char.code}</span>
                    </div>
                    <span class="text-sm text-gray-500">Position: ${char.position}</span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                    ...${char.context}...
                </div>
            </div>
        `).join('');

        // Generate clean text
        const cleanText = this.removeInvisibleCharacters(originalText);
        document.getElementById('clean-text').value = cleanText;

        resultsContainer.classList.remove('hidden');
    }

    removeInvisibleCharacters(text) {
        const invisibleCharRegex = /[\u200B-\u200F\u2060\uFEFF]/g;
        return text.replace(invisibleCharRegex, '');
    }

    copyCleanText() {
        const cleanText = document.getElementById('clean-text');
        cleanText.select();
        document.execCommand('copy');

        // Show feedback
        const btn = document.getElementById('copy-clean-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('bg-green-600');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-600');
        }, 2000);
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize generator if container exists
    if (document.getElementById('generator-container')) {
        window.invisibleCharacterGenerator = new InvisibleCharacterGenerator('generator-container');
    }

    // Initialize detector if container exists
    if (document.getElementById('detector-container')) {
        window.invisibleCharacterDetector = new InvisibleCharacterDetector('detector-container');
    }
});