import { copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "@viz-js", "viz", "dist", "viz.js");
const destDir = join(root, "src", "lib", "ViewKoanSupport", "vendor");
const dest = join(destDir, "viz.js");

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
