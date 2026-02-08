// copyBase.js
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = process.cwd();
const baseFolder = path.join(projectRoot, "..", "BaseCopy");

const exclude = [
  "node_modules",
  ".next",
  ".turbo",
  ".cache",
  "dev.db",
  "prisma/dev.db",
  "prisma/migrations",
  "prisma/migration_lock.toml",
  "coverage",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
  "pnpm-debug.log",
  ".DS_Store",
  "Thumbs.db",
];

function shouldCopy(src) {
  const rel = path.relative(projectRoot, src);
  return !exclude.some((pattern) => rel.startsWith(pattern));
}

async function copyBase() {
  try {
    await fs.remove(baseFolder);

    await fs.copy(projectRoot, baseFolder, {
      filter: shouldCopy,
    });

    console.log("✅ Base project copied to:", baseFolder);

    console.log("📦 Installing dependencies...");
    execSync("npm install", { cwd: baseFolder, stdio: "inherit" });

    console.log("🧹 Clearing .next cache...");
    await fs.remove(path.join(baseFolder, ".next"));

    console.log("🔒 Running npm audit fix...");
    try {
      execSync("npm audit fix", { cwd: baseFolder, stdio: "inherit" });
      console.log("✅ Audit fixes applied");
    } catch (auditErr) {
      console.warn("⚠️ Audit fix completed with warnings, some issues may remain.");
    }

    console.log("✅ BaseCopy ready");
  } catch (err) {
    console.error("❌ Error copying base project:", err);
  }
}

copyBase();