/**
 * Theme System for The Invisible Character
 * Handles dark/light mode switching with localStorage persistence
 */

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.theme);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        // Add transition class for smooth theme changes
        this.addTransitionClass();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getPreferredTheme() {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        // Remove existing theme class
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        
        // Add new theme class
        document.documentElement.classList.add(`${theme}-theme`);
        
        // Set data attribute for CSS selectors
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme color
        this.updateMetaThemeColor(theme);
        
        // Update theme toggle buttons
        this.updateThemeToggleButtons(theme);
        
        // Store the theme preference
        this.setStoredTheme(theme);
        
        // Emit custom event
        this.emitThemeChangeEvent(theme);
    }

    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
        }
    }

    updateThemeToggleButtons(theme) {
        // Update desktop theme toggle
        const desktopToggle = document.getElementById('theme-toggle-desktop');
        if (desktopToggle) {
            const sunIcon = desktopToggle.querySelector('svg:nth-child(2)');
            const moonIcon = desktopToggle.querySelector('svg:nth-child(1)');
            
            if (theme === 'dark') {
                sunIcon?.classList.remove('hidden');
                moonIcon?.classList.add('hidden');
            } else {
                sunIcon?.classList.add('hidden');
                moonIcon?.classList.remove('hidden');
            }
        }

        // Update mobile theme toggle
        const mobileToggle = document.getElementById('theme-toggle-mobile');
        if (mobileToggle) {
            const svgIcon = mobileToggle.querySelector('svg');
            if (svgIcon) {
                // For mobile, we just change the icon
                if (theme === 'dark') {
                    svgIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
                } else {
                    svgIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
                }
            }
        }
    }

    setupEventListeners() {
        // Desktop theme toggle
        const desktopToggle = document.getElementById('theme-toggle-desktop');
        if (desktopToggle) {
            desktopToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile theme toggle
        const mobileToggle = document.getElementById('theme-toggle-mobile');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + D for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setupSystemThemeListener() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeQuery.addEventListener('change', (e) => {
                // Only change if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        
        // Add haptic feedback on mobile devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    addTransitionClass() {
        // Add transition class for smooth theme changes
        document.documentElement.classList.add('theme-transition');
        
        // Remove transition class after initial load
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 1000);
    }

    emitThemeChangeEvent(theme) {
        // Emit custom event for other components to listen to
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    }

    // Utility method to check current theme
    getCurrentTheme() {
        return this.theme;
    }

    // Utility method to check if dark mode is active
    isDarkMode() {
        return this.theme === 'dark';
    }

    // Utility method to force a specific theme
    forceTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.theme = theme;
        }
    }

    // Utility method to reset to system preference
    resetToSystemPreference() {
        localStorage.removeItem('theme');
        this.theme = this.getPreferredTheme();
        this.applyTheme(this.theme);
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Make theme manager globally available for debugging
    if (typeof window !== 'undefined') {
        window.themeManager = themeManager;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

// Export for ES modules
if (typeof export !== 'undefined') {
    export { ThemeManager };
}