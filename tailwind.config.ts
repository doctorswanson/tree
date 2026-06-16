import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Layered dark base — old stone / dungeon, not flat black
        void:    { DEFAULT: '#0c0a07', 50: '#15110c', 100: '#1d1810' },
        ink:     { DEFAULT: '#0c0a07', light: '#1d1810' },
        panel:   { DEFAULT: '#1a150f', raised: '#241d14' },
        // Gold — the dominant accent, aged brass / dragon-priest gold
        gold:    { DEFAULT: '#c9a227', dim: '#8a6c1b', bright: '#f0cf6b', muted: '#a3811f' },
        // Cyan-slot — frost steel (kept the key so semantic classes don't need touching)
        cyan:    { DEFAULT: '#6f93b3', dim: '#3f5b73', bright: '#9fc1dd', muted: '#4d6d87' },
        // Purple-slot — arcane violet
        purple:  { DEFAULT: '#8b5fbf', dim: '#5b3d80', bright: '#b58ce0', muted: '#6b4a93' },
        // Green-slot — moss / verdant emerald
        green:   { DEFAULT: '#5c8a52', dim: '#3d5e37', bright: '#84b876', muted: '#466b3f' },
        // Amber-slot — ember orange (warnings / milestones / "stretch")
        amber:   { DEFAULT: '#d97b34', dim: '#95501f', bright: '#f0a05f', muted: '#a8602a' },
        // Aurora — kept as alias namespace for older attribute mappings
        aurora:  { green: '#5c8a52', teal: '#6f93b3', blue: '#8b5fbf' },
        // Text — parchment / aged paper
        starlight: '#ecdfc0',
        mist:      '#b3a584',
        shadow:    '#3a2f1f',
        meta:      '#7a6c4f',
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body:    ['"EB Garamond"', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'starfield': 'radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,95,191,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(217,123,52,0.07) 0%, transparent 50%)',
      },
      animation: {
        'twinkle':    'twinkle 3s ease-in-out infinite',
        'aurora':     'aurora 8s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up':   'slideUp 0.25s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
        'ember-rise': 'emberRise linear infinite',
      },
      keyframes: {
        twinkle:   { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '1' } },
        aurora:    { '0%,100%': { opacity: '0.4', transform: 'translateY(0)' }, '50%': { opacity: '0.7', transform: 'translateY(-10px)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 4px rgba(201,162,39,0.3)' }, '50%': { boxShadow: '0 0 16px rgba(201,162,39,0.7)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        emberRise: {
          '0%':   { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%':  { opacity: '0.8' },
          '90%':  { opacity: '0.4' },
          '100%': { transform: 'translateY(-120vh) translateX(var(--drift, 10px))', opacity: '0' },
        },
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
