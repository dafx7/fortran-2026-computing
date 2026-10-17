// Uji e2e Prediktor: Misi 1, Jalankan 5 kali, prediksi, Kartu Hasil, luring, dan file://.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol !== 'file:' && u.protocol !== 'data:') errors.push('permintaan eksternal: ' + r.url());
  });
  return errors;
}

async function freshPage(page, url = '/') {
  await page.goto(url);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* abaikan */ } });
  await page.reload();
  await expect(page.locator('#scenarioSelect')).toHaveValue('jarak');
}

test('Misi 1 sampai Kartu Hasil berjalan tanpa error konsol', async ({ page }) => {
  const errors = watchErrors(page);
  await freshPage(page);

  // Misi 1: tiga learning rate.
  await page.click('#btnMisi1');
  await page.click('[data-lr="kecil"]');
  await page.click('#btnGDFinish');
  await expect(page.locator('#gdResult')).toContainText('Belum sampai lembah');
  await page.click('[data-lr="besar"]');
  await page.click('#btnGDFinish');
  await expect(page.locator('#gdWarn')).toHaveText('Error membesar, langkah terlalu jauh. Coba learning rate yang lebih kecil.');
  await page.click('[data-lr="pas"]');
  await page.click('#speedSlider');
  await page.locator('#speedSlider').fill('5');
  await page.click('#btnGD');
  await expect(page.locator('#gdResult')).toContainText('Error akhir: 0,238', { timeout: 15000 });
  await expect(page.locator('#gdWarn')).toBeEmpty();

  // GA satu kali dengan animasi.
  await page.click('#btnGA');
  await expect(page.locator('#gaResult')).toContainText('Evaluasi error: 20 x 30 = 600', { timeout: 20000 });
  await expect(page.locator('#evalCompare')).toContainText('GD 100');

  // Jalankan 5 kali.
  await page.click('#btnGA5');
  const rows = page.locator('#gaManyTable tbody tr');
  await expect(rows).toHaveCount(8);
  await expect(rows.nth(0)).toContainText('2026');
  await expect(rows.nth(4)).toContainText('2030');
  await expect(page.locator('#gaManyTable')).toContainText('Rata-rata');

  // Prediksi.
  await page.fill('#predInput', '7');
  await page.click('#btnPredict');
  await expect(page.locator('#predOut')).toContainText('Untuk jarak 7 km, perkiraan waktu tempuh sekitar 23 menit.');
  await page.fill('#predInput', '15');
  await page.click('#btnPredict');
  await expect(page.locator('#predOut')).toContainText('di luar rentang data');
  await page.fill('#predInput', 'abc');
  await page.click('#btnPredict');
  await expect(page.locator('#predOut')).toContainText('belum bisa dibaca');

  // Kartu Hasil.
  await page.fill('#groupInput', '4');
  await page.fill('#conclusionInput', 'GD paling cepat, GA tetap dekat.');
  const card = page.locator('#hasilCard');
  await expect(card).toContainText('Kelompok 4');
  await expect(card).toContainText('Algoritma Genetika, 5 kali');
  await expect(card).toContainText('Untuk jarak 7 km');
  await expect(card).toContainText('GD paling cepat, GA tetap dekat.');
  await page.click('#btnCopy');
  await expect(page.locator('#toast')).toContainText(/disalin|manual/);

  // Mode Presentasi memperbesar huruf.
  const before = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  await page.click('#btnPresent2');
  const after = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(after).toBeGreaterThan(before);

  // Tidak ada scroll horizontal di halaman.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('Skenario sendiri: isi data, klik grafik, latih, dan prediksi', async ({ page }) => {
  const errors = watchErrors(page);
  await freshPage(page);
  await page.selectOption('#scenarioSelect', 'custom');
  await page.fill('#cName', 'Lampu taman');
  await page.fill('#cXLabel', 'jumlah lampu');
  await page.fill('#cXUnit', 'buah');
  await page.fill('#cYLabel', 'daya listrik');
  await page.fill('#cYUnit', 'watt');
  const data = [[1, 12], [2, 21], [3, 33], [4, 41], [5, 52]];
  for (let i = 0; i < data.length; i++) {
    await page.locator(`#dataTable input[data-row="${i}"][data-key="x"]`).fill(String(data[i][0]));
    await page.locator(`#dataTable input[data-row="${i}"][data-key="y"]`).fill(String(data[i][1]));
  }
  // Klik grafik menambah satu titik di baris kosong terakhir.
  await page.locator('#plot').scrollIntoViewIfNeeded();
  const box = await page.locator('#plot').boundingBox();
  await page.locator('#plot').click({ position: { x: box.width * 0.6, y: box.height * 0.45 } });
  await expect(page.locator('#dataCount')).toContainText('6 titik valid');
  await page.click('#btnGDFinish');
  await page.click('#btnGA5');
  await page.fill('#predInput', '3,5');
  await page.click('#btnPredict');
  await expect(page.locator('#predOut')).toContainText('Untuk jumlah lampu 3,5 buah, perkiraan daya listrik sekitar');
  await expect(page.locator('#hasilCard')).toContainText('Lampu taman');
  // Hapus baris dan validasi data kurang.
  for (let i = 0; i < 6; i++) await page.locator('[data-del="0"]').click();
  await expect(page.locator('#dataWarn')).toContainText('minimal 2 titik');
  await page.click('#btnPakaiPreset');
  await expect(page.locator('#dataCount')).toContainText('9 titik valid');
  expect(errors).toEqual([]);
});

test('Tab Panduan, Pseudocode, dan Tentang Lab bisa dibuka', async ({ page }) => {
  const errors = watchErrors(page);
  await freshPage(page);
  await page.click('#tab-panduan');
  await expect(page.locator('#panel-panduan')).toContainText('Catatan kejujuran');
  await page.click('#tab-pseudocode');
  await expect(page.locator('#panel-pseudocode')).toContainText('Algoritma Genetika');
  await page.click('#tab-tentang');
  await expect(page.locator('#panel-tentang')).toContainText('@computing.lab');
  await expect(page.locator('body')).not.toContainText(/rekrutmen|pendaftaran|open recruitment/i);
  await page.click('#tab-praktik');
  await expect(page.locator('#panel-praktik')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Tetap jalan tanpa internet setelah dibuka sekali (service worker)', async ({ page, context }) => {
  const errors = watchErrors(page);
  await freshPage(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) await page.reload();
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  expect(await page.evaluate(async () => (await caches.keys()).includes('prediktor-v1'))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.brand-title')).toHaveText('Prediktor');
  await page.click('#btnGDFinish');
  await expect(page.locator('#gdResult')).toContainText('Error akhir');
  await context.setOffline(false);
  expect(errors.filter((e) => !/ERR_INTERNET_DISCONNECTED/.test(e))).toEqual([]);
});

test('Bisa dibuka langsung dari file:// (cadangan USB)', async ({ page }) => {
  const errors = watchErrors(page);
  const url = pathToFileURL(path.join(__dirname, '..', '..', 'site', 'index.html')).href;
  await page.goto(url);
  await expect(page.locator('#scenarioSelect')).toHaveValue('jarak');
  await page.click('#btnGDFinish');
  await expect(page.locator('#gdResult')).toContainText('Error akhir');
  await page.click('#btnGA5');
  await expect(page.locator('#gaManyTable tbody tr')).toHaveCount(8);
  const hasSW = await page.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
  expect(hasSW).toBe(false);
  expect(errors).toEqual([]);
});
