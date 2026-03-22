const fs = require("fs");
const path = require("path");

const needed = ["btc", "eth", "sol", "bnb", "matic", "avax", "doge", "ltc", "ada"];
const srcDir = path.join(__dirname, "..", "node_modules", "cryptocurrency-icons", "svg", "color");
const destDir = path.join(__dirname, "..", "public", "cryptocurrency-icons", "svg", "color");

if (!fs.existsSync(srcDir)) {
  console.log("cryptocurrency-icons not found, skipping icon copy");
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

for (const coin of needed) {
  const src = path.join(srcDir, `${coin}.svg`);
  const dest = path.join(destDir, `${coin}.svg`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

console.log("Copied coin icons to public/");
