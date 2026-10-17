// Membuat kode QR menuju URL alat.
// Pemakaian: node scripts/make-qr.mjs https://alamat-alat.netlify.app
// Menulis site/qr.svg dan materi/qr.png.
import QRCode from 'qrcode';
import fs from 'node:fs';

const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) {
  console.error('Pemakaian: node scripts/make-qr.mjs <URL yang diawali http:// atau https://>');
  process.exit(1);
}
const opts = { errorCorrectionLevel: 'M', margin: 2, color: { dark: '#0A2540', light: '#FFFFFF' } };
const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
fs.writeFileSync('site/qr.svg', svg.replace('<svg ', `<svg role="img" aria-label="QR ${url}" `));
await QRCode.toFile('materi/qr.png', url, { ...opts, type: 'png', width: 800 });
fs.writeFileSync('materi/qr-url.txt', url + '\n');
console.log(`QR dibuat untuk ${url}: site/qr.svg dan materi/qr.png`);
