import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const wrapperRoot = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(wrapperRoot, "..");
const output = resolve(wrapperRoot, "dist");
const isWindows = process.platform === "win32";

const run = (command, args, cwd) => {
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: isWindows
  });
};

run("npm", ["install"], frontendRoot);
run("npm", ["run", "build"], frontendRoot);

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(resolve(frontendRoot, "dist"), output, { recursive: true });
