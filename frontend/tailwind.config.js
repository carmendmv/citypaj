/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#0066cc',
        gray: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1a1a1a',
            fontFamily: 'Inter, system-ui, sans-serif',
            h1: {
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: '700',
              fontSize: '2.5rem',
              lineHeight: '1.2',
            },
            h2: {
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: '600',
              fontSize: '2rem',
              lineHeight: '1.3',
            },
            h3: {
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '1.4',
            },
            h4: {
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: '600',
              fontSize: '1.25rem',
              lineHeight: '1.4',
            },
            p: {
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1rem',
            },
            a: {
              color: '#0066cc',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              fontWeight: '600',
              color: '#1a1a1a',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
