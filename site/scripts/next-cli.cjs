/**
 * Run Next.js from the real site directory (fixes Windows junctions:
 * C:\xampp\...\site → D:\Websites\...\site).
 */
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const siteDir = fs.realpathSync.native(path.resolve(__dirname, ".."));
const nextBin = path.join(
  siteDir,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

process.chdir(siteDir);

const args = process.argv.slice(2);
const nodeArgs = [nextBin, ...args];

if (args[0] === "dev") {
  const child = spawn(process.execPath, nodeArgs, {
    cwd: siteDir,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(1);
    }
    process.exit(code ?? 1);
  });
} else {
  const result = spawnSync(process.execPath, nodeArgs, {
    cwd: siteDir,
    stdio: "inherit",
    env: process.env,
  });
  process.exit(result.status ?? 1);
}
