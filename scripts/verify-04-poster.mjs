import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/04-verification');
mkdirSync(outDir, { recursive: true });

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

async function run() {
  console.log('Launching CDP Browser for Concept #04 Verification...');
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/04-vertical-japanese-poster.html', { settleMs: 1500 });

  // 1. Desktop Hero
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-hero.jpg'), fullPage: false });

  // 2. Room 002 Kakemono Scroll
  await page.eval(`document.querySelector('#chamberKakemono')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-kakemono.jpg'), fullPage: false });

  // Test interactive unroll on specimen 1
  await page.eval(`document.querySelectorAll('#kakemonoTabs .kakemono-specimen-tab')[1]?.click()`);
  await sleep(800);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-kakemono-unrolled.jpg'), fullPage: false });

  // 3. Room 003 Occasion Chambers
  await page.eval(`document.querySelector('#chamberOccasions')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-occasions.jpg'), fullPage: false });

  // 4. Room 004 Suspended Textiles
  await page.eval(`document.querySelector('#chamberTextiles')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-textiles.jpg'), fullPage: false });

  // 5. Room 005 Custody Record
  await page.eval(`document.querySelector('#chamberCustody')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-custody.jpg'), fullPage: false });

  // Test Custody Hanko Seal Press
  await page.eval(`document.querySelector('#btnLoanSeal')?.click()`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-custody-sealed.jpg'), fullPage: false });

  // 6. Room 006 Exit
  await page.eval(`document.querySelector('#chamberExit')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '04-transformed-desktop-exit.jpg'), fullPage: false });

  await page.close();

  // Verification across all 8 viewports
  console.log('\n--- VERIFYING ALL 8 VIEWPORTS FOR CONCEPT #04 ---');
  let allPass = true;

  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://127.0.0.1:5173/04-vertical-japanese-poster.html', { settleMs: 1000 });

    const checks = await vpPage.eval(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body ? document.body.scrollWidth : 0;
      const overflowPx = Math.max(0, Math.max(scrollW, bodyScrollW) - docW);
      
      const images = Array.from(document.querySelectorAll('img'));
      const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0).length;

      return {
        overflowPx,
        imageCount: images.length,
        brokenImages
      };
    })()`);

    if (vp.width === 390) {
      await vpPage.screenshot({ path: join(outDir, '04-transformed-mobile-hero.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#chamberKakemono')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(500);
      await vpPage.screenshot({ path: join(outDir, '04-transformed-mobile-kakemono.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#chamberCustody')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(500);
      await vpPage.screenshot({ path: join(outDir, '04-transformed-mobile-custody.jpg'), fullPage: false });
    }

    const pass = checks.overflowPx === 0 && checks.brokenImages === 0;
    if (!pass) allPass = false;

    console.log(`[Viewport ${vp.name.padEnd(9)}] Overflow: ${checks.overflowPx}px | Broken Imgs: ${checks.brokenImages}/${checks.imageCount} -> ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
    await vpPage.close();
  }

  await browser.close();
  console.log(`\nAll Viewport Checks ${allPass ? 'PASSED (8/8) ✓' : 'HAD FAILURES'}`);
}

run().catch(console.error);
