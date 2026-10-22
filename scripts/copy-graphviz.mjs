import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "@viz-js", "viz", "dist", "viz.js");
const destDir = join(root, "vendor", "graphviz");
const dest = join(destDir, "viz.js");

mkdirSync(destDir, { recursive: true });
const body = readFileSync(src, "utf8");
const stamped = body.startsWith("// @ts-nocheck")
    ? body
    : `// @ts-nocheck\n${body}`;
writeFileSync(dest, stamped);
