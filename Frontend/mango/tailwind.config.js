/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mango: {
          red: '#FF6D60',
          primary: '#F1B31B',
          secondary: '#FBF1A8',
          teal: '#98D8AA',
        },
        text: {
          primary: '#4B5563',
          secondary: '#8899A8',
        },
        stroke: '#CED4DA',
        black: '#000000',
        white: '#FFFFFF',
        gray: '#F3F4F6',
      },
      fontFamily: {
        pretendard: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      typography: {
        // Heading
        'heading-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '24px',
          lineHeight: '28px',
          fontWeight: '400',
        },
        'heading-bold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '24px',
          lineHeight: '28px',
          fontWeight: '700',
        },
        // Sub Heading
        'subheading-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '20px',
          lineHeight: '24px',
          fontWeight: '400',
        },
        'subheading-bold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '20px',
          lineHeight: '24px',
          fontWeight: '700',
        },
        // Body Large
        'body-large-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '400',
        },
        'body-large-semibold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '600',
        },
        // Body Medium
        'body-medium-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '400',
        },
        'body-medium-semibold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '600',
        },
        // Body Small
        'body-small-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: '400',
        },
        'body-small-semibold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: '600',
        },
        // Caption
        'caption-regular': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '10px',
          lineHeight: '12px',
          fontWeight: '400',
        },
        'caption-semibold': {
          fontFamily: ['Pretendard', 'sans-serif'],
          fontSize: '10px',
          lineHeight: '12px',
          fontWeight: '600',
        },
      },
    },
  },
  plugins: [],
};
