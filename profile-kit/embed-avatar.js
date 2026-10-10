// Usage: node embed-avatar.js [path-to-avatar.png]
// Embeds your 3D avatar into assets/hero.svg (GitHub blocks external images inside SVG).
const fs = require("fs");
const src = process.argv[2] || "assets/avatar-3d.png";
const tpl = fs.readFileSync("assets/hero.template.svg", "utf8");
const buf = fs.readFileSync(src);
const kb = Math.round(buf.length / 1024);
if (kb > 1500) console.warn(`Warning: avatar is ${kb} KB. Resize to ~700px wide / compress (tinypng.com) first.`);
const mime = src.toLowerCase().endsWith(".webp") ? "image/webp" : "image/png";
const out = tpl.split("__AVATAR__").join(`data:${mime};base64,${buf.toString("base64")}`);
fs.writeFileSync("assets/hero.svg", out);
console.log(`assets/hero.svg updated (avatar ${kb} KB)`);
