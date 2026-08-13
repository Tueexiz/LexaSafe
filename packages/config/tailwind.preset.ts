import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#f8fafc",
          surface: "#ffffff",
          subtle: "#f0f6ff",
          "blue-tint": "#eff6ff",
          "blue-soft": "#dbeafe",
        },
        blue: {
          france: "#002654",
          navy: "#0a192f",
          primary: "#1d4ed8",
          hover: "#1e40af",
          accent: "#2563eb",
          electric: "#0284c7",
          border: "#bfdbfe",
        },
        emerald: {
          valid: "#059669",
          bg: "#ecfdf5",
          border: "#a7f3d0",
          text: "#065f46",
        },
        amber: {
          alert: "#d97706",
          bg: "#fffbeb",
          border: "#fde68a",
        },
        crimson: {
          threat: "#dc2626",
          bg: "#fef2f2",
          border: "#fecaca",
          hover: "#b91c1c",
        },
        text: {
          main: "#0a192f",
          secondary: "#475569",
          muted: "#64748b",
        },
        border: {
          subtle: "#e2e8f0",
          medium: "#cbd5e1",
          active: "#93c5fd",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
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
        card: "0 10px 30px -5px rgba(10, 25, 47, 0.06), 0 2px 8px -2px rgba(10, 25, 47, 0.03)",
        "card-hover":
          "0 20px 40px -8px rgba(29, 78, 216, 0.12), 0 4px 12px -2px rgba(29, 78, 216, 0.05)",
        capsule:
          "0 8px 32px rgba(10, 25, 47, 0.08), 0 2px 6px rgba(10, 25, 47, 0.04)",
        glow: "0 0 40px rgba(29, 78, 216, 0.22)",
        danger: "0 12px 28px -4px rgba(220, 38, 38, 0.14)",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "ice-gradient":
          "linear-gradient(160deg, #f8fafc 0%, #edf4fc 35%, #dbeafe 100%)",
      },
    },
  },
};

export default preset;
