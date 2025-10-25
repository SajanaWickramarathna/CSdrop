/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0A2342', // Deep Navy Blue
        accent: '#D4AF37', // Metallic Gold
        basebg: '#FFFFFF', // Pure White
        secondary: '#F0F2F5', // Light Gray
        body: '#333333', // Dark Gray (text)
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(270deg, rgba(115, 103, 240, 0.7) 0%, #7367f0 100%)',
      },
    },
  },
  plugins: [],
}