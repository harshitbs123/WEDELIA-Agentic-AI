import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/10-verification');
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
  console.log('Launching CDP Browser for Concept #10 Spatial Transformation Verification...');
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1600 });

  // 1. Stage 1: Destroyed Hero (3D Spatial Volume)
  await page.screenshot({ path: join(outDir, '10-desktop-01-hero-volume.jpg'), fullPage: false });

  // 2. Stage 2: Monolith Garment Installation
  await page.eval(`document.querySelector('#stageObjects')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-02-monolith-field.jpg'), fullPage: false });

  // Test vector tab switch to Vector β (Dior Zemire)
  await page.eval(`document.querySelectorAll('#spatialVectorTabs .vector-tab-btn')[1]?.click()`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, '10-desktop-02-monolith-switched.jpg'), fullPage: false });

  // 3. Stage 3: The Impossible Section (Non-Euclidean aperture)
  await page.eval(`document.querySelector('#stageImpossible')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-03-impossible-chamber.jpg'), fullPage: false });

  // 4. Stage 4: Scattered Occasion 3D Void
  await page.eval(`document.querySelector('#stageOccasions')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-04-occasions-void.jpg'), fullPage: false });

  // 5. Stage 5: Teleport Threshold
  await page.eval(`document.querySelector('#stageTeleport')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-05-teleport-threshold.jpg'), fullPage: false });

  // Test teleport trigger
  await page.eval(`document.querySelector('#btnTriggerTeleport')?.click()`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, '10-desktop-05-teleport-displaced.jpg'), fullPage: false });

  // 6. Stage 6: Convergence Rental Chamber
  await page.eval(`document.querySelector('#stageChamber')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-06-chamber-open.jpg'), fullPage: false });

  // Test convergence collapse commit
  await page.eval(`document.querySelector('#btnCommitConvergence')?.click()`);
  await sleep(600);
  await page.screenshot({ path: join(outDir, '10-desktop-06-chamber-collapsed.jpg'), fullPage: false });

  // 7. Stage 7: Directory & Colophon Exit
  await page.eval(`document.querySelector('#stageExit')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(500);
  await page.screenshot({ path: join(outDir, '10-desktop-07-colophon-exit.jpg'), fullPage: false });

  await page.close();

  // Verification across all 8 viewports
  console.log('\n--- VERIFYING ALL 8 VIEWPORTS FOR CONCEPT #10 ---');
  let allPass = true;

  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1200 });

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
      // Mobile captures
      await vpPage.screenshot({ path: join(outDir, '10-mobile-01-hero.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#stageObjects')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(400);
      await vpPage.screenshot({ path: join(outDir, '10-mobile-02-objects.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#stageImpossible')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(400);
      await vpPage.screenshot({ path: join(outDir, '10-mobile-03-impossible.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#stageOccasions')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(400);
      await vpPage.screenshot({ path: join(outDir, '10-mobile-04-occasions.jpg'), fullPage: false });
      await vpPage.eval(`document.querySelector('#stageChamber')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await sleep(400);
      await vpPage.screenshot({ path: join(outDir, '10-mobile-06-chamber.jpg'), fullPage: false });
    }

    const pass = checks.overflowPx === 0 && checks.brokenImages === 0;
    if (!pass) allPass = false;

    console.log(`[Viewport ${vp.name.padEnd(9)}] Overflow: ${checks.overflowPx}px | Broken Imgs: ${checks.brokenImages}/${checks.imageCount} -> ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
    await vpPage.close();
  }

  await browser.close();
  console.log(`\nAll Concept #10 Viewport Checks: ${allPass ? 'PASSED (8/8) ✓' : 'FAILED'}`);
}

run().catch(console.error);
