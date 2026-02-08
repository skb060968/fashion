const fs = require("fs")
const path = require("path")

/**
 * Directories to ignore completely
 */
const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  ".vercel",
])

/**
 * Files to ignore (optional – adjust as needed)
 */
const IGNORE_FILES = new Set([
  "package-lock.json",
  ".DS_Store",
])

function printTree(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const visibleEntries = entries.filter(entry => {
    if (entry.isDirectory()) {
      return !IGNORE_DIRS.has(entry.name)
    }
    return !IGNORE_FILES.has(entry.name)
  })

  visibleEntries.forEach((entry, index) => {
    const isLast = index === visibleEntries.length - 1
    const pointer = isLast ? "└── " : "├── "

    console.log(prefix + pointer + entry.name)

    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ")
      printTree(path.join(dir, entry.name), nextPrefix)
    }
  })
}

// ---------------------------------------------
// RUN FROM PROJECT ROOT
// ---------------------------------------------

const PROJECT_ROOT = process.cwd()

console.log("\n📁 Project Structure\n")
console.log(path.basename(PROJECT_ROOT))
printTree(PROJECT_ROOT)
