/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  body: {
    backgroundColor: theme => theme('colors.gray.100'),
    fontFamily: theme => theme('fontFamily.sans'),
    overflowX: 'hidden',
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

