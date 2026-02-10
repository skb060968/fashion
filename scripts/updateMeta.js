// scripts/updateMeta.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../public/images/shop/meta");

let updatedCount = 0;
let skippedCount = 0;

function walkDirSorted(dir, callback) {
  const entries = fs.readdirSync(dir);

  // Sort entries by numeric prefix if present
  entries.sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });

  entries.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDirSorted(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

walkDirSorted(baseDir, (filePath) => {
  if (path.basename(filePath) === "meta.json") {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(raw);

      const folderName = path.basename(path.dirname(filePath));
      const match = folderName.match(/^(\d+)/);
      let changed = false;

      // Update name
      if (match) {
        const number = match[1];
        const newName = `Style ${number}`;
        if (json.name !== newName) {
          json.name = newName;
          changed = true;
        }
      }

      // Clear description
      if (json.description !== "") {
        json.description = "";
        changed = true;
      }

      // Normalize price
      if (typeof json.price === "number") {
        const newPrice = Math.floor(json.price / 1000) * 1000;
        if (json.price !== newPrice) {
          json.price = newPrice;
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
        updatedCount++;
        console.log(`Updated in: ${folderName}`);
      } else {
        skippedCount++;
        console.log(`No changes needed in: ${folderName}`);
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }
});

// Print summary
console.log(`\nSummary: Updated ${updatedCount} folders, skipped ${skippedCount} folders.`);