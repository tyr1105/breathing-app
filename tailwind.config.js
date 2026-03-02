/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 禅意风格配色
        zen: {
          bg: '#0a0f1a',        // 深蓝黑背景
          'bg-light': '#111827', // 浅背景
          text: '#e5e7eb',      // 柔和白
          'text-dim': '#9ca3af', // 暗淡文字
          accent: '#6ee7b7',    // 淡青绿（强调色）
          'accent-dim': '#34d399', // 稍深的青绿
          gold: '#fbbf24',      // 淡金色
        }
      },
      animation: {
        'breathe-in': 'breatheIn 2s ease-in-out',
        'breathe-out': 'breatheOut 1s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        breatheIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.5)' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
