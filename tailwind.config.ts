import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#07080f',
        'bg-card': '#0d0f1a',
        'bg-hover': '#12152b',
        'accent': '#6c63ff',
        'accent-light': '#a89cff',
        'success': '#3dffa0',
        'warning': '#f0c060',
        'danger': '#ff5a5a',
        'text-primary': '#f0eeff',
        'text-secondary': '#9896b8',
        'text-muted': '#5e5c80',
      },
      fontFamily: {
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        'card': '12px',
        'btn': '6px',
      },
      animation: {
        'fade-in': 'fade-in 200ms ease forwards',
        'fade-up': 'fade-up 300ms ease forwards',
        'skeleton-shimmer': 'skeleton-shimmer 1.5s infinite',
        'shake': 'shake 400ms ease',
        'pixel-build': 'pixel-build 600ms ease forwards',
        'glow': 'glow-pulse 2s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
