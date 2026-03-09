import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-primary': "var(--bg-primary)",
        'bg-secondary': "var(--bg-secondary)",
        'bg-card': "var(--bg-card)",
        'bg-card-hover': "var(--bg-card-hover)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'text-muted': "var(--text-muted)",
        'border-color': "var(--border-color)",
        gold: {
          light: "var(--gold-light)",
          DEFAULT: "var(--gold)",
          dark: "var(--gold-dark)",
        },
      },
      boxShadow: {
        premium: "var(--shadow-premium)",
        hover: "var(--shadow-hover)",
      },
      fontSize: {
        'display': 'var(--fs-display)',
        'h1': 'var(--fs-h1)',
        'h2': 'var(--fs-h2)',
        'h3': 'var(--fs-h3)',
        'h4': 'var(--fs-h4)',
        'body-lg': 'var(--fs-body-lg)',
        'body': 'var(--fs-body)',
        'small': 'var(--fs-small)',
        'xs-label': 'var(--fs-xs)',
        'tiny': 'var(--fs-tiny)',
      },
    },
  },
  plugins: [],
};
export default config;
