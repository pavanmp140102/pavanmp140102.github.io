/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0a192f',
        'light-navy': '#112240',
        'lightest-navy': '#233554',
        slate: '#8892b0',
        'light-slate': '#a8b2d1',
        'lightest-slate': '#ccd6f6',
        white: '#e6f1ff',
        accent: '#64ffda',
      },
      fontFamily: {
        mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', '"Roboto Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
      },
    },
  },
  plugins: [],
};
