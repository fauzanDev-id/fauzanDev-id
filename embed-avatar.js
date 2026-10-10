// Usage: node embed-avatar.js [path-to-avatar.png]
// Embeds the avatar into assets/hero.svg (GitHub blocks external images inside SVG).
// If `sharp` is installed, the avatar is resized to 720px wide automatically.
const fs = require("fs");

(async () => {
  const src = process.argv[2] || "assets/avatar-3d.png";
  const tpl = fs.readFileSync("assets/hero.template.svg", "utf8");
  let buf = fs.readFileSync(src);
  try {
    const sharp = require("sharp");
    buf = await sharp(buf).resize({ width: 720, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer();
  } catch (e) {
    console.warn("sharp not available, using the original image");
  }
  const kb = Math.round(buf.length / 1024);
  if (kb > 3500) console.warn(`Warning: avatar is ${kb} KB, GitHub may refuse to render it. Resize/compress it first.`);
  const mime = src.toLowerCase().endsWith(".webp") ? "image/webp" : "image/png";
  const out = tpl.split("__AVATAR__").join(`data:${mime};base64,${buf.toString("base64")}`);
  fs.writeFileSync("assets/hero.svg", out);
  console.log(`assets/hero.svg updated (avatar ${kb} KB)`);
})();
