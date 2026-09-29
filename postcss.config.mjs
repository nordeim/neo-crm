// Tailwind CSS v4 runs through the PostCSS plugin — required for the
// CSS-first @theme/@utility directives in src/app/globals.css.
// (Tailwind v4 rule: PostCSS must use "@tailwindcss/postcss", NOT "tailwindcss".)
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
