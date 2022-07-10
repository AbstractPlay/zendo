import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from "path";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    '__APP_VERSION__': JSON.stringify(pkg.version),
  },
  base: process.env.NODE_ENV === 'production' ? '/zendo/' : '/',
  resolve: {
    alias: [
      {
        find: "@", replacement: path.resolve("./src")
      }
    ]
  }
})
