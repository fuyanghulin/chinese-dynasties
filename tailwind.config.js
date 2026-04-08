/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FDF8F3',
        paperDark: '#F5EDE4',
        ink: '#2D2A26',
        inkLight: '#5C5650',
        accent: '#8B4513',
        accentLight: '#A0522D',
        gold: '#B8860B',
        jade: '#2E8B57',
        cinnabar: '#C1440E',
        bronze: '#8B7355',
        porcelain: '#E8E4DF'
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif']
      }
    }
  },
  plugins: [],
}
