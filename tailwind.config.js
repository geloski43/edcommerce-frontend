// tailwind.config.js

module.exports = {
  // 1. Ensure content paths are correct
  content: [
    "./index.html",
    // This line is what covers src/routes/__root.tsx, as it scans ALL files
    // ending in .js, .jsx, .ts, or .tsx within the entire src/ folder and its subdirectories.
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/styles.css",
  ],

  // 2. CRUCIAL: Enable theme switching via the '.dark' class
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // We only rely on these for surfaces, accents, and borders now.
        "app-surface": "rgb(var(--c-surface) / <alpha-value>)",
        "app-accent": "rgb(var(--c-accent) / <alpha-value>)",
        "app-accent-dark": "rgb(var(--c-accent-dark) / <alpha-value>)",
        "app-border": "rgb(var(--c-border) / <alpha-value>)",
        // OMIT 'app-bg' and 'app-text' to avoid the recurring error
      },
    },
  },
  // ... (rest of your configuration)
};
