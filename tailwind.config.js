/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6952F9',
        'primary-light': '#8886FF',
        'text-primary': '#1E1F20',
        'custom-gray': '#E6E6E6',
        default: '#FFFFFF',
        week2: '#E6E6E6',
      },
      spacing: {
        'base-unit-2': '8px',
      },
    },
  },
  plugins: [],
};
