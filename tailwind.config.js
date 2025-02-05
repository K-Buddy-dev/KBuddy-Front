/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f7f8f8',
          100: '#edeef1',
          200: '#d7dce3',
          300: '#b6bac3',
          400: '#8e95a2',
          500: '#6b7280',
          600: '#5b616e',
          700: '#4a4e5a',
          800: '#40444c',
          900: '#383a42',
          950: '#25272c',
        },
        base: {
          black: '#1e1f20',
          white: '#ffffff',
        },
        brand: {
          primary: '#000000',
          secondary: '#8e95a2',
          primary_15: '#00000026',
          primary_50: '#00000080',
          correct: '#008000',
          error: '#b3261e',
          correct_bg: '#daf4da',
          error_bg: '#f7cecc',
          text_link: '#1b75d0',
        },
        indigo: {
          50: '#f0f2ff',
          100: '#dcd8fd',
          200: '#94a4ff',
          300: '#6d56ff',
          400: '#333361',
        },
        green: {
          50: '#defede',
          100: '#3af23d',
          200: '#007702',
        },
        orange: {
          50: '#ffe3cf',
          100: '#b33600',
        },
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '28px',
      },
    },
  },
  plugins: [],
};
