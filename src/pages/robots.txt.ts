import type { APIRoute } from "astro";
import { withBase } from "../data/prices";

export const GET: APIRoute = ({ site }) =>
    new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(withBase("/sitemap-index.xml"), site)}\n`);
