const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT_DIR = path.join(process.cwd(), "public/images/shop");
const ITEMS_DIR = path.join(INPUT_DIR, "items");
const THUMBS_DIR = path.join(INPUT_DIR, "thumbnails");

// Clean up both output folders before processing
[ITEMS_DIR, THUMBS_DIR].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted old ${path.basename(dir)} folder`);
  }
  fs.mkdirSync(dir, { recursive: true });
});

async function processDir(inputDir, relativePath = "") {
  const files = fs.readdirSync(inputDir);

  // Filter only jpg/jpeg files
  const imageFiles = files.filter(f =>
    [".jpg", ".jpeg"].includes(path.extname(f).toLowerCase())
  );

  let promises = [];

  for (const file of files) {
    const fullInputPath = path.join(inputDir, file);
    const stat = fs.statSync(fullInputPath);

    if (stat.isDirectory()) {
      // Skip output folders themselves and the meta folder
      if (
        [ITEMS_DIR, THUMBS_DIR].includes(path.resolve(fullInputPath)) ||
        file === "meta"
      ) {
        continue;
      }

      const outputItemsSubDir = path.join(ITEMS_DIR, relativePath, file);
      const outputThumbsSubDir = path.join(THUMBS_DIR, relativePath, file);
      fs.mkdirSync(outputItemsSubDir, { recursive: true });
      fs.mkdirSync(outputThumbsSubDir, { recursive: true });

      await processDir(fullInputPath, path.join(relativePath, file));
    } else if (imageFiles.includes(file)) {
      const baseName = path.basename(file, path.extname(file));
      const outputItemsDir = path.join(ITEMS_DIR, relativePath);
      const outputThumbsDir = path.join(THUMBS_DIR, relativePath);

      // Full-size items (1200x1600)
      promises.push(
        sharp(fullInputPath)
          .resize(600, 800, { fit: "cover" })
          .toFormat("webp")
          .toFile(path.join(outputItemsDir, `${baseName}.webp`))
      );

      // Thumbnails (150x200)
      promises.push(
        sharp(fullInputPath)
          .resize(60, 80, { fit: "cover" })
          .toFormat("webp")
          .toFile(path.join(outputThumbsDir, `${baseName}.webp`))
      );
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
    console.log(
      `Processed ${imageFiles.length} files in ${relativePath || "root"}`
    );
  }
}

// Run the script
(async () => {
  await processDir(INPUT_DIR);
})();