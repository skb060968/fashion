const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const rootDir = path.join(process.cwd(), "public/images/shop");

let renamedCount = 0;
let convertedCount = 0;
let autoRenamedCount = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();

      // Rename .jpeg → .jpg
      if (ext === ".jpeg") {
        const newPath = path.join(dir, path.basename(file, ext) + ".jpg");
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${fullPath} → ${newPath}`);
        renamedCount++;
      }

      // Convert .png → .jpg and delete original
      if (ext === ".png") {
        const outputPath = path.join(dir, path.basename(file, ".png") + ".jpg");

        sharp(fullPath)
          .jpeg({ quality: 85 })
          .toFile(outputPath)
          .then(() => {
            fs.unlinkSync(fullPath);
            console.log(`Converted & deleted: ${fullPath} → ${outputPath}`);
            convertedCount++;
          })
          .catch(err => console.error(`Error converting ${fullPath}:`, err));
      }
    }
  });

  // Enforce naming convention based on folder name (slug)
  const slug = path.basename(dir);
  const images = fs.readdirSync(dir).filter(f => f.endsWith(".jpg"));

  if (images.length > 0) {
    // Sort for consistency
    images.sort();

    images.forEach((img, index) => {
      let targetName;
      if (index === images.length - 1) {
        targetName = `${slug}-cover.jpg`;
      } else {
        targetName = `${slug}-${index + 1}.jpg`;
      }

      if (img !== targetName) {
        const oldPath = path.join(dir, img);
        const newPath = path.join(dir, targetName);
        fs.renameSync(oldPath, newPath);
        console.log(`Auto-renamed: ${img} → ${targetName}`);
        autoRenamedCount++;
      }
    });
  }
}

// Start recursive walk
walkDir(rootDir);

// Print summary after async conversions finish
process.on("beforeExit", () => {
  console.log("\n--- Summary ---");
  console.log(`JPEG renamed: ${renamedCount}`);
  console.log(`PNG converted: ${convertedCount}`);
  console.log(`Auto-renamed by slug: ${autoRenamedCount}`);
  console.log("Cleanup complete!");
});