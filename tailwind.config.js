/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zen-bg': '#0a0f1a',
        'zen-bg-light': '#111827',
        'zen-text': '#e5e7eb',
        'zen-text-dim': '#6b7280',
        'zen-accent': '#6ee7b7',
        'zen-accent-dim': '#34d399',
        'zen-gold': '#fbbf24',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
