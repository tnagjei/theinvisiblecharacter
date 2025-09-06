/**
 * Invisible Characters Library Management System
 * Manages the collection and operations of invisible Unicode characters
 */

class InvisibleCharacterLibrary {
    constructor() {
        this.characters = this.initializeCharacters();
        this.selectedCharacters = new Set();
        this.searchTerm = '';
        this.sortBy = 'usage';
        this.init();
    }

    init() {
        // Load saved preferences
        this.loadPreferences();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Emit initialization event
        this.emitEvent('libraryInitialized', {
            totalCharacters: this.characters.length
        });
    }

    initializeCharacters() {
        return [
            {
                id: 'u2800',
                unicode: 'U+2800',
                character: '⠀',
                name: '盲文空白字符',
                englishName: 'Braille Pattern Blank',
                description: '用于盲文系统的空白字符，在某些系统中显示为空白',
                usage: '文本隐藏、格式化',
                category: 'braille',
                popularity: 85,
                htmlEntity: '&#10240;',
                cssEscape: '\\2800',
                javascriptEscape: '\\u2800',
                examples: ['用于隐藏文本内容', '在社交媒体上创建空白信息'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u3164',
                unicode: 'U+3164',
                character: 'ㅤ',
                name: '韩文填充字符',
                englishName: 'Hangul Filler',
                description: '韩文字符集中的填充字符，通常显示为空白',
                usage: '文本填充、格式化',
                category: 'hangul',
                popularity: 78,
                htmlEntity: '&#12644;',
                cssEscape: '\\3164',
                javascriptEscape: '\\u3164',
                examples: ['在韩文文本中创建空白', '用于文本对齐'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2060',
                unicode: 'U+2060',
                character: '​',
                name: '单词连接符',
                englishName: 'Word Joiner',
                description: '防止在指定位置换行的字符，保持单词或短语完整性',
                usage: '文本格式化、防止换行',
                category: 'formatting',
                popularity: 92,
                htmlEntity: '&#8288;',
                cssEscape: '\\2060',
                javascriptEscape: '\\u2060',
                examples: ['防止URL断行', '保持专有名词完整性'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200b',
                unicode: 'U+200B',
                character: '​',
                name: '零宽空格',
                englishName: 'Zero Width Space',
                description: '宽度为零的空格字符，用于在不需要可见空格的地方分隔文本',
                usage: '文本分隔、格式化',
                category: 'spacing',
                popularity: 95,
                htmlEntity: '&#8203;',
                cssEscape: '\\200B',
                javascriptEscape: '\\u200B',
                examples: ['在长单词中插入断点', '创建不可见的文本分隔'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200c',
                unicode: 'U+200C',
                character: '‌',
                name: '零宽非连接符',
                englishName: 'Zero Width Non-Joiner',
                description: '防止字符连接的零宽字符，用于控制连字行为',
                usage: '文本控制、连字预防',
                category: 'formatting',
                popularity: 88,
                htmlEntity: '&#8204;',
                cssEscape: '\\200C',
                javascriptEscape: '\\u200C',
                examples: ['防止阿拉伯语连字', '控制复杂文本布局'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200d',
                unicode: 'U+200D',
                character: '‍',
                name: '零宽连接符',
                englishName: 'Zero Width Joiner',
                description: '强制字符连接的零宽字符，用于创建连字或组合字符',
                usage: '字符连接、表情符号组合',
                category: 'formatting',
                popularity: 90,
                htmlEntity: '&#8205;',
                cssEscape: '\\200D',
                javascriptEscape: '\\u200D',
                examples: ['创建组合表情符号', '强制字符连接'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2063',
                unicode: 'U+2063',
                character: '⁣',
                name: '不可见分隔符',
                englishName: 'Invisible Separator',
                description: '用于分隔数字或其他文本元素，但不显示可见的分隔符',
                usage: '数字格式化、文本分隔',
                category: 'separator',
                popularity: 82,
                htmlEntity: '&#8291;',
                cssEscape: '\\2063',
                javascriptEscape: '\\u2063',
                examples: ['数字分组', '文本元素分隔'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2061',
                unicode: 'U+2061',
                character: '⁡',
                name: '函数应用符',
                englishName: 'Function Application',
                description: '数学函数应用字符，用于数学表达式',
                usage: '数学表达式、函数调用',
                category: 'mathematical',
                popularity: 75,
                htmlEntity: '&#8289;',
                cssEscape: '\\2061',
                javascriptEscape: '\\u2061',
                examples: ['数学函数表示', '公式格式化'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2062',
                unicode: 'U+2062',
                character: '⁢',
                name: '不可见乘号',
                englishName: 'Invisible Times',
                description: '数学乘法运算符，通常不可见',
                usage: '数学表达式、乘法运算',
                category: 'mathematical',
                popularity: 73,
                htmlEntity: '&#8290;',
                cssEscape: '\\2062',
                javascriptEscape: '\\u2062',
                examples: ['数学乘法', '代数表达式'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200e',
                unicode: 'U+200E',
                character: '‎',
                name: '左至右标记',
                englishName: 'Left-to-Right Mark',
                description: '指定文本方向的标记字符，用于双向文本处理',
                usage: '文本方向控制、国际化',
                category: 'directional',
                popularity: 80,
                htmlEntity: '&#8206;',
                cssEscape: '\\200E',
                javascriptEscape: '\\u200E',
                examples: ['强制LTR方向', '混合语言文本处理'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200f',
                unicode: 'U+200F',
                character: '‏',
                name: '右至左标记',
                englishName: 'Right-to-Left Mark',
                description: '指定文本方向的标记字符，用于双向文本处理',
                usage: '文本方向控制、国际化',
                category: 'directional',
                popularity: 79,
                htmlEntity: '&#8207;',
                cssEscape: '\\200F',
                javascriptEscape: '\\u200F',
                examples: ['强制RTL方向', '阿拉伯语/希伯来语文本'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u202a',
                unicode: 'U+202A',
                character: '‪',
                name: '左至右嵌入',
                englishName: 'Left-to-Right Embedding',
                description: '嵌入左至右文本方向的字符',
                usage: '文本方向控制、复杂布局',
                category: 'directional',
                popularity: 70,
                htmlEntity: '&#8234;',
                cssEscape: '\\202A',
                javascriptEscape: '\\u202A',
                examples: ['嵌入LTR文本块', '混合方向文档'],
                isVisible: false,
                length: 1
            }
        ];
    }

    setupEventListeners() {
        // Listen for selection changes
        document.addEventListener('characterSelected', (e) => {
            this.handleCharacterSelection(e.detail.characterId, e.detail.selected);
        });

        // Listen for search requests
        document.addEventListener('searchCharacters', (e) => {
            this.setSearchTerm(e.detail.term);
        });

        // Listen for sort requests
        document.addEventListener('sortCharacters', (e) => {
            this.setSortBy(e.detail.sortBy);
        });

        // Listen for bulk operations
        document.addEventListener('bulkOperation', (e) => {
            this.handleBulkOperation(e.detail.operation, e.detail.characterIds);
        });
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem('invisibleCharactersPrefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.selectedCharacters = new Set(prefs.selectedCharacters || []);
                this.sortBy = prefs.sortBy || 'usage';
            }
        } catch (error) {
            console.warn('Failed to load character preferences:', error);
        }
    }

    savePreferences() {
        try {
            const prefs = {
                selectedCharacters: Array.from(this.selectedCharacters),
                sortBy: this.sortBy,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('invisibleCharactersPrefs', JSON.stringify(prefs));
        } catch (error) {
            console.warn('Failed to save character preferences:', error);
        }
    }

    getCharacters(filters = {}) {
        let filtered = [...this.characters];

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(char => 
                char.name.toLowerCase().includes(term) ||
                char.englishName.toLowerCase().includes(term) ||
                char.unicode.toLowerCase().includes(term) ||
                char.description.toLowerCase().includes(term) ||
                char.category.toLowerCase().includes(term)
            );
        }

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(char => char.category === filters.category);
        }

        // Apply visibility filter
        if (filters.visible !== undefined) {
            filtered = filtered.filter(char => char.isVisible === filters.visible);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'usage':
                    return b.popularity - a.popularity;
                case 'name':
                    return a.name.localeCompare(b.name, 'zh-CN');
                case 'unicode':
                    return a.unicode.localeCompare(b.unicode);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    getCharacterById(id) {
        return this.characters.find(char => char.id === id);
    }

    getCharactersByIds(ids) {
        return this.characters.filter(char => ids.includes(char.id));
    }

    getCategories() {
        const categories = new Set(this.characters.map(char => char.category));
        return Array.from(categories).sort();
    }

    getSelectedCharacters() {
        return this.getCharacters().filter(char => this.selectedCharacters.has(char.id));
    }

    selectCharacter(characterId, selected = true) {
        if (selected) {
            this.selectedCharacters.add(characterId);
        } else {
            this.selectedCharacters.delete(characterId);
        }
        this.savePreferences();
        this.emitEvent('selectionChanged', {
            characterId,
            selected,
            totalSelected: this.selectedCharacters.size
        });
    }

    toggleCharacterSelection(characterId) {
        const isSelected = this.selectedCharacters.has(characterId);
        this.selectCharacter(characterId, !isSelected);
    }

    selectAllCharacters(selected = true) {
        if (selected) {
            this.characters.forEach(char => this.selectedCharacters.add(char.id));
        } else {
            this.selectedCharacters.clear();
        }
        this.savePreferences();
        this.emitEvent('selectionChanged', {
            allCharacters: true,
            selected,
            totalSelected: this.selectedCharacters.size
        });
    }

    setSearchTerm(term) {
        this.searchTerm = term;
        this.emitEvent('searchChanged', {
            term,
            resultCount: this.getCharacters().length
        });
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.savePreferences();
        this.emitEvent('sortChanged', { sortBy });
    }

    handleCharacterSelection(characterId, selected) {
        this.selectCharacter(characterId, selected);
    }

    handleBulkOperation(operation, characterIds) {
        switch (operation) {
            case 'copy':
                this.copyCharacters(characterIds);
                break;
            case 'select':
                characterIds.forEach(id => this.selectCharacter(id, true));
                break;
            case 'deselect':
                characterIds.forEach(id => this.selectCharacter(id, false));
                break;
            case 'export':
                this.exportCharacters(characterIds);
                break;
        }
    }

    copyCharacters(characterIds) {
        const characters = this.getCharactersByIds(characterIds);
        const text = characters.map(char => char.character).join('');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.emitEvent('charactersCopied', {
                    characterIds,
                    count: characterIds.length
                });
            }).catch(err => {
                console.error('Failed to copy characters:', err);
                this.emitEvent('copyFailed', { error: err });
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.emitEvent('charactersCopied', {
                    characterIds,
                    count: characterIds.length
                });
            } catch (err) {
                console.error('Failed to copy characters:', err);
                this.emitEvent('copyFailed', { error: err });
            }
            
            document.body.removeChild(textArea);
        }
    }

    exportCharacters(characterIds) {
        const characters = this.getCharactersByIds(characterIds);
        const exportData = {
            characters: characters.map(char => ({
                id: char.id,
                unicode: char.unicode,
                character: char.character,
                name: char.name,
                description: char.description,
                category: char.category
            })),
            exportedAt: new Date().toISOString(),
            total: characterIds.length
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invisible-characters-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.emitEvent('charactersExported', {
            characterIds,
            count: characterIds.length
        });
    }

    getCharacterStats() {
        const stats = {
            total: this.characters.length,
            selected: this.selectedCharacters.size,
            categories: this.getCategories().length,
            mostPopular: this.characters.reduce((prev, current) => 
                prev.popularity > current.popularity ? prev : current
            ),
            categoryStats: {}
        };

        this.characters.forEach(char => {
            if (!stats.categoryStats[char.category]) {
                stats.categoryStats[char.category] = {
                    count: 0,
                    totalPopularity: 0
                };
            }
            stats.categoryStats[char.category].count++;
            stats.categoryStats[char.category].totalPopularity += char.popularity;
        });

        return stats;
    }

    validateCharacter(character) {
        // Validate if a character is a valid invisible character
        const invisibleCharRegex = /[\u2800\u3164\u2060\u200B\u200C\u200D\u2063\u2061\u2062\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u205F\u3000\uFEFF\u00A0\u180E\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/;
        return invisibleCharRegex.test(character);
    }

    detectInvisibleCharacters(text) {
        const detected = [];
        const invisibleCharRegex = /[\u2800\u3164\u2060\u200B\u200C\u200D\u2063\u2061\u2062\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u205F\u3000\uFEFF\u00A0\u180E\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/g;
        
        let match;
        while ((match = invisibleCharRegex.exec(text)) !== null) {
            const char = match[0];
            const charData = this.characters.find(c => c.character === char);
            
            detected.push({
                character: char,
                position: match.index,
                data: charData || {
                    character: char,
                    unicode: `U+${char.charCodeAt(0).toString(16).toUpperCase()}`,
                    name: '未知隐形字符',
                    description: '未在库中识别的隐形字符'
                }
            });
        }
        
        return detected;
    }

    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Utility methods
    getCharacterHtmlRepresentation(character) {
        const charData = this.getCharacterById(character) || 
                         this.characters.find(c => c.character === character);
        
        if (charData) {
            return charData.htmlEntity;
        }
        
        // Fallback to numeric entity
        const code = character.charCodeAt(0);
        return `&#${code};`;
    }

    getCharacterCssRepresentation(character) {
        const charData = this.getCharacterById(character) || 
                         this.characters.find(c => c.character === character);
        
        if (charData) {
            return charData.cssEscape;
        }
        
        // Fallback to unicode escape
        const code = character.charCodeAt(0);
        return `\\${code.toString(16).toUpperCase()}`;
    }

    getCharacterJavascriptRepresentation(character) {
        const charData = this.getCharacterById(character) || 
                         this.characters.find(c => c.character === character);
        
        if (charData) {
            return charData.javascriptEscape;
        }
        
        // Fallback to unicode escape
        const code = character.charCodeAt(0);
        return `\\u${code.toString(16).toUpperCase().padStart(4, '0')}`;
    }

    destroy() {
        // Clean up event listeners and resources
        this.selectedCharacters.clear();
        this.characters = [];
        this.searchTerm = '';
    }
}

// Initialize the library when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.invisibleCharacterLibrary = new InvisibleCharacterLibrary();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvisibleCharacterLibrary;
}

// Export for ES modules
if (typeof export !== 'undefined') {
    export { InvisibleCharacterLibrary };
}