// Menghitung total ukuran site/ (tanpa qr.svg). Batas: 200 KB.
import fs from 'node:fs';
import path from 'node:path';
let total = 0;
for (const f of fs.readdirSync('site')) {
  const size = fs.statSync(path.join('site', f)).size;
  console.log(`${f.padEnd(22)} ${(size / 1024).toFixed(1)} KB`);
  if (f !== 'qr.svg') total += size;
}
console.log(`Total tanpa qr.svg: ${(total / 1024).toFixed(1)} KB (batas 200 KB)`);
if (total > 200 * 1024) process.exit(1);
