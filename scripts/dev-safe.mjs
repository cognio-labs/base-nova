import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const devOutputDir = resolve(projectRoot, ".next", "dev");

if (existsSync(devOutputDir)) {
  rmSync(devOutputDir, { recursive: true, force: true });
  console.log(`[dev-safe] Cleared ${devOutputDir}`);
}

const nextBin = resolve(projectRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  ["--max-old-space-size=4096", nextBin, "dev", "--webpack", "-p", "302"],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
