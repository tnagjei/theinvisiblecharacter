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
                name: 'Braille Pattern Blank',
                englishName: 'Braille Pattern Blank',
                description: 'Blank character used in braille systems, displayed as blank in some systems',
                usage: 'Text hiding, formatting',
                category: 'braille',
                icon: 'assets/icons/icon-braille.svg',
                popularity: 85,
                htmlEntity: '&#10240;',
                cssEscape: '\\2800',
                javascriptEscape: '\\u2800',
                examples: ['Used to hide text content', 'Create blank messages on social media'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u3164',
                unicode: 'U+3164',
                character: 'ㅤ',
                name: 'Hangul Filler',
                englishName: 'Hangul Filler',
                description: 'Filler character in the Hangul character set, usually displayed as blank',
                usage: 'Text filling, formatting',
                category: 'hangul',
                icon: 'assets/icons/icon-hangul.svg',
                popularity: 78,
                htmlEntity: '&#12644;',
                cssEscape: '\\3164',
                javascriptEscape: '\\u3164',
                examples: ['Create blank spaces in Korean text', 'Used for text alignment'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2060',
                unicode: 'U+2060',
                character: '​',
                name: 'Word Joiner',
                englishName: 'Word Joiner',
                description: 'Character that prevents line breaks at specified positions, maintaining word or phrase integrity',
                usage: 'Text formatting, prevent line breaks',
                category: 'formatting',
                icon: 'assets/icons/icon-formatting.svg',
                popularity: 92,
                htmlEntity: '&#8288;',
                cssEscape: '\\2060',
                javascriptEscape: '\\u2060',
                examples: ['Prevent URL line breaks', 'Maintain proper noun integrity'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200b',
                unicode: 'U+200B',
                character: '​',
                name: 'Zero Width Space',
                englishName: 'Zero Width Space',
                description: 'Zero-width space character used to separate text where no visible space is needed',
                usage: 'Text separation, formatting',
                category: 'spacing',
                icon: 'assets/icons/icon-spacing.svg',
                popularity: 95,
                htmlEntity: '&#8203;',
                cssEscape: '\\200B',
                javascriptEscape: '\\u200B',
                examples: ['Insert breakpoints in long words', 'Create invisible text separation'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200c',
                unicode: 'U+200C',
                character: '‌',
                name: 'Zero Width Non-Joiner',
                englishName: 'Zero Width Non-Joiner',
                description: 'Zero-width character that prevents character joining, used to control ligature behavior',
                usage: 'Text control, ligature prevention',
                category: 'formatting',
                icon: 'assets/icons/icon-formatting.svg',
                popularity: 88,
                htmlEntity: '&#8204;',
                cssEscape: '\\200C',
                javascriptEscape: '\\u200C',
                examples: ['Prevent Arabic ligatures', 'Control complex text layouts'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200d',
                unicode: 'U+200D',
                character: '‍',
                name: 'Zero Width Joiner',
                englishName: 'Zero Width Joiner',
                description: 'Zero-width character that forces character joining, used to create ligatures or combined characters',
                usage: 'Character joining, emoji combination',
                category: 'formatting',
                icon: 'assets/icons/icon-formatting.svg',
                popularity: 90,
                htmlEntity: '&#8205;',
                cssEscape: '\\200D',
                javascriptEscape: '\\u200D',
                examples: ['Create combined emojis', 'Force character joining'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2063',
                unicode: 'U+2063',
                character: '⁣',
                name: 'Invisible Separator',
                englishName: 'Invisible Separator',
                description: 'Used to separate numbers or other text elements without displaying visible separators',
                usage: 'Number formatting, text separation',
                category: 'separator',
                icon: 'assets/icons/icon-separator.svg',
                popularity: 82,
                htmlEntity: '&#8291;',
                cssEscape: '\\2063',
                javascriptEscape: '\\u2063',
                examples: ['Number grouping', 'Text element separation'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2061',
                unicode: 'U+2061',
                character: '⁡',
                name: 'Function Application',
                englishName: 'Function Application',
                description: 'Mathematical function application character used in mathematical expressions',
                usage: 'Mathematical expressions, function calls',
                category: 'mathematical',
                icon: 'assets/icons/icon-mathematical.svg',
                popularity: 75,
                htmlEntity: '&#8289;',
                cssEscape: '\\2061',
                javascriptEscape: '\\u2061',
                examples: ['Mathematical function representation', 'Formula formatting'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u2062',
                unicode: 'U+2062',
                character: '⁢',
                name: 'Invisible Times',
                englishName: 'Invisible Times',
                description: 'Mathematical multiplication operator, usually invisible',
                usage: 'Mathematical expressions, multiplication operations',
                category: 'mathematical',
                icon: 'assets/icons/icon-mathematical.svg',
                popularity: 73,
                htmlEntity: '&#8290;',
                cssEscape: '\\2062',
                javascriptEscape: '\\u2062',
                examples: ['Mathematical multiplication', 'Algebraic expressions'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200e',
                unicode: 'U+200E',
                character: '‎',
                name: 'Left-to-Right Mark',
                englishName: 'Left-to-Right Mark',
                description: 'Mark character that specifies text direction for bidirectional text processing',
                usage: 'Text direction control, internationalization',
                category: 'directional',
                icon: 'assets/icons/icon-directional.svg',
                popularity: 80,
                htmlEntity: '&#8206;',
                cssEscape: '\\200E',
                javascriptEscape: '\\u200E',
                examples: ['Force LTR direction', 'Mixed language text processing'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u200f',
                unicode: 'U+200F',
                character: '‏',
                name: 'Right-to-Left Mark',
                englishName: 'Right-to-Left Mark',
                description: 'Mark character that specifies text direction for bidirectional text processing',
                usage: 'Text direction control, internationalization',
                category: 'directional',
                icon: 'assets/icons/icon-directional.svg',
                popularity: 79,
                htmlEntity: '&#8207;',
                cssEscape: '\\200F',
                javascriptEscape: '\\u200F',
                examples: ['Force RTL direction', 'Arabic/Hebrew text'],
                isVisible: false,
                length: 1
            },
            {
                id: 'u202a',
                unicode: 'U+202A',
                character: '‪',
                name: 'Left-to-Right Embedding',
                englishName: 'Left-to-Right Embedding',
                description: 'Character that embeds left-to-right text direction',
                usage: 'Text direction control, complex layouts',
                category: 'directional',
                icon: 'assets/icons/icon-directional.svg',
                popularity: 70,
                htmlEntity: '&#8234;',
                cssEscape: '\\202A',
                javascriptEscape: '\\u202A',
                examples: ['Embed LTR text blocks', 'Mixed direction documents'],
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
if (typeof exports !== 'undefined') {
    exports.InvisibleCharacterLibrary = InvisibleCharacterLibrary;
}