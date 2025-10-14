/**
 * Invisible Character Detector
 * Advanced detection and analysis of invisible characters in text
 */

class InvisibleCharacterDetector {
    constructor() {
        this.detectionResults = new Map();
        this.isRealTimeEnabled = false;
        this.detectionHistory = [];
        this.maxHistory = 50;
        this.settings = {
            showPositions: true,
            showUnicode: true,
            highlightCharacters: true,
            autoDetect: true,
            caseSensitive: false,
            showStatistics: true
        };
        this.init();
    }

    init() {
        // Load settings
        this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize detection patterns
        this.initializePatterns();
        
        // Emit initialization event
        this.emitEvent('detectorInitialized', {
            patternsCount: this.patterns.length,
            settings: this.settings
        });
    }

    initializePatterns() {
        // Comprehensive list of invisible character patterns
        this.patterns = [
            // Zero-width characters
            {
                name: 'Zero Width Space',
                unicode: 'U+200B',
                regex: /\u200B/g,
                category: 'zero-width',
                description: '零宽空格 - 用于文本分隔的不可见空格',
                risk: 'low'
            },
            {
                name: 'Zero Width Non-Joiner',
                unicode: 'U+200C',
                regex: /\u200C/g,
                category: 'zero-width',
                description: '零宽非连接符 - 防止字符连接',
                risk: 'low'
            },
            {
                name: 'Zero Width Joiner',
                unicode: 'U+200D',
                regex: /\u200D/g,
                category: 'zero-width',
                description: '零宽连接符 - 强制字符连接',
                risk: 'low'
            },
            
            // Directional formatting characters
            {
                name: 'Left-to-Right Mark',
                unicode: 'U+200E',
                regex: /\u200E/g,
                category: 'directional',
                description: '左至右标记 - 指定文本方向',
                risk: 'medium'
            },
            {
                name: 'Right-to-Left Mark',
                unicode: 'U+200F',
                regex: /\u200F/g,
                category: 'directional',
                description: '右至左标记 - 指定文本方向',
                risk: 'medium'
            },
            {
                name: 'Left-to-Right Embedding',
                unicode: 'U+202A',
                regex: /\u202A/g,
                category: 'directional',
                description: '左至右嵌入 - 嵌入LTR文本',
                risk: 'medium'
            },
            {
                name: 'Right-to-Left Embedding',
                unicode: 'U+202B',
                regex: /\u202B/g,
                category: 'directional',
                description: '右至左嵌入 - 嵌入RTL文本',
                risk: 'medium'
            },
            
            // Other invisible characters
            {
                name: 'Word Joiner',
                unicode: 'U+2060',
                regex: /\u2060/g,
                category: 'formatting',
                description: '单词连接符 - 防止换行',
                risk: 'low'
            },
            {
                name: 'Invisible Separator',
                unicode: 'U+2063',
                regex: /\u2063/g,
                category: 'separator',
                description: '不可见分隔符 - 分隔文本元素',
                risk: 'low'
            },
            {
                name: 'Function Application',
                unicode: 'U+2061',
                regex: /\u2061/g,
                category: 'mathematical',
                description: '函数应用符 - 数学表达式',
                risk: 'low'
            },
            {
                name: 'Invisible Times',
                unicode: 'U+2062',
                regex: /\u2062/g,
                category: 'mathematical',
                description: '不可见乘号 - 数学乘法',
                risk: 'low'
            },
            {
                name: 'Braille Pattern Blank',
                unicode: 'U+2800',
                regex: /\u2800/g,
                category: 'braille',
                description: '盲文空白字符 - 盲文系统空白',
                risk: 'low'
            },
            {
                name: 'Hangul Filler',
                unicode: 'U+3164',
                regex: /\u3164/g,
                category: 'hangul',
                description: '韩文填充字符 - 韩文填充',
                risk: 'low'
            },
            
            // Whitespace characters
            {
                name: 'Non-Breaking Space',
                unicode: 'U+00A0',
                regex: /\u00A0/g,
                category: 'whitespace',
                description: '不间断空格 - 防止换行的空格',
                risk: 'low'
            },
            {
                name: 'En Quad',
                unicode: 'U+2000',
                regex: /\u2000/g,
                category: 'whitespace',
                description: 'En空格 - 1个Em宽度的一半',
                risk: 'low'
            },
            {
                name: 'Em Quad',
                unicode: 'U+2001',
                regex: /\u2001/g,
                category: 'whitespace',
                description: 'Em空格 - 1个Em宽度',
                risk: 'low'
            },
            {
                name: 'En Space',
                unicode: 'U+2002',
                regex: /\u2002/g,
                category: 'whitespace',
                description: 'En空格 - 1个En宽度',
                risk: 'low'
            },
            {
                name: 'Em Space',
                unicode: 'U+2003',
                regex: /\u2003/g,
                category: 'whitespace',
                description: 'Em空格 - 1个Em宽度',
                risk: 'low'
            },
            {
                name: 'Thin Space',
                unicode: 'U+2009',
                regex: /\u2009/g,
                category: 'whitespace',
                description: '细空格 - 1/5个Em宽度',
                risk: 'low'
            },
            {
                name: 'Hair Space',
                unicode: 'U+200A',
                regex: /\u200A/g,
                category: 'whitespace',
                description: '极细空格 - 最窄空格',
                risk: 'low'
            },
            
            // Control characters
            {
                name: 'Line Separator',
                unicode: 'U+2028',
                regex: /\u2028/g,
                category: 'control',
                description: '行分隔符 - 分隔行',
                risk: 'medium'
            },
            {
                name: 'Paragraph Separator',
                unicode: 'U+2029',
                regex: /\u2029/g,
                category: 'control',
                description: '段落分隔符 - 分隔段落',
                risk: 'medium'
            },
            
            // Other special characters
            {
                name: 'Zero Width No-Break Space',
                unicode: 'U+FEFF',
                regex: /\uFEFF/g,
                category: 'control',
                description: '零宽不间断空格 - BOM标记',
                risk: 'high'
            }
        ];
    }

    setupEventListeners() {
        // Listen for detection requests
        document.addEventListener('detectInvisibleCharacters', (e) => {
            this.detectInvisibleCharacters(e.detail.text, e.detail.options);
        });

        // Listen for real-time detection toggle
        document.addEventListener('toggleRealTimeDetection', (e) => {
            this.toggleRealTimeDetection(e.detail.enabled);
        });

        // Listen for settings updates
        document.addEventListener('updateDetectorSettings', (e) => {
            this.updateSettings(e.detail.settings);
        });

        // Listen for clear results
        document.addEventListener('clearDetectionResults', () => {
            this.clearResults();
        });

        // Listen for export results
        document.addEventListener('exportDetectionResults', (e) => {
            this.exportResults(e.detail.format);
        });

        // Listen for clean text request
        document.addEventListener('cleanInvisibleCharacters', (e) => {
            this.cleanInvisibleCharacters(e.detail.text, e.detail.options);
        });
    }

    detectInvisibleCharacters(text, options = {}) {
        if (!text || typeof text !== 'string') {
            return {
                success: false,
                error: 'Invalid text input',
                results: []
            };
        }

        const detectionId = Date.now();
        const startTime = performance.now();
        
        // Merge options with settings
        const detectionOptions = {
            ...this.settings,
            ...options
        };

        const results = [];
        let totalMatches = 0;
        const categoryStats = {};

        // Detect each pattern
        this.patterns.forEach(pattern => {
            const matches = [];
            let match;
            
            // Reset regex for multiple uses
            pattern.regex.lastIndex = 0;
            
            while ((match = pattern.regex.exec(text)) !== null) {
                matches.push({
                    position: match.index,
                    character: match[0],
                    length: match[0].length
                });
            }

            if (matches.length > 0) {
                const result = {
                    pattern: pattern.name,
                    unicode: pattern.unicode,
                    category: pattern.category,
                    description: pattern.description,
                    risk: pattern.risk,
                    matches: matches,
                    count: matches.length,
                    highlightedText: this.highlightMatches(text, matches, detectionOptions)
                };

                results.push(result);
                totalMatches += matches.length;

                // Update category statistics
                if (!categoryStats[pattern.category]) {
                    categoryStats[pattern.category] = {
                        count: 0,
                        patterns: []
                    };
                }
                categoryStats[pattern.category].count += matches.length;
                categoryStats[pattern.category].patterns.push(pattern.name);
            }
        });

        const endTime = performance.now();
        const processingTime = endTime - startTime;

        const detectionResult = {
            id: detectionId,
            text: text,
            results: results,
            totalMatches: totalMatches,
            categoryStats: categoryStats,
            processingTime: processingTime,
            timestamp: new Date().toISOString(),
            options: detectionOptions,
            textLength: text.length,
            hasInvisibleCharacters: totalMatches > 0
        };

        // Store results
        this.detectionResults.set(detectionId, detectionResult);
        
        // Add to history
        this.addToHistory(detectionResult);

        // Emit results
        this.emitEvent('detectionCompleted', detectionResult);

        return detectionResult;
    }

    highlightMatches(text, matches, options) {
        if (!options.highlightCharacters) {
            return text;
        }

        let highlightedText = text;
        let offset = 0;

        // Sort matches by position in reverse order to avoid offset issues
        const sortedMatches = [...matches].sort((a, b) => b.position - a.position);

        sortedMatches.forEach(match => {
            const before = highlightedText.substring(0, match.position + offset);
            const character = highlightedText.substring(match.position + offset, match.position + offset + match.length);
            const after = highlightedText.substring(match.position + offset + match.length);

            const highlighted = `<span class="invisible-char-highlight" data-unicode="${this.getUnicodeForChar(character)}" data-risk="low">${character}</span>`;
            highlightedText = before + highlighted + after;
            offset += highlighted.length - character.length;
        });

        return highlightedText;
    }

    getUnicodeForChar(character) {
        const code = character.charCodeAt(0);
        return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
    }

    cleanInvisibleCharacters(text, options = {}) {
        const {
            removeZeroWidth = true,
            removeDirectional = true,
            removeWhitespace = false,
            removeControl = false,
            removeHighRisk = true,
            customPatterns = []
        } = options;

        let cleanedText = text;
        const removedCharacters = [];

        // Build removal patterns based on options
        const removalPatterns = [];

        if (removeZeroWidth) {
            removalPatterns.push(/\u200B/g, /\u200C/g, /\u200D/g, /\u2060/g);
        }

        if (removeDirectional) {
            removalPatterns.push(/\u200E/g, /\u200F/g, /\u202A/g, /\u202B/g);
        }

        if (removeWhitespace) {
            removalPatterns.push(/\u00A0/g, /\u2000/g, /\u2001/g, /\u2002/g, /\u2003/g, /\u2009/g, /\u200A/g);
        }

        if (removeControl) {
            removalPatterns.push(/\u2028/g, /\u2029/g, /\uFEFF/g);
        }

        if (removeHighRisk) {
            removalPatterns.push(/\uFEFF/g); // BOM character
        }

        // Add custom patterns
        removalPatterns.push(...customPatterns);

        // Track removed characters
        removalPatterns.forEach(pattern => {
            const matches = cleanedText.match(pattern);
            if (matches) {
                removedCharacters.push(...matches);
            }
            cleanedText = cleanedText.replace(pattern, '');
        });

        const cleanResult = {
            originalText: text,
            cleanedText: cleanedText,
            removedCharacters: removedCharacters,
            removedCount: removedCharacters.length,
            options: options,
            timestamp: new Date().toISOString()
        };

        // Emit clean result
        this.emitEvent('cleaningCompleted', cleanResult);

        return cleanResult;
    }

    toggleRealTimeDetection(enabled) {
        this.isRealTimeEnabled = enabled;
        
        if (enabled) {
            this.setupRealTimeDetection();
        } else {
            this.removeRealTimeDetection();
        }

        this.emitEvent('realTimeDetectionToggled', { enabled });
    }

    setupRealTimeDetection() {
        // Setup input event listeners for real-time detection
        const inputs = document.querySelectorAll('textarea, input[type="text"]');
        
        inputs.forEach(input => {
            if (input.hasAttribute('data-real-time-detect')) {
                const handler = (e) => {
                    const text = e.target.value;
                    if (text.length > 0) {
                        this.detectInvisibleCharacters(text, { autoDetect: true });
                    }
                };
                
                input.addEventListener('input', handler);
                input.dataset.realTimeHandler = 'true';
            }
        });
    }

    removeRealTimeDetection() {
        const inputs = document.querySelectorAll('textarea[data-real-time-handler], input[data-real-time-handler]');
        
        inputs.forEach(input => {
            // Clone and replace to remove all event listeners
            const clone = input.cloneNode(true);
            clone.removeAttribute('data-real-time-handler');
            input.parentNode.replaceChild(clone, input);
        });
    }

    updateSettings(newSettings) {
        this.settings = {
            ...this.settings,
            ...newSettings
        };
        
        this.saveSettings();
        this.emitEvent('detectorSettingsUpdated', { settings: this.settings });
    }

    addToHistory(detectionResult) {
        this.detectionHistory.unshift(detectionResult);
        
        // Limit history size
        if (this.detectionHistory.length > this.maxHistory) {
            this.detectionHistory = this.detectionHistory.slice(0, this.maxHistory);
        }

        this.saveHistory();
    }

    saveHistory() {
        try {
            // Save only essential data to reduce storage size
            const compressedHistory = this.detectionHistory.map(item => ({
                id: item.id,
                totalMatches: item.totalMatches,
                timestamp: item.timestamp,
                textLength: item.textLength,
                hasInvisibleCharacters: item.hasInvisibleCharacters
            }));
            
            localStorage.setItem('detectionHistory', JSON.stringify(compressedHistory));
        } catch (error) {
            console.warn('Failed to save detection history:', error);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('detectionHistory');
            if (saved) {
                this.detectionHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load detection history:', error);
            this.detectionHistory = [];
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('detectorSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save detector settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('detectorSettings');
            if (saved) {
                this.settings = {
                    ...this.settings,
                    ...JSON.parse(saved)
                };
            }
        } catch (error) {
            console.warn('Failed to load detector settings:', error);
        }
    }

    clearResults() {
        this.detectionResults.clear();
        this.emitEvent('detectionResultsCleared', {});
    }

    exportResults(format = 'json') {
        const results = Array.from(this.detectionResults.values());
        
        switch (format) {
            case 'json':
                this.exportAsJson(results);
                break;
            case 'csv':
                this.exportAsCsv(results);
                break;
            case 'txt':
                this.exportAsText(results);
                break;
            default:
                console.warn('Unsupported export format:', format);
        }
    }

    exportAsJson(results) {
        const data = {
            exportedAt: new Date().toISOString(),
            totalResults: results.length,
            results: results
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        this.downloadFile(blob, `detection-results-${new Date().toISOString().split('T')[0]}.json`);
    }

    exportAsCsv(results) {
        let csv = 'Detection ID,Text Length,Total Matches,Has Invisible Characters,Timestamp\n';
        
        results.forEach(result => {
            csv += `${result.id},${result.textLength},${result.totalMatches},${result.hasInvisibleCharacters},"${result.timestamp}"\n`;
        });

        const blob = new Blob([csv], {
            type: 'text/csv'
        });

        this.downloadFile(blob, `detection-results-${new Date().toISOString().split('T')[0]}.csv`);
    }

    exportAsText(results) {
        let text = 'Invisible Character Detection Results\n';
        text += '=' .repeat(50) + '\n\n';
        
        results.forEach(result => {
            text += `Detection ID: ${result.id}\n`;
            text += `Timestamp: ${result.timestamp}\n`;
            text += `Text Length: ${result.textLength}\n`;
            text += `Total Matches: ${result.totalMatches}\n`;
            text += `Has Invisible Characters: ${result.hasInvisibleCharacters}\n`;
            
            if (result.results.length > 0) {
                text += '\nDetected Characters:\n';
                result.results.forEach(r => {
                    text += `  - ${r.pattern} (${r.unicode}): ${r.count} matches\n`;
                });
            }
            
            text += '\n' + '='.repeat(50) + '\n\n';
        });

        const blob = new Blob([text], {
            type: 'text/plain'
        });

        this.downloadFile(blob, `detection-results-${new Date().toISOString().split('T')[0]}.txt`);
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getStatistics() {
        const stats = {
            totalDetections: this.detectionResults.size,
            historySize: this.detectionHistory.length,
            patternsCount: this.patterns.length,
            categories: [...new Set(this.patterns.map(p => p.category))],
            riskLevels: [...new Set(this.patterns.map(p => p.risk))],
            mostDetected: this.getMostDetectedPatterns(),
            averageProcessingTime: this.getAverageProcessingTime()
        };

        return stats;
    }

    getMostDetectedPatterns() {
        const patternCounts = {};
        
        this.detectionHistory.forEach(result => {
            result.results.forEach(r => {
                if (!patternCounts[r.pattern]) {
                    patternCounts[r.pattern] = 0;
                }
                patternCounts[r.pattern] += r.count;
            });
        });

        return Object.entries(patternCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([pattern, count]) => ({ pattern, count }));
    }

    getAverageProcessingTime() {
        if (this.detectionHistory.length === 0) return 0;
        
        const totalTime = this.detectionHistory.reduce((sum, result) => sum + result.processingTime, 0);
        return totalTime / this.detectionHistory.length;
    }

    // Utility methods
    getPatternByUnicode(unicode) {
        return this.patterns.find(p => p.unicode === unicode);
    }

    getPatternsByCategory(category) {
        return this.patterns.filter(p => p.category === category);
    }

    getPatternsByRisk(risk) {
        return this.patterns.filter(p => p.risk === risk);
    }

    validateText(text) {
        return typeof text === 'string' && text.length > 0;
    }

    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Destroy method for cleanup
    destroy() {
        this.detectionResults.clear();
        this.detectionHistory = [];
        this.removeRealTimeDetection();
    }
}

// Initialize detector when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.invisibleCharacterDetector = new InvisibleCharacterDetector();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvisibleCharacterDetector;
}

// Export for ES modules
if (typeof exports !== 'undefined') {
    exports.InvisibleCharacterDetector = InvisibleCharacterDetector;
}