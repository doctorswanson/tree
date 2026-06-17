import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black layered base
        void:    { DEFAULT: '#05070a', 50: '#0a0e14', 100: '#10151c' },
        ink:     { DEFAULT: '#05070a', light: '#10151c' },
        panel:   { DEFAULT: '#0d1117', raised: '#141a21' },
        // Signature accent — terminal/matrix green, the Arbor's glow
        accent:  { DEFAULT: '#39ff8a', dim: '#1b7a45', bright: '#8dffc0', muted: '#2bb56a' },
        // Secondary accents, drawn from the Bough color wheel
        cyan:    { DEFAULT: '#22d3ee', dim: '#0e7490', bright: '#7ce8fb', muted: '#0891b2' },
        magenta: { DEFAULT: '#e879f9', dim: '#a21caf', bright: '#f3b9fb', muted: '#c026d3' },
        amber:   { DEFAULT: '#facc15', dim: '#92660a', bright: '#fde047', muted: '#ca8a04' },
        danger:  { DEFAULT: '#f43f5e', dim: '#9f1239', bright: '#fb7185', muted: '#be123c' },
        // Text
        starlight: '#e7f6ee',
        mist:      '#8aa39c',
        shadow:    '#1c2630',
        meta:      '#56666a',
      },
      fontFamily: {
        display: ['"JetBrains Mono"', 'monospace'],
        body:    ['"JetBrains Mono"', 'monospace'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'arbor-glow': 'radial-gradient(ellipse at 50% 38%, rgba(57,255,138,0.14) 0%, transparent 55%), radial-gradient(ellipse at 12% 88%, rgba(34,211,238,0.06) 0%, transparent 50%), radial-gradient(ellipse at 88% 12%, rgba(232,121,249,0.05) 0%, transparent 50%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        'slide-up':   'slideUp 0.25s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: { '0%,100%': { boxShadow: '0 0 4px rgba(57,255,138,0.3)' }, '50%': { boxShadow: '0 0 18px rgba(57,255,138,0.8)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      screens: {
        xs: '375px',
      },
      minHeight: {
        touch: '44px',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      }
    }
  },
  plugins: []
} satisfies Config
