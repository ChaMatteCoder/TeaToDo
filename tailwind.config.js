/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        tea: {
          50: '#fbf8f0',
          100: '#f4ecd8',
          200: '#e7d7b8',
          300: '#cfb98e',
          400: '#a78e62',
          500: '#6f844f',
          600: '#587039',
          700: '#40552c',
          800: '#2f3d24',
          900: '#222b1c',
        },
        clay: '#8f6d45',
        linen: '#fffdf7',
        oat: '#efe7d6',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(64, 85, 44, 0.08)',
        card: '0 12px 30px rgba(89, 74, 49, 0.07)',
      },
    },
  },
  plugins: [],
};
