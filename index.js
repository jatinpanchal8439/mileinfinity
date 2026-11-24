import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = fs.existsSync(path.resolve(__dirname, '.output/server/index.mjs'))
  ? path.resolve(__dirname, '.output/server/index.mjs')
  : path.resolve(__dirname, '../.output/server/index.mjs');

await import(serverPath);

