import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/index-verification');
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
  console.log('Launching CDP Browser for WEDELIA Master Entry Verification...');
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/index.html', { settleMs: 1600 });

  // 1. Hero
  await page.screenshot({ path: join(outDir, 'index-desktop-01-hero.jpg'), fullPage: false });

  // 2. World 01 READ
  await page.eval(`document.querySelector('#world01')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-02-world01-read.jpg'), fullPage: false });

  // 3. World 02 INDEX
  await page.eval(`document.querySelector('#world02')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-03-world02-index.jpg'), fullPage: false });

  // 4. World 03 CHASE
  await page.eval(`document.querySelector('#world03')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-04-world03-chase.jpg'), fullPage: false });

  // 5. World 04 CONTEMPLATE
  await page.eval(`document.querySelector('#world04')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-05-world04-contemplate.jpg'), fullPage: false });

  // 6. World 10 NAVIGATE
  await page.eval(`document.querySelector('#world10')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-06-world10-navigate.jpg'), fullPage: false });

  // 7. Occasion Bridge
  await page.eval(`document.querySelector('.occasion-bridge-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-07-occasions.jpg'), fullPage: false });

  // 8. About Section
  await page.eval(`document.querySelector('.about-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-08-about.jpg'), fullPage: false });

  // 9. Final Selector Bands
  await page.eval(`document.querySelector('.final-selector-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, 'index-desktop-09-final-portals.jpg'), fullPage: false });

  await page.close();

  // Verification across all 8 viewports
  console.log('\n--- VERIFYING ALL 8 VIEWPORTS FOR MASTER INDEX ---');
  let allPass = true;

  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://127.0.0.1:5173/index.html', { settleMs: 1200 });

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
      await vpPage.screenshot({ path: join(outDir, 'index-mobile-01-hero.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#world01')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(300);
      await vpPage.screenshot({ path: join(outDir, 'index-mobile-02-world01.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#world03')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(300);
      await vpPage.screenshot({ path: join(outDir, 'index-mobile-03-world03.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('.final-selector-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(300);
      await vpPage.screenshot({ path: join(outDir, 'index-mobile-04-portals.jpg'), fullPage: false });
    }

    const pass = checks.overflowPx === 0 && checks.brokenImages === 0;
    if (!pass) allPass = false;

    console.log(`[Viewport ${vp.name.padEnd(9)}] Overflow: ${checks.overflowPx}px | Broken Imgs: ${checks.brokenImages}/${checks.imageCount} -> ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
    await vpPage.close();
  }

  await browser.close();
  console.log(`\nAll Master Index Viewport Checks: ${allPass ? 'PASSED (8/8) ✓' : 'FAILED'}`);
}

run().catch(console.error);
