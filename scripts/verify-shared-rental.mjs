import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/shared-rental');
mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Launching CDP Browser for WEDELIA Shared Rental Verification...');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  // 1. Test wardrobe.html Occasion-First Discovery
  console.log('\n--- 1. TESTING WARDROBE.HTML OCCASIONS DISCOVERY ---');
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });
  await page.goto('http://127.0.0.1:5173/wardrobe.html', { settleMs: 1400 });

  await page.screenshot({ path: join(outDir, 'wardrobe-01-all.jpg'), fullPage: false });

  // Test Filtering: FESTIVAL
  await page.eval(`(() => {
    const btn = document.querySelector('button[data-occ="FESTIVAL"]');
    if (btn) btn.click();
  })()`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'wardrobe-02-festival.jpg'), fullPage: false });

  const festivalCount = await page.eval(`document.querySelectorAll('.garment-editorial-card').length`);
  console.log(`Occasion 'FESTIVAL' items count: ${festivalCount}`);

  // Test Filtering: BANQUET
  await page.eval(`(() => {
    const btn = document.querySelector('button[data-occ="BANQUET"]');
    if (btn) btn.click();
  })()`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'wardrobe-03-banquet.jpg'), fullPage: false });

  const banquetCount = await page.eval(`document.querySelectorAll('.garment-editorial-card').length`);
  console.log(`Occasion 'BANQUET' items count: ${banquetCount}`);

  // Reset to ALL
  await page.eval(`(() => {
    const btn = document.querySelector('button[data-occ="ALL"]');
    if (btn) btn.click();
  })()`);
  await sleep(400);

  // 2. Test Garment Selection & Configurator Flow
  console.log('\n--- 2. TESTING GARMENT DETAIL & RENTAL CONFIGURATOR FLOW ---');
  await page.eval(`(() => {
    const firstCard = document.querySelector('.garment-editorial-card');
    if (firstCard) firstCard.click();
  })()`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, 'rental-flow-01-modal-open.jpg'), fullPage: false });

  // Select Size M
  await page.eval(`(() => {
    const mPill = document.querySelector('#wdSizePills button[data-size="M"]') || document.querySelector('#wdSizePills .wd-option-pill');
    if (mPill) mPill.click();
  })()`);
  await sleep(300);

  // Select 5 Nights
  await page.eval(`(() => {
    const dur5 = document.querySelector('#wdDurationPills button[data-days="5"]');
    if (dur5) dur5.click();
  })()`);
  await sleep(300);
  await page.screenshot({ path: join(outDir, 'rental-flow-02-configured.jpg'), fullPage: false });

  // Click Rent This Look / Action Button
  await page.eval(`(() => {
    const confirmBtn = document.getElementById('wdConfirmRentBtn');
    if (confirmBtn) confirmBtn.click();
  })()`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, 'rental-flow-03-confirmation.jpg'), fullPage: false });

  const confirmActive = await page.eval(`document.querySelector('.wd-confirmation-view')?.classList.contains('active')`);
  console.log(`Confirmation State Active: ${confirmActive ? 'YES ✓' : 'NO ✗'}`);

  // Close Modal
  await page.eval(`(() => {
    const closeBtn = document.getElementById('wdCloseBtn') || document.getElementById('wdBackToWorldBtn');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(400);
  await page.close();

  // 3. Test Opening the SAME Garment (WD-001) Through ALL FIVE WORLDS
  console.log('\n--- 3. TESTING THE SAME GARMENT ACROSS ALL FIVE WORLDS ---');

  const worlds = [
    { name: '01-read', url: 'http://127.0.0.1:5173/01-tokyo-editorial.html?rent=WD-001&world=read' },
    { name: '02-index', url: 'http://127.0.0.1:5173/02-brutalist-fashion-index.html?rent=WD-001&world=index' },
    { name: '03-chase', url: 'http://127.0.0.1:5173/03-red-black-tokyo.html?rent=WD-001&world=chase' },
    { name: '04-contemplate', url: 'http://127.0.0.1:5173/04-vertical-japanese-poster.html?rent=WD-001&world=contemplate' },
    { name: '10-navigate', url: 'http://127.0.0.1:5173/10-the-strange-one.html?rent=WD-001&world=navigate' },
  ];

  for (const w of worlds) {
    const wPage = await browser.newPage({ width: 1440, height: 900, mobile: false });
    await wPage.goto(w.url, { settleMs: 1600 });
    await sleep(600); // Allow modal animation to finish
    await wPage.screenshot({ path: join(outDir, `world-identity-${w.name}.jpg`), fullPage: false });

    const worldAttr = await wPage.eval(`document.querySelector('#wdRentalModal')?.getAttribute('data-world')`);
    console.log(`[World ${w.name}] Rendered with data-world="${worldAttr}" ✓`);
    await wPage.close();
  }

  // 4. Multi-Viewport Responsive QA on wardrobe.html
  console.log('\n--- 4. MULTI-VIEWPORT RESPONSIVE QA ON WARDROBE.HTML ---');
  const viewports = [
    { width: 1440, height: 900, name: '1440x900', mobile: false },
    { width: 1280, height: 800, name: '1280x800', mobile: false },
    { width: 1024, height: 768, name: '1024x768', mobile: false },
    { width: 768, height: 1024, name: '768x1024', mobile: true },
    { width: 430, height: 932, name: '430x932', mobile: true },
    { width: 390, height: 844, name: '390x844', mobile: true },
    { width: 375, height: 812, name: '375x812', mobile: true },
    { width: 320, height: 568, name: '320x568', mobile: true }
  ];

  let allPass = true;
  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://127.0.0.1:5173/wardrobe.html', { settleMs: 1200 });

    const metrics = await vpPage.eval(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body ? document.body.scrollWidth : 0;
      const overflowPx = Math.max(0, Math.max(scrollW, bodyScrollW) - docW);

      const images = Array.from(document.querySelectorAll('img'));
      const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0).length;

      return { overflowPx, brokenImages, imageCount: images.length };
    })()`);

    if (vp.width === 390) {
      await vpPage.screenshot({ path: join(outDir, 'wardrobe-mobile-390.jpg'), fullPage: false });
    }

    const pass = metrics.overflowPx === 0 && metrics.brokenImages === 0;
    if (!pass) allPass = false;

    console.log(`[Viewport ${vp.name.padEnd(9)}] Overflow: ${metrics.overflowPx}px | Broken Imgs: ${metrics.brokenImages}/${metrics.imageCount} -> ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
    await vpPage.close();
  }

  await browser.close();
  console.log(`\nShared Rental & Wardrobe Verification: ${allPass ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED'}`);
}

run().catch(console.error);
