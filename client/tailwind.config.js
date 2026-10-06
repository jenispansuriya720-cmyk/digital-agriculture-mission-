/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534',
          dark: '#14532D',
          light: '#15803D',
        },
        secondary: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        'light-green': '#DCFCE7',
        cream: '#F8F7F0',
        dark: {
          DEFAULT: '#172018',
          surface: '#1F2B20',
          muted: '#2A3B2B',
        },
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 101, 52, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(22, 101, 52, 0.12)',
      }
    },
  },
  plugins: [],
}
