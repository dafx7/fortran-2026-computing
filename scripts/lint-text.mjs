// Lint teks Bahasa Indonesia di site/ dan materi/.
// Gagal jika ada em dash, en dash, atau pola "bukan X, tapi/tetapi/melainkan Y".
import fs from 'node:fs';
import path from 'node:path';

const dirs = ['site', 'materi'];
const exts = new Set(['.html', '.md', '.js', '.css', '.webmanifest', '.json', '.txt', '.svg']);
const rules = [
  { name: 'em dash', re: /—/ },
  { name: 'en dash', re: /–/ },
  { name: 'pola "bukan X, tapi Y"', re: /bukan\s+\S+.*,\s*(tapi|tetapi|melainkan)/i }
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : exts.has(path.extname(e.name)) ? [p] : [];
  });
}

let hits = 0, files = 0;
for (const file of dirs.flatMap(walk)) {
  files++;
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const r of rules) {
      if (r.re.test(line)) {
        hits++;
        console.log(`${file}:${i + 1}: ${r.name}: ${line.trim().slice(0, 120)}`);
      }
    }
  });
}
if (hits) { console.error(`Lint teks gagal: ${hits} temuan di ${files} berkas.`); process.exit(1); }
console.log(`Lint teks lolos: ${files} berkas diperiksa, 0 temuan.`);
