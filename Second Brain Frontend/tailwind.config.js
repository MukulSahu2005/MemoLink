/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    'var(--color-bg-base)',
          panel:   'var(--color-bg-panel)',
          card:    'var(--color-bg-card)',
          input:   'var(--color-bg-input)',
        },
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover:   'var(--color-brand-hover)',
          muted:   'var(--color-brand-muted)',
          glow:    'rgba(107, 92, 246, 0.25)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          accent:    'var(--color-text-accent)',
          dark:      'var(--color-text-dark)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          focus:  'var(--color-border-focus)',
        },
        status: {
          online:  'var(--color-status-online)',
          offline: 'var(--color-status-offline)',
          error:   'var(--color-status-error)',
        },
      },
      fontFamily: {
        sans:    ['Geist', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        btn:  '8px',
      },
      boxShadow: {
        'card-dark': '0 0 0 1px var(--color-border-subtle), 0 8px 32px rgba(0,0,0,0.4)',
        'brand-glow': '0 0 24px rgba(107,92,246,0.35)',
        'input-focus': '0 0 0 2px rgba(107,92,246,0.5)',
      },
    },
  },
  plugins: [],
}
