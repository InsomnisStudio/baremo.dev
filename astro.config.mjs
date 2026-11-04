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

  // The landing used to live under each language's section.
  redirects: Object.fromEntries(
    [
      ["/es/", "/"],
      ["/es/tasador/", "/"],
      ["/en/price-guide/", "/en/"],
      ["/fr/argus/", "/fr/"],
      ["/it/quotazioni/", "/it/"],
      ["/pl/wycena/", "/pl/"],
    ].map(([from, to]) => [from, `${base ?? ""}${to}`]),
  ),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
