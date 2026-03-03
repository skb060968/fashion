// scripts/copyBase.js
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
  ".git",
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
  "tsconfig.json",
  "tailwind.config.js",
  "postcss.config.js",
  "next.config.js",
  "package-lock.json",
  "next-env.d.ts",
];

function shouldCopy(src) {
  const rel = path.relative(projectRoot, src);
  return !exclude.some((pattern) => rel.startsWith(pattern));
}

async function copyBase() {
  try {
    await fs.remove(baseFolder);
    await fs.copy(projectRoot, baseFolder, { filter: shouldCopy });

    console.log("✅ Base project copied to:", baseFolder);

    console.log("📦 Installing dependencies...");
    execSync("npm install", { cwd: baseFolder, stdio: "inherit" });

    console.log("⚙️ Initializing configs...");
    execSync("npx tsc --init", { cwd: baseFolder, stdio: "inherit" });
    execSync("npx tailwindcss init -p", { cwd: baseFolder, stdio: "inherit" });
    execSync("npx prisma generate", { cwd: baseFolder, stdio: "inherit" });

    // Next.js config
    const nextConfigPath = path.join(baseFolder, "next.config.js");
    const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
`;
    await fs.writeFile(nextConfigPath, nextConfigContent);

    // Tailwind config
    const tailwindConfigPath = path.join(baseFolder, "tailwind.config.js");
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "fashion-gold": "#c8a951",
        "fashion-black": "#1a1a1a",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
`;
    await fs.writeFile(tailwindConfigPath, tailwindConfigContent);

    // tsconfig.json overwrite (safe JSON, no comments)
    const tsConfigPath = path.join(baseFolder, "tsconfig.json");
    const tsConfigContent = {
      compilerOptions: {
        target: "es2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "react-jsx",
        incremental: true,
        plugins: [{ name: "next" }],
        baseUrl: ".",
        paths: {
          "@/*": ["./*"]
        }
      },
      include: [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts"
      ],
      exclude: ["node_modules"]
    };
    await fs.writeJson(tsConfigPath, tsConfigContent, { spaces: 2 });

    console.log("🧹 Clearing .next cache...");
    await fs.remove(path.join(baseFolder, ".next"));

    console.log("🔒 Running npm audit fix...");
    try {
      execSync("npm audit fix", { cwd: baseFolder, stdio: "inherit" });
    } catch {
      console.warn("⚠️ Audit fix completed with warnings, some issues may remain.");
    }

    // Final summary
    console.log("\n📋 Config Summary:");
    console.log("   • next.config.js → reactStrictMode + images.unoptimized");
    console.log("   • tailwind.config.js → content paths + fashion-gold/black colors + Playfair Display font");
    console.log("   • tsconfig.json → baseUrl + @/* alias + module: esnext + target: es2017");
    console.log("\n✅ BaseCopy ready as a fresh project\n");
  } catch (err) {
    console.error("❌ Error copying base project:", err);
  }
}

copyBase();