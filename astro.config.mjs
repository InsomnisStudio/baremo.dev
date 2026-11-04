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

  redirects: {
    // Redirects don't get the base by themselves.
    "/": `${base ?? ""}/es/tasador/`,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
