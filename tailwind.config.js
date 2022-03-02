module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      boxShadow: {
        navlinkselected: 'inset 0px -4px 0 0 #3b82f6',
      },
      colors: {
        primary: '#3b82f6',
        surface: {
          dp0: '#121212',
          dp1: '#1d1d1d',
          dp2: '#212121',
        }
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  darkMode: 'class',
  variants: {},
  plugins: []
};
