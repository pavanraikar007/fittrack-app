/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include if you have a pages dir
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { // Example: Teal
          light: '#2DD4BF', // Lighter shade for hover/active states
          DEFAULT: '#14B8A6',
          dark: '#0D9488', // Darker shade
        },
        secondary: { // Example: Orange
          light: '#FB923C',
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        accent: { // Example: Lime Green for specific highlights
            light: '#A3E635',
            DEFAULT: '#84CC16',
            dark: '#65A30D',
        },
        neutral: {
          lightest: '#F9FAFB', // Very light gray for backgrounds
          lighter: '#F3F4F6',  // Light gray
          DEFAULT: '#D1D5DB',  // Medium gray
          darker: '#6B7280',   // Darker gray for text
          darkest: '#1F2937',  // Very dark gray/charcoal
        },
        // You can also add specific semantic colors
        // success: '#22C55E', // green-500
        // error: '#EF4444',   // red-500
        // warning: '#EAB308', // yellow-500
      },
      // You can also extend other theme properties like fontFamily, spacing, etc.
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'], // Example: Add Inter font
      // },
    },
  },
  plugins: [],
} 