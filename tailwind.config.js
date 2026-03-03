/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景
        'zen-bg': 'var(--bg-primary)',
        'zen-bg-light': 'var(--bg-secondary)',
        'zen-bg-tertiary': 'var(--bg-tertiary)',
        
        // 强调色
        'zen-accent': 'var(--accent-secondary)',
        'zen-accent-primary': 'var(--accent-primary)',
        'zen-accent-secondary': 'var(--accent-secondary)',
        
        // 文字
        'zen-text': 'var(--text-primary)',
        'zen-text-dim': 'var(--text-secondary)',
        'zen-text-muted': 'var(--text-muted)',
        
        // 状态
        'zen-gold': 'var(--warning)',
        'zen-success': 'var(--success)',
        'zen-error': 'var(--error)',
      },
      fontFamily: {
        'heading': ['Lora', 'PingFang SC', 'serif'],
        'body': ['Raleway', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
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
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'neu': 'var(--shadow-raised)',
        'neu-inset': 'var(--shadow-inset)',
        'glow': 'var(--shadow-glow)',
        'glow-accent': 'var(--shadow-glow-accent)',
      },
    },
  },
  plugins: [],
}
