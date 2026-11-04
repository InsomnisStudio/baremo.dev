// Product images, resized once and served by the site itself: through an
// on-the-fly resizer the first view of each one waited for the original
// (LaunchBox serves 0.2–3.6 MB files).
//
//   node scripts/build-thumbs.mjs [--limit N]
//
// Reads src/data/images.json and writes public/img/p/<id>-80.webp (table)
// and <id>-352.webp (product page), and src/data/image-sizes.json (each
// image's width and height, so the page can frame wide ones wider). Only
// missing files are made: rerun it after adding images.
//
// Product photos lose their white background (cutout.mjs); box covers are kept
// whole. The current product thumbnails were cut once with a segmentation model
// (rembg), which also removes shadows: deleting one remakes it with cutout.mjs.
import { mkdir, readFile, readdir, writeFile, access } from "node:fs/promises";
import sharp from "sharp";
import { cutout } from "./cutout.mjs";

const OUT = new URL("../public/img/p/", import.meta.url);
const SIZES = [80, 352];
// Wikimedia answers 429 above a few parallel requests: CONCURRENCY=1 to retry those.
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 6);
const UA = "vallax-tasador/0.1 (insomnisdev@gmail.com)";

const images = JSON.parse(await readFile(new URL("../src/data/images.json", import.meta.url), "utf8"));
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > 0 ? Number(process.argv[limitArg + 1]) : Infinity;
await mkdir(OUT, { recursive: true });

const exists = (url) => access(url).then(() => true, () => false);

// Wikimedia rate-limits originals: start from its 500 px thumbnail.
const sourceUrl = (url) => {
    if (!url.startsWith("https://upload.wikimedia.org/")) return url;
    const path = url.split("/wikipedia/commons/")[1];
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/500px-${path.split("/").pop()}`;
};

async function make(id, image) {
    const targets = SIZES.map((s) => [s, new URL(`${id}-${s}.webp`, OUT)]);
    const missing = [];
    for (const t of targets) if (!(await exists(t[1]))) missing.push(t);
    if (!missing.length) return "kept";
    for (let attempt = 0; ; attempt++) {
        try {
            const res = await fetch(sourceUrl(image.url), { headers: { "User-Agent": UA } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const original = Buffer.from(await res.arrayBuffer());
            const input = image.source === "launchbox" ? original : ((await cutout(original)) ?? original);
            for (const [size, file] of missing) {
                await sharp(input)
                    .resize(size, size, { fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 75 })
                    .toFile(file.pathname);
            }
            return "made";
        } catch (err) {
            if (attempt >= 3) return `failed: ${err.message}`;
            await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        }
    }
}

const queue = Object.entries(images).slice(0, limit);
const counts = {};
let done = 0;
await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
        for (let next; (next = queue.shift()); ) {
            const result = await make(...next);
            const key = result.startsWith("failed") ? "failed" : result;
            counts[key] = (counts[key] ?? 0) + 1;
            if (key === "failed") console.error(next[0], next[1].url, result);
            if (++done % 200 === 0) console.log(done, counts);
        }
    }),
);
console.log("done", counts);

const sizes = {};
for (const file of await readdir(OUT)) {
    const id = file.match(/^(\d+)-352\.webp$/)?.[1];
    if (!id) continue;
    const { width, height } = await sharp(new URL(file, OUT).pathname).metadata();
    sizes[id] = [width, height];
}
await writeFile(new URL("../src/data/image-sizes.json", import.meta.url), JSON.stringify(sizes));
console.log("sizes", Object.keys(sizes).length);
