// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 10s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-50px) rotate(15deg)",
          },
          "100%": {
            transform: "translateY(0) rotate(0deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
