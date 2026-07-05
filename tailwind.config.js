module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './blog/**/*.html',
    './assets/components/**/*.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'apple-gray': {
          50: '#fafafa',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d1d1d6',
          400: '#a1a1a6',
          500: '#86868b',
          600: '#6e6e73',
          700: '#48484a',
          800: '#1d1d1f',
          900: '#000000'
        }
      },
      fontFamily: {
        sf: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  }
};
