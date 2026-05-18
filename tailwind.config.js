/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      animation: {
        'breathe-primary': 'breathe-primary 10s ease-in-out infinite',
        'breathe-secondary': 'breathe-secondary 10s ease-in-out infinite',
        'fade-in-title': 'fade-in-title 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-subtitle': 'fade-in-subtitle 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'breathe-primary': {
          '0%, 100%': {
            transform: 'scale(0.85) translate(0px, 0px)',
            opacity: '0.3',
          },
          '45%, 55%': {
            transform: 'scale(1.12) translate(15px, -10px)',
            opacity: '0.75',
          },
        },
        'breathe-secondary': {
          '0%, 100%': {
            transform: 'scale(0.9) translate(0px, 0px) rotate(0deg)',
            opacity: '0.2',
          },
          '45%, 55%': {
            transform: 'scale(1.18) translate(-15px, 15px) rotate(15deg)',
            opacity: '0.6',
          },
        },
        'fade-in-title': {
          '0%': { opacity: '0', transform: 'translateY(12px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
        'fade-in-subtitle': {
          '0%, 40%': { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
          '100%': { opacity: '0.65', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
      },
    },
  },
  plugins: [],
}
