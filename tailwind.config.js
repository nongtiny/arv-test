/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        vh: 'var(--viewport-height)'
      },
      minHeight: {
        vh: 'var(--viewport-height)'
      },
    },
  },
  plugins: [],
}