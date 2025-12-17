/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        game: {
          bg: "hsl(var(--game-bg))",
          panel: "hsl(var(--game-panel))",
          "panel-dark": "hsl(var(--game-panel-dark))",
          "panel-light": "hsl(var(--game-panel-light))",
          border: "hsl(var(--game-border))",
          text: "hsl(var(--game-text))",
          shadow: "hsl(var(--game-shadow))",
        },
        module: {
          green: "hsl(var(--module-green))",
          "green-light": "hsl(var(--module-green-light))",
          blue: "hsl(var(--module-blue))",
          "blue-light": "hsl(var(--module-blue-light))",
          purple: "hsl(var(--module-purple))",
          "purple-light": "hsl(var(--module-purple-light))",
          orange: "hsl(var(--module-orange))",
          "orange-light": "hsl(var(--module-orange-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

