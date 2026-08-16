import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#FBF8F4",
          surface: "#ffffff",
          subtle: "#FBF8F4",
          "blue-tint": "#F7FAFF",
          "blue-soft": "#E8F0FE",
          cream: "#FBF8F4",
        },
        blue: {
          france: "#0259DD",
          navy: "#0A2540",
          primary: "#0259DD",
          hover: "#0247B0",
          accent: "#84AFFB",
          electric: "#84AFFB",
          sky: "#84AFFB",
          border: "#B9D0FF",
        },
        emerald: {
          valid: "#0259DD",
          bg: "#F3F6FD",
          border: "#B9D0FF",
          text: "#0247B0",
        },
        amber: {
          alert: "#D91A2A",
          bg: "#FAE8EA",
          border: "#F0B8BE",
        },
        crimson: {
          threat: "#D91A2A",
          bg: "#FAE8EA",
          border: "#F0B8BE",
          hover: "#B81524",
        },
        text: {
          main: "#0A2540",
          secondary: "#516074",
          muted: "#7A8798",
        },
        border: {
          subtle: "#E8EDF5",
          medium: "#C5D8FC",
          active: "#84AFFB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(10, 37, 64, 0.06), 0 2px 8px -2px rgba(10, 37, 64, 0.03)",
        "card-hover":
          "0 20px 40px -8px rgba(2, 89, 221, 0.14), 0 4px 12px -2px rgba(2, 89, 221, 0.06)",
        capsule:
          "0 8px 32px rgba(10, 37, 64, 0.08), 0 2px 6px rgba(10, 37, 64, 0.04)",
        glow: "0 0 40px rgba(2, 89, 221, 0.22)",
        danger: "0 12px 28px -4px rgba(217, 26, 42, 0.16)",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "ambient-drift-a": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-4%, 3%) scale(1.04)" },
          "66%": { transform: "translate(3%, -2%) scale(0.98)" },
        },
        "ambient-drift-b": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(5%, -4%) scale(1.06)" },
        },
        "ambient-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
      },
      animation: {
        "ambient-drift-a": "ambient-drift-a 22s ease-in-out infinite",
        "ambient-drift-b": "ambient-drift-b 28s ease-in-out infinite",
        "ambient-pulse": "ambient-pulse 16s ease-in-out infinite",
      },
      backgroundImage: {
        "ice-gradient":
          "linear-gradient(160deg, #FBF8F4 0%, #F3F6FD 35%, #CBDAF7 100%)",
      },
    },
  },
};

export default preset;
