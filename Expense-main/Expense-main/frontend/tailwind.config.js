/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    keyframes: {
      'arrow-left-right': {
        '0%, 100%': { transform: 'translateX(-10px)' },
        '50%': { transform: 'translateX(10px)' },
      },
      "fade-in-bouncedown": {
        "0%": {
            opacity: 0,
            transform: "translate3d(0%, -90%, 0)",
        },
        "33%": {
            opacity: 0.1,
            transform: "translate3d(0%, 0%, 0)",
        },
        "66%": {
            opacity: 0.7,
            transform: "translate3d(0%, -5%, 0)",
        },
        "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
        },
    },
    "fade-in-left": {
      "0%": {
          opacity: 0,
          transform: "translate3d(-100%, 0, 0)",
      },
      "100%": {
          opacity: 1,
          transform: "translate3d(0, 0, 0)",
      },
      "fade-in-right": {
        "0%": {
            opacity: 0,
            transform: "translate3d(0, 0, 0)",
        },
        "100%": {
            opacity: 1,
            transform: "translate3d(100%, 0, 0)",
        },
        "fade-out-left": {
          "0%": {
              opacity: 1,
          },
          "100%": {
              opacity: 0,
              transform: "translate3d(-100%, 0, 0)",
          },
      },
      
    },
  },
    },
    animation: {
      'arrow-left-right': 'arrow-left-right 1s infinite',
      "fade-in-bouncedown": "fade-in-bouncedown 1s",
      fadeinleft: 'fade-in-left 0.5s',
      fadeinright: 'fade-in-right 0.5s',
      fadeoutleft: 'fade-out-left 0.5s forwards',
    },
    spacing:{
      '1/8':'12.5%',
    },
    colors : {
      primary:'#F8F8F8',
      secondary:'#7289DA',
      ternary:'#0891b2',
      quaternary:'#EDEDED',
      custom:{
        50:'black'
      }
    },
    fontFamily: {
      sans: ['Satoshi', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    },
    height: {
      '1/8': '12.5%',
      '1/9': '11.1111111%',
    },
    
  }
};
export const plugins = [];