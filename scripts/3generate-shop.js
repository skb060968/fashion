const fs = require("fs");
const path = require("path");

const shopDir = path.join(process.cwd(), "public/images/shop");
const itemsDir = path.join(shopDir, "items");
const thumbsDir = path.join(shopDir, "thumbnails");
const metaDir = path.join(shopDir, "meta");
const outputFile = path.join(process.cwd(), "lib/data/shop.ts");

function generateShopData() {
  const dresses = [];
  let warnings = 0;
  let processed = 0;

  const dressFolders = fs.readdirSync(itemsDir);

  dressFolders.forEach((folder) => {
    // read meta.json from meta/<folder>/meta.json
    const metaPath = path.join(metaDir, folder, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.warn(`⚠️ No meta.json found for ${folder}`);
      warnings++;
      return;
    }

    const metaRaw = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(metaRaw);

    const slug = meta.slug?.trim() || folder;
    const name = meta.name?.trim() || "";
    const description = meta.description?.trim() || "";
    const price = parseInt(meta.price, 10);
    const sizes = Array.isArray(meta.sizes)
      ? meta.sizes
      : JSON.parse(meta.sizes || "[]");

    if (isNaN(price)) {
      console.warn(`⚠️ Invalid price in ${folder}, defaulting to 0`);
      warnings++;
    }

    // Collect thumbnails (.webp) from thumbnails/<folder>
    let thumbnails = [];
    const thumbFolder = path.join(thumbsDir, folder);
    if (fs.existsSync(thumbFolder)) {
      thumbnails = fs.readdirSync(thumbFolder)
        .filter(f => f.endsWith(".webp"))
        .sort((a, b) => {
          if (a.includes("cover")) return 1;
          if (b.includes("cover")) return -1;
          return a.localeCompare(b);
        })
        .map(f => `/images/shop/thumbnails/${folder}/${f}`);
    } else {
      console.warn(`⚠️ No thumbnails folder for ${folder}`);
      warnings++;
    }

    // Collect item images (.webp) from items/<folder>
    let images = [];
    const itemFolder = path.join(itemsDir, folder);
    if (fs.existsSync(itemFolder)) {
      images = fs.readdirSync(itemFolder)
        .filter(f => f.endsWith(".webp"))
        .sort((a, b) => {
          if (a.includes("cover")) return 1;
          if (b.includes("cover")) return -1;
          return a.localeCompare(b);
        })
        .map(f => `/images/shop/items/${folder}/${f}`);
    } else {
      console.warn(`⚠️ No items folder for ${folder}`);
      warnings++;
    }

    if (images.length === 0) {
      console.warn(`⚠️ No gallery images found in ${folder}`);
      warnings++;
    }

    const coverImage = images.find(img => img.includes("cover")) || "";
    const coverThumbnail = thumbnails.find(img => img.includes("cover")) || "";

    dresses.push({
      slug,
      name,
      description,
      price: isNaN(price) ? 0 : price,
      sizes,
      thumbnails,
      images,
      coverImage,
      coverThumbnail,
    });

    processed++;
  });

  const fileContent =
    "// AUTO‑GENERATED FILE. Do not edit manually.\n" +
    "export const dresses = " +
    JSON.stringify(dresses, null, 2) +
    ";\n";

  fs.writeFileSync(outputFile, fileContent);

  console.log(`✅ shop.ts generated with ${dresses.length} dresses`);
  console.log(`📊 Summary: ${processed} folders processed, ${warnings} warnings`);
}

generateShopData();