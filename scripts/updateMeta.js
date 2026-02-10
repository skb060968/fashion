// scripts/updateMeta.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../public/images/shop/meta");

let processedCount = 0;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

walkDir(baseDir, (filePath) => {
  if (path.basename(filePath) === "meta.json") {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(raw);

      // Derive folder name (e.g., "1dress", "2dress")
      const folderName = path.basename(path.dirname(filePath));

      // Extract the number part (e.g., "1" from "1dress")
      const match = folderName.match(/^(\d+)/);
      if (match) {
        const number = match[1];
        json.name = `Style ${number}`;
      }

      // Clear description field
      json.description = "";

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");

      processedCount++;
      console.log(`Updated name and description in: ${folderName}`);
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }
});

// Print summary
console.log(`\nSummary: Updated ${processedCount} folders successfully.`);