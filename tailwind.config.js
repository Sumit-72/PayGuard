/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Color Palette ──────────────────────────────────────────────
      colors: {
        // Surface layers — derived from base bg #0f1623
        surface: {
          base:    '#0f1623', // deepest bg
          raised:  '#141d2e', // card surfaces
          overlay: '#192236', // hover / slightly lighter panels
          border:  '#1e2d45', // subtle borders
          muted:   '#243355', // dividers, disabled states
        },
        // Brand / accent
        brand: {
          DEFAULT: '#4f6ef7',  // primary indigo
          light:   '#6b87f9',
          dark:    '#3a56e4',
          accent:  '#22d3ee',  // cyan accent
        },
        // Semantic decision colors
        guard: {
          allow:  '#10b981', // emerald-500
          stepup: '#f59e0b', // amber-500
          review: '#8b5cf6', // violet-500
          block:  '#ef4444', // red-500
        },
        // Text hierarchy
        ink: {
          primary:   '#e2e8f0', // slate-200
          secondary: '#94a3b8', // slate-400
          muted:     '#4b5e7e', // muted text
          subtle:    '#2d3e5c', // very muted
        },
      },

      // ── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ── Neomorphic Shadow System ───────────────────────────────────
      // Base background: #0f1623
      // Light offset: slightly lighter than base → #1a2438
      // Dark offset:  slightly darker  than base → #080e19
      boxShadow: {
        // Raised — element sits above the surface
        'neo-sm':   '3px 3px 6px #080e19, -2px -2px 5px #1a2438',
        'neo':      '5px 5px 10px #080e19, -4px -4px 8px #1a2438',
        'neo-lg':   '8px 8px 16px #080e19, -6px -6px 12px #1a2438',
        // Inset — element is pressed into the surface
        'neo-inset-sm': 'inset 2px 2px 5px #080e19, inset -2px -2px 4px #1a2438',
        'neo-inset':    'inset 3px 3px 8px #080e19, inset -3px -3px 6px #1a2438',
        // Pressed — active/clicked state (deeper inset)
        'neo-pressed':  'inset 4px 4px 10px #080e19, inset -2px -2px 5px #1a2438',
        // Flat — flush with surface, minimal shadow
        'neo-flat':     '1px 1px 3px #080e19, -1px -1px 2px #1a2438',
        // Focus ring — accessible keyboard focus indicator
        'neo-focus':    '0 0 0 2px #0f1623, 0 0 0 4px #4f6ef7',
        // Status accent shadows (very subtle accent ring, not glowing)
        'neo-brand':    '5px 5px 10px #080e19, -4px -4px 8px #1a2438, 0 0 0 1px rgba(79,110,247,0.18)',
        'neo-allow':    '5px 5px 10px #080e19, -4px -4px 8px #1a2438, 0 0 0 1px rgba(16,185,129,0.18)',
        'neo-block':    '5px 5px 10px #080e19, -4px -4px 8px #1a2438, 0 0 0 1px rgba(239,68,68,0.18)',
        'neo-warn':     '5px 5px 10px #080e19, -4px -4px 8px #1a2438, 0 0 0 1px rgba(245,158,11,0.18)',
        'neo-review':   '5px 5px 10px #080e19, -4px -4px 8px #1a2438, 0 0 0 1px rgba(139,92,246,0.18)',
      },

      // ── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        'neo':    '10px',
        'neo-lg': '14px',
        'neo-xl': '18px',
      },

      // ── Transitions ───────────────────────────────────────────────
      transitionProperty: {
        'neo': 'box-shadow, background-color, border-color, color, transform',
      },
      transitionDuration: {
        'neo': '150ms',
      },
      transitionTimingFunction: {
        'neo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ── Spacing extras ────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
