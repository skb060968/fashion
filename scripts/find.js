const fs = require("fs");
const path = require("path");

const PAGES_DIR = path.join(process.cwd(), "app"); // or "pages" depending on your project

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(jsx|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, "utf8");
      const usesImage = /<Image\b/.test(content);
      const usesImg = /<img\b/.test(content);

      if (usesImage || usesImg) {
        console.log(
          `${path.relative(process.cwd(), fullPath)} → ${
            usesImage ? "✅ uses <Image>" : "❌ uses <img>"
          }`
        );
      }
    }
  });
}

scanDir(PAGES_DIR);