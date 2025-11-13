// generated-by: Claude-Code (UPRISE infra guard) 2025-11-13
//
// Purpose:
//   Enforce the web-tier contract so that apps/web
//   cannot directly access DB, secrets, or server-only modules.

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const WEB_DIR = path.join(ROOT, "apps", "web");

// Directories to skip
const SKIP_DIRS = ["node_modules", ".next", ".turbo", "dist", "build"];

// Forbidden patterns
const patterns = [
  { regex: /from\s+['"]@prisma\/client['"]/, msg: "DB access (Prisma) in web" },
  { regex: /from\s+['"]pg['"]/, msg: "DB access (pg) in web" },
  {
    regex: /process\.env\.(?!NEXT_PUBLIC_|NEXT_RUNTIME)/,
    msg: "Client secret leak: process.env (non-NEXT_PUBLIC_) in web client code"
  },
  { regex: /from\s+['"]aws-sdk['"]/, msg: "AWS SDK import in web (server-side only)" }
];

// Recursively scan files
function scan(dir) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    // Skip directories that should be ignored
    if (SKIP_DIRS.includes(item)) {
      continue;
    }

    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      results = results.concat(scan(full));
      continue;
    }

    if (full.endsWith(".ts") || full.endsWith(".tsx")) {
      const content = fs.readFileSync(full, "utf8");

      for (const p of patterns) {
        if (p.regex.test(content)) {
          results.push({ file: full.replace(ROOT, ""), error: p.msg });
        }
      }
    }
  }
  return results;
}

const violations = scan(WEB_DIR);

if (violations.length > 0) {
  console.error("❌ Web Tier Contract Violations Detected:\n");
  for (const v of violations) {
    console.error(`File: ${v.file}`);
    console.error(`  Error: ${v.error}\n`);
  }
  process.exit(1);
} else {
  console.log("✓ Web tier contract validated: no violations.");
}
