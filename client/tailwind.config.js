/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: '#111827',
        cardHover: '#161F33',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA'
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399'
        },
        amber: {
          DEFAULT: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 40px -4px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
};