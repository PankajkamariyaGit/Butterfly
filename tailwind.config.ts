import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FDFBF7",
        "ivory-dark": "#F5F0E8",
        champagne: "#C9A84C",
        "champagne-light": "#E8D08A",
        "champagne-dark": "#A07830",
        "rose-gold": "#B76E79",
        "rose-gold-light": "#D4959E",
        "rose-gold-dark": "#8B4A52",
        pearl: "#F8F4EF",
        blush: "#FAF0F0",
        "blush-deep": "#F5E0E2",
        obsidian: "#1A1409",
        mink: "#4A3728",
        "mink-light": "#7A6050",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Jost", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-luxury": "linear-gradient(135deg, #C9A84C 0%, #B76E79 100%)",
        "gradient-pearl": "linear-gradient(180deg, #FDFBF7 0%, #F8F4EF 100%)",
        "gradient-blush": "linear-gradient(135deg, #FAF0F0 0%, #F5E0E2 100%)",
        "gradient-gold": "linear-gradient(135deg, #C9A84C 0%, #E8D08A 50%, #B76E79 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease forwards",
        "scale-in": "scaleIn 0.5s ease forwards",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        luxury: "0 4px 24px rgba(183, 110, 121, 0.12), 0 2px 8px rgba(201, 168, 76, 0.08)",
        "luxury-lg": "0 16px 48px rgba(183, 110, 121, 0.16), 0 4px 16px rgba(201, 168, 76, 0.12)",
        "luxury-xl": "0 24px 64px rgba(183, 110, 121, 0.2), 0 8px 24px rgba(201, 168, 76, 0.15)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "120": "30rem",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};

export default config;
