/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
      },
    },
  },
  variants: {
    extend: {
      animation: ["responsive", "motion-safe", "motion-reduce"],
    },
  },
  plugins: [
    function ({ addUtilities, theme, variants }: any) {
      const animationDelayUtilities = {
        ".animation-delay-200": { animationDelay: "200ms" },
        ".animation-delay-400": { animationDelay: "400ms" },
      };
      addUtilities(animationDelayUtilities, variants("animationDelay"));
    },
  ],
};
