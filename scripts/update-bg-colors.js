const fs = require("fs");
const path = require("path");


// 🔒 Project root = folder where you launch Node
const PROJECT_ROOT = process.cwd();

const TARGET_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const IGNORE_DIRS = ["node_modules", ".next", "dist", "build", ".git"];

const REPLACEMENTS = [
  { from: "bg-stone", to: "bg-stone" },
  
];

function shouldIgnore(fullPath) {
  return IGNORE_DIRS.some((dir) =>
    fullPath.split(path.sep).includes(dir)
  );
}

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (shouldIgnore(fullPath)) continue;

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!TARGET_EXTENSIONS.includes(path.extname(entry.name))) continue;

    let content = fs.readFileSync(fullPath, "utf8");
    let updated = content;

    for (const { from, to } of REPLACEMENTS) {
      updated = updated.replace(
        new RegExp(`\\b${from}\\b`, "g"),
        to
      );
    }

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated, "utf8");
      console.log(`✔ Updated: ${path.relative(PROJECT_ROOT, fullPath)}`);
    }
  }
}

console.log("🎨 Updating background classes inside project only...");
walk(PROJECT_ROOT);
console.log("✅ Done. No files outside this project were touched.");
