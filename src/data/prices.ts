// Second-hand prices measured by market, for the price pages (/es/tasador/,
// /en/price-guide/…; their words are in prices-i18n.ts).
//
// For now they come from a snapshot (prices.json), exported from market with
// `scripts/export_public_prices.sql`. Once /api/prices/* exists in vallax_api
// the build reads it instead and this module keeps the same shape.
import { existsSync } from "node:fs";
import { locales, type Locale } from "../i18n";
import { pricesText } from "./prices-i18n";
import snapshot from "./prices.json";
// Product id → image: games' box fronts from LaunchBox, consoles and most
// GPUs/CPUs from Wikimedia Commons (picked by hand, free licences), branded
// parts from Open Icecat. A stand-in until the images live in market.
import productImages from "./images.json";
import imageSizes from "./image-sizes.json";

export interface ProductImage {
    source: "launchbox" | "commons" | "icecat";
    url: string;
    // Commons: the file page, its author and licence (CC BY needs them shown).
    page?: string;
    artist?: string;
    license?: string;
}

export interface PriceCategory {
    id: string;
    name: string;
    group: { id: string; name: string } | null;
    count: number;
}

interface RawItem {
    id: number;
    name: string;
    category: string;
    group: string | null;
    platform: string | null;
    platform_name: string | null;
    price_cents: number;
    updated_at: string;
    keywords: string[][];
    aliases: string[];
    // market's Vinted search for the product: its words, catalog and
    // attribute filters (the platform of a game).
    search: { query: string; catalog_id: number | null; attributes: Record<string, number[]> } | null;
}

export interface PriceItem extends RawItem {
    slug: string;
    displayName: string;
    // What to paste into a Vallax search, one line per option.
    vallaxKeywords: string[];
    // The same search, open on each marketplace.
    vintedUrl: string;
    wallapopUrl: string;
    // Lowercase, accent-free text the search matches against.
    searchText: string;
    // The original image and its credit; the site shows resized copies
    // (`imageUrl`).
    image: ProductImage | null;
    // The image's shape, to frame it: tall (box covers), square or wide
    // (most graphics cards).
    imageShape: "tall" | "square" | "wide";
    // The family's tile mosaic to show instead of a photo, or null.
    placeholder: string | null;
}

// A path of the site, under the folder it's served from (astro.config.mjs).
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

export const generatedAt = new Date(snapshot.generated_at);
export const categories = snapshot.categories as PriceCategory[];
const categoryById = new Map(categories.map((c) => [c.id, c]));

export const normalize = (text: string) =>
    text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

export const slugify = (text: string) => normalize(text).replace(/ /g, "-");

// PC parts and consoles are named in lowercase in market ("rtx 4070 ti",
// "i5 10400f", "ds lite").
const wordCase: Record<string, string> = { ti: "Ti", super: "Super", ryzen: "Ryzen" };
const consoleWords: Record<string, string> = { dsi: "DSi", vita: "Vita", one: "One", series: "Series" };
const displayName = (name: string, category: string) => {
    if (name !== name.toLowerCase()) return name;
    const words = name.split(" ");
    if (category === "console") {
        // Model codes in capitals (DS, XL, PS4, NES, OLED), names capitalised.
        return words
            .map((w) =>
                consoleWords[w] ??
                (/\d|^(ds|xl|nes|psp|ps|oled|u|s|x)$/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)),
            )
            .join(" ");
    }
    return words.map((w) => wordCase[w] ?? (/^i[3579]$/.test(w) ? w : w.toUpperCase())).join(" ");
};

// A Vallax option needs every word; a multi-word word is quoted.
const toVallax = (words: string[]) =>
    words.map((w) => (w.includes(" ") ? `"${w}"` : w)).join(" ");

const gameTitle = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, "");

// Vinted's web takes the attribute filters as `<code>_ids[]`, like the
// Vallax app (flutter_vallax platform_attributes.dart).
const vintedUrl = (query: string, search: RawItem["search"]) => {
    const params = new URLSearchParams({ search_text: query });
    if (search?.catalog_id) params.append("catalog[]", String(search.catalog_id));
    for (const [code, ids] of Object.entries(search?.attributes ?? {})) {
        for (const id of ids) params.append(`${code}_ids[]`, String(id));
    }
    // Brackets as Vinted writes them: the link is shown and copied.
    return `https://www.vinted.es/catalog?${params.toString().replaceAll("%5B%5D", "[]")}`;
};

// Wallapop's subcategories under Tecnología y electrónica (24200), from
// vallax_engine/docs/platform_filters (wallapop_categories.json). It has no
// platform filter, so a game's platform goes in the words, and no finer one
// for PC parts than "Componentes y piezas de ordenador".
const wallapopSubcategory: Record<string, number> = {
    game: 10093, // Videojuegos
    console: 10088, // Consolas
    cpu: 10304,
    gpu: 10304,
    motherboard: 10304,
    pc_combo: 10304,
    ram: 10304,
    psu: 10304,
    storage: 10304,
    cpu_cooler: 10304,
    pc_case: 10304,
};

const wallapopUrl = (query: string, category: string) => {
    const params = new URLSearchParams({ keywords: query });
    const sub = wallapopSubcategory[category];
    if (sub) {
        params.set("category_id", "24200");
        params.set("subcategory_ids", String(sub));
    }
    return `https://es.wallapop.com/search?${params}`;
};

// Resized copies served by the site (scripts/build-thumbs.mjs): 80 px for
// the table, 352 px for the product page.
const imagePath = (id: number, size: 80 | 352) => `/img/p/${id}-${size}.webp`;
export const imageUrl = (id: number, size: 80 | 352) => withBase(imagePath(id, size));

const images = productImages as Record<string, ProductImage>;

// The tile mosaics, one per family of object.
const handheld = /^(2ds|3ds|new 3ds|ds |dsi|game boy|ps vita|psp|steam deck|switch)/;
const placeholder = (raw: RawItem) => {
    const file = {
        game: "juego",
        console: handheld.test(raw.name) ? "portatil" : "mando",
        cpu: "procesador",
        gpu: "grafica",
    }[raw.category];
    return file ? withBase(`/img/teselas/${file}.svg`) : null;
};

const sizes = imageSizes as Record<string, number[]>;
const shape = (size?: number[]): PriceItem["imageShape"] => {
    const ratio = size ? size[0] / size[1] : 1;
    return ratio < 0.8 ? "tall" : ratio > 1.25 ? "wide" : "square";
};

export const items: PriceItem[] = (snapshot.items as RawItem[]).map((raw) => {
    const name = displayName(raw.name, raw.category);
    const slug = slugify(name);
    const query = raw.search?.query ?? normalize(gameTitle(raw.name));
    const vallaxKeywords = raw.keywords.length
        ? raw.keywords.map(toVallax)
        : [`"${normalize(gameTitle(raw.name))}"`];
    const mosaic = placeholder(raw);
    return {
        ...raw,
        slug,
        displayName: name,
        vallaxKeywords,
        vintedUrl: vintedUrl(query, raw.search),
        wallapopUrl: wallapopUrl(raw.platform_name ? `${query} ${raw.platform_name}` : query, raw.category),
        // Only the images whose copies were made (build-thumbs.mjs). A family
        // with a mosaic shows it instead of photos, as the brand asks. Games
        // keep their box fronts: 2,300 identical mosaics would tell them apart
        // by name alone.
        image:
            (raw.category === "game" || !mosaic) && images[raw.id] && existsSync(`public${imagePath(raw.id, 80)}`)
                ? images[raw.id]
                : null,
        placeholder: mosaic,
        imageShape: raw.category === "gpu" ? "wide" : shape(sizes[raw.id]),
        searchText: normalize(
            [name, raw.platform_name ?? "", ...raw.aliases, ...raw.keywords.flat()].join(" "),
        ),
    };
});

const pricesByCategory = new Map<string, PriceItem[]>();
for (const item of [...items].sort((a, b) => a.price_cents - b.price_cents)) {
    for (const key of ["all", item.category, `${item.category}:${item.platform}`]) {
        if (!pricesByCategory.has(key)) pricesByCategory.set(key, []);
        pricesByCategory.get(key)!.push(item);
    }
}

// The closest prices in the same category and platform.
export const relatedItems = (item: PriceItem) => {
    const pool = pricesByCategory.get(`${item.category}:${item.platform}`)!;
    const at = pool.indexOf(item);
    return pool.slice(Math.max(0, at - 2), at + 3).filter((other) => other !== item);
};

// How a category's prices are spread, in columns of a price band; bands widen
// as prices grow, since most products are cheap. Below 10 products the shape
// says nothing: null.
export interface PriceSpread {
    // In whole euros, one more than columns.
    edges: number[];
    counts: number[];
    // The column of the median.
    median: number;
}

const spreads = new Map<string, PriceSpread | null>();
// `category` can also be "all", for the whole catalogue.
export const priceSpread = (category: string): PriceSpread | null => {
    if (spreads.has(category)) return spreads.get(category)!;
    const cents = (pricesByCategory.get(category) ?? []).map((i) => i.price_cents);
    let spread: PriceSpread | null = null;
    const low = Math.max(1, Math.floor(cents[0] / 100));
    const high = Math.ceil(cents.at(-1)! / 100);
    if (cents.length >= 10 && low < high) {
        const edges = [...new Set(Array.from({ length: 31 }, (_, i) => Math.round(low * (high / low) ** (i / 30))))];
        const columnOf = (price: number) =>
            Math.min(edges.findLastIndex((edge) => edge * 100 <= price), edges.length - 2);
        const counts = edges.slice(1).map(() => 0);
        for (const price of cents) counts[columnOf(price)]++;
        spread = { edges, counts, median: columnOf(cents[Math.floor((cents.length - 1) / 2)]) };
    }
    spreads.set(category, spread);
    return spread;
};

export const sectionHref = (lang: Locale) => withBase(`/${lang}/${pricesText[lang].section}/`);

// Spanish, the main language, is at the root.
export const homeHref = (lang: Locale) => withBase(lang === "es" ? "/" : `/${lang}/`);

export const searchHref = (lang: Locale) => `${sectionHref(lang)}${pricesText[lang].searchSlug}/`;

export const categoryName = (id: string, lang: Locale) =>
    pricesText[lang].categories[id] ?? categoryById.get(id)?.name ?? id;

export const categoryHref = (id: string, lang: Locale) =>
    `${sectionHref(lang)}${slugify(categoryName(id, lang))}/`;

export const itemHref = (item: PriceItem, lang: Locale) => `${sectionHref(lang)}${item.id}-${item.slug}/`;

// The same page in every language, for the language menu and hreflang.
export const localePaths = (path: (lang: Locale) => string) =>
    Object.fromEntries(locales.map((l) => [l, path(l)])) as Record<Locale, string>;

// Prices are measured at the cheap end of the market: show whole euros.
const euros = (lang: Locale) =>
    new Intl.NumberFormat(pricesText[lang].dateLocale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
        useGrouping: "always",
    });

export const formatPrice = (cents: number, lang: Locale) => euros(lang).format(Math.round(cents / 100));

// The same price in pieces, for the big figure with its € apart.
export const priceParts = (cents: number, lang: Locale) =>
    euros(lang)
        .formatToParts(Math.round(cents / 100))
        .filter((part) => part.type !== "literal");

export const formatDate = (iso: string | Date, lang: Locale) =>
    new Intl.DateTimeFormat(pricesText[lang].dateLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Madrid",
    }).format(new Date(iso));
