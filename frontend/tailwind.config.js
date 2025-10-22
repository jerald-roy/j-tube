
// import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    //  screens: {
    //   ...defaultTheme.screens,                 // keep sm, md, lg, xl, 2xl
    //   landscapeMode: { raw: '(max-aspect-ratio: 9/20)' }, // custom breakpoint
    // },
    extend: {
      colors: {
        newPurple: "#843fa7",
        mainBackground: "#2f2f2f",
        mainBackground2: "#202020",
        mainBackground3: "#201f21"
      },
      zIndex: {
        '-10':'-10'
      }
    },
  },
  plugins: [],
  darkMode: "class",
  
}

