export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Poppins', 'sans-serif'], // För rubriker
        secondary: ['Space Grotesk', 'sans-serif'], // För knappar och accenter
      },

      colors: {
        'myColor': '#fbf2e4',
        'secondary': '#F47941',
        'primary': '#837451',
        'accent': '#46482E',
        'icons': '#FFC107',
      },
    },
  },
  plugins: [],
  
};