// Mengambil screenshot setiap langkah demo ke materi/screenshots/ sebagai cadangan jika demo langsung gagal.
// Pemakaian: node scripts/capture-screenshots.mjs  (opsional: --video untuk merekam video demo)
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const OUT = 'materi/screenshots';
const PORT = 4174;
const withVideo = process.argv.includes('--video');
fs.mkdirSync(OUT, { recursive: true });

const server = spawn(process.execPath, ['scripts/serve.mjs', 'site', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();

try {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    ...(withVideo ? { recordVideo: { dir: OUT, size: { width: 1366, height: 768 } } } : {})
  });
  const page = await context.newPage();
  const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log(`${OUT}/${name}.png`); };
  const atTrain = async () => { await page.locator('#card-train').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 8)); };

  await page.goto(`http://localhost:${PORT}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await shot('01_alat_awal');

  // Demo A: tiga learning rate.
  await atTrain();
  for (const [lr, name] of [['kecil', '02_gd_terlalu_kecil'], ['pas', '03_gd_pas'], ['besar', '04_gd_terlalu_besar']]) {
    await page.click(`[data-lr="${lr}"]`);
    if (withVideo) { await page.click('#btnGD'); await page.waitForTimeout(6000); }
    await page.click('#btnGDFinish');
    await atTrain();
    await shot(name);
  }
  await page.click('[data-lr="pas"]');
  await page.click('#btnGDFinish');

  // Demo B: GA generasi demi generasi.
  await page.click('#btnGAFinish');
  await atTrain();
  for (const [g, name] of [[0, '05_ga_generasi_1'], [5, '06_ga_generasi_6'], [29, '07_ga_generasi_30']]) {
    await page.evaluate((gen) => { window.__prediktor.run.ga.shown = gen; window.__prediktor.redraw(); }, g);
    await shot(name);
  }
  if (withVideo) { await page.click('#btnGA'); await page.waitForTimeout(6500); }

  await page.click('#tab-pseudocode');
  await shot('08_pseudocode');
  await page.click('#tab-praktik');

  await page.click('#btnGA5');
  await page.locator('#gaManyBox').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 330));
  await shot('09_ga_jalankan_5_kali');

  await page.fill('#predInput', '7');
  await page.click('#btnPredict');
  await page.locator('#card-pred').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 300));
  await shot('10_prediksi');

  await page.fill('#groupInput', '1');
  await page.fill('#conclusionInput', 'GD dengan learning rate pas paling cepat, GA tetap dekat ke jawaban terbaik tanpa memakai kemiringan.');
  await page.click('#btnPresent');
  await page.locator('#card-kartu').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 8));
  await shot('11_kartu_hasil_mode_presentasi');
  await page.click('#btnPresent');
  await page.evaluate(() => localStorage.clear());
  await context.close();

  // Tampilan HP.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  await phone.goto(`http://localhost:${PORT}/`);
  await phone.evaluate(() => localStorage.clear());
  await phone.reload();
  await phone.click('#btnGDFinish');
  await phone.click('#btnGA5');
  await phone.locator('#card-land').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 8));
  await phone.screenshot({ path: `${OUT}/12_tampilan_hp.png` });
  console.log(`${OUT}/12_tampilan_hp.png`);
  await phone.evaluate(() => localStorage.clear());
} finally {
  await browser.close();
  server.kill();
}
if (withVideo) {
  const vids = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  if (vids.length) { fs.renameSync(`${OUT}/${vids[0]}`, `${OUT}/demo.webm`); console.log(`${OUT}/demo.webm`); }
}
