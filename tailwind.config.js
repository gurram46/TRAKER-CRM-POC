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
          primary: '#0A0C0F',
          secondary: '#111318',
          tertiary: '#181C23',
          hover: '#1E2330',
        },
        border: {
          DEFAULT: '#1F2937',
          accent: '#2D3748',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#475569',
        },
        accent: {
          primary: '#3B82F6',
          secondary: '#1D4ED8',
          glow: 'rgba(59,130,246,0.15)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#6366F1',
          neutral: '#64748B',
        },
        gold: '#D4A017',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(59,130,246,0.2)',
        dropdown: '0 8px 32px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
