const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './pages/**/*',
    './content/**/*',
    '../components-ui/src/**/*',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      //
      gray: colors.coolGray,
      //
      blue: {
        50: '#F7F9FC',
        100: '#EEF2F9',
        200: '#D5DFEF',
        300: '#BBCBE5',
        400: '#88A4D2',
        500: '#557DBF',
        600: '#4D71AC',
        700: '#334B73',
        800: '#263856',
        900: '#1A2639',
      },
      green: {
        50: '#F5FBFA',
        100: '#EAF7F5',
        200: '#CCEBE6',
        300: '#ADDFD7',
        400: '#6FC8BA',
        500: '#31B09C',
        600: '#2C9E8C',
        700: '#1D6A5E',
        800: '#164F46',
        900: '#0F352F',
      },
      red: {
        50: '#FEF7F6',
        100: '#FDEEEE',
        200: '#FAD5D3',
        300: '#F7BBB9',
        400: '#F28885',
        500: '#EC5550',
        600: '#D44D48',
        700: '#8E3330',
        800: '#6A2624',
        900: '#471A18',
      },
      purple: {
        50: '#F8F5FA',
        100: '#F2EBF4',
        200: '#DECDE4',
        300: '#CBAED4',
        400: '#A372B4',
        500: '#7C3594',
        600: '#703085',
        700: '#4A2059',
        800: '#381843',
        900: '#25102C',
      },
      orange: {
        50: '#FFFBF3',
        100: '#FFF7E8',
        200: '#FEEBC5',
        300: '#FDDEA3',
        400: '#FCC65D',
        500: '#FBAD18',
        600: '#E29C16',
        700: '#97680E',
        800: '#714E0B',
        900: '#4B3407',
      },
    },
    fontFamily: {
      sourcesanspro: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
      mono: [...defaultTheme.fontFamily.mono],
      whitney: ["Whitney SSm A", "Whitney SSm B", ...defaultTheme.fontFamily.sans],
    },
    fontWeight: {
      extralight: 200,
      light: 300,
      book: 400,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    extend: {
      transitionProperty: {
        'height': 'height',
        'width-padding': 'width, padding',
      },
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/forms'),
  ],
}
