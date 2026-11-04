// Removes a white background from a product photo: whatever is near white and
// connected to the image's border goes transparent, so a white console keeps
// its body as long as its outline separates it from the background.
import sharp from "sharp";

// Near white, from the brightest channel's opposite: JPEG noise stays under it.
const WHITE = 244;
// How much of the border must be white to call it a white background.
const MIN_WHITE_BORDER = 0.6;

// Returns a PNG with transparency, or null if the photo has no white background
// (a photo on a table, or one already transparent).
export async function cutout(input) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const isWhite = (p) => data[p * 4 + 3] > 200 && Math.min(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]) >= WHITE;

    const border = [];
    for (let x = 0; x < width; x++) border.push(x, (height - 1) * width + x);
    for (let y = 0; y < height; y++) border.push(y * width, y * width + width - 1);
    const seeds = border.filter(isWhite);
    if (seeds.length / border.length < MIN_WHITE_BORDER) return null;

    const background = new Uint8Array(width * height);
    const stack = [];
    for (const p of seeds) {
        background[p] = 1;
        stack.push(p);
    }
    while (stack.length) {
        const p = stack.pop();
        const x = p % width;
        for (const next of [x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1, p - width, p + width]) {
            if (next >= 0 && next < width * height && !background[next] && isWhite(next)) {
                background[next] = 1;
                stack.push(next);
            }
        }
    }

    // Eats two pixels into the object, where the white bleeds into its edge, and
    // softens the cut.
    const mask = Buffer.alloc(width * height);
    for (let p = 0; p < width * height; p++) mask[p] = background[p] ? 0 : 255;
    const { data: soft, info: softInfo } = await sharp(mask, { raw: { width, height, channels: 1 } })
        .erode(2)
        .blur(0.6)
        .raw()
        .toBuffer({ resolveWithObject: true });
    const rgba = Buffer.from(data);
    for (let p = 0; p < width * height; p++) rgba[p * 4 + 3] = Math.min(rgba[p * 4 + 3], soft[p * softInfo.channels]);
    const cut = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
    return sharp(cut).trim({ threshold: 10 }).png().toBuffer();
}
