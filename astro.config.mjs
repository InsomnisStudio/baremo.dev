// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const base = process.env.BASE_PATH;

// GitHub Pages' workflow passes the address it serves from: the custom domain,
// or <owner>.github.io/<repository>/ until there is one.
export default defineConfig({
  site: process.env.SITE_URL || "https://baremo.dev",
  base: base || undefined,

  // Spanish is at the root.
  redirects: { "/es/": `${base ?? ""}/` },

  vite: {
    plugins: [tailwindcss()],
  },

  // Prices are from the Spanish market: the other languages stay out of search
  // until there's data of their own (see the robots tag in PriceLayout.astro).
  integrations: [sitemap({ filter: (page) => !/\/(en|fr|it|pl)\//.test(new URL(page).pathname) })],
});
