import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/10-verification');
mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('====================================================');
  console.log('CONCEPT #10 MOTION INITIALIZATION & REFRESH QA SUITE');
  console.log('====================================================\n');

  const browser = await Browser.launch({ width: 1440, height: 900 });
  let overallPass = true;

  // -------------------------------------------------------------
  // TEST A: DIRECT LOAD (10-the-strange-one.html)
  // -------------------------------------------------------------
  console.log('[TEST A] Direct Load of 10-the-strange-one.html...');
  const pageA = await browser.newPage({ width: 1440, height: 900, mobile: false });
  await pageA.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1200 });

  const testAState = await pageA.eval(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const bodyScrollW = document.body ? document.body.scrollWidth : 0;
    const overflowPx = Math.max(0, Math.max(scrollW, bodyScrollW) - docW);
    const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).length;

    const we = document.getElementById('heroForeWe');
    const plate = document.getElementById('heroGarmentPlate');
    const stCount = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;

    return {
      overflowPx,
      brokenImages,
      stCount,
      weOpacity: we ? window.getComputedStyle(we).opacity : null,
      plateOpacity: plate ? window.getComputedStyle(plate).opacity : null
    };
  });

  const passA = testAState.brokenImages === 0 && testAState.overflowPx === 0 &&
                testAState.stCount > 0 && pageA.consoleErrors.length === 0;
  console.log(`  ScrollTriggers registered: ${testAState.stCount}`);
  console.log(`  Hero WE Opacity: ${testAState.weOpacity} | Plate Opacity: ${testAState.plateOpacity}`);
  console.log(`  Overflow: ${testAState.overflowPx}px | Broken Images: ${testAState.brokenImages} | Console Errors: ${pageA.consoleErrors.length}`);
  console.log(`  -> TEST A: ${passA ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!passA) overallPass = false;

  await pageA.screenshot({ path: join(outDir, '10-test-a-direct-load.jpg'), fullPage: false });

  // -------------------------------------------------------------
  // TEST B: HARD REFRESH (Page.reload) AT TOP
  // -------------------------------------------------------------
  console.log('[TEST B] Hard Refresh (Reload) at Top...');
  await pageA.send('Page.reload');
  await sleep(1400);

  const testBState = await pageA.eval(() => {
    const we = document.getElementById('heroForeWe');
    const lia = document.getElementById('heroDeepLia');
    const plate = document.getElementById('heroGarmentPlate');
    const stCount = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;
    const activeStage = document.querySelector('.stage-coord-link.active')?.dataset.stage;

    return {
      stCount,
      activeStage,
      weOpacity: we ? window.getComputedStyle(we).opacity : null,
      liaOpacity: lia ? window.getComputedStyle(lia).opacity : null,
      plateOpacity: plate ? window.getComputedStyle(plate).opacity : null
    };
  });

  const passB = testBState.stCount > 0 && testBState.activeStage === 'arrival' &&
                parseFloat(testBState.weOpacity) > 0.8 && pageA.consoleErrors.length === 0;
  console.log(`  ScrollTriggers active after reload: ${testBState.stCount}`);
  console.log(`  Active Rail Stage: ${testBState.activeStage}`);
  console.log(`  Hero Elements Opacity (WE: ${testBState.weOpacity}, LIA: ${testBState.liaOpacity}, Plate: ${testBState.plateOpacity})`);
  console.log(`  Console Errors: ${pageA.consoleErrors.length}`);
  console.log(`  -> TEST B: ${passB ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!passB) overallPass = false;

  await pageA.screenshot({ path: join(outDir, '10-test-b-hard-refresh.jpg'), fullPage: false });

  // -------------------------------------------------------------
  // TEST C: REFRESH HALFWAY DOWN (SCROLL RESTORATION & RESYNC)
  // -------------------------------------------------------------
  console.log('[TEST C] Refresh While Scrolled Halfway Down (~1600px)...');
  await pageA.eval(() => window.scrollTo(0, 1600));
  await sleep(500);

  const scrollBefore = await pageA.eval(() => window.scrollY);
  console.log(`  Scrolled to: ${scrollBefore}px`);

  await pageA.send('Page.reload');
  await sleep(1400);

  const testCState = await pageA.eval(() => {
    const scrollY = window.scrollY;
    const activeStage = document.querySelector('.stage-coord-link.active')?.dataset.stage;
    const stCount = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;
    const objectsPlate = document.getElementById('spatialImagePlate');

    return {
      scrollY,
      activeStage,
      stCount,
      objectsPlateOpacity: objectsPlate ? window.getComputedStyle(objectsPlate).opacity : null
    };
  });

  const passC = testCState.stCount > 0 && pageA.consoleErrors.length === 0 &&
                parseFloat(testCState.objectsPlateOpacity) > 0.8;
  console.log(`  Scroll restored at: ${testCState.scrollY}px`);
  console.log(`  Active stage after midway reload: ${testCState.activeStage}`);
  console.log(`  Spatial Objects plate opacity: ${testCState.objectsPlateOpacity}`);
  console.log(`  -> TEST C: ${passC ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!passC) overallPass = false;

  await pageA.screenshot({ path: join(outDir, '10-test-c-scrolled-refresh.jpg'), fullPage: false });
  await pageA.close();

  // -------------------------------------------------------------
  // TEST D: NAVIGATION FROM INDEX.HTML -> 10-THE-STRANGE-ONE
  // -------------------------------------------------------------
  console.log('[TEST D] Return to index.html -> Enter #10...');
  const pageD = await browser.newPage({ width: 1440, height: 900, mobile: false });
  await pageD.goto('http://127.0.0.1:5173/index.html', { settleMs: 1000 });

  // Navigate to #10
  await pageD.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1400 });

  const testDState = await pageD.eval(() => {
    const stCount = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;
    const activeStage = document.querySelector('.stage-coord-link.active')?.dataset.stage;
    return { stCount, activeStage };
  });

  const passD = testDState.stCount > 0 && testDState.activeStage === 'arrival' && pageD.consoleErrors.length === 0;
  console.log(`  ScrollTriggers active: ${testDState.stCount} | Active stage: ${testDState.activeStage}`);
  console.log(`  -> TEST D: ${passD ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!passD) overallPass = false;

  // -------------------------------------------------------------
  // TEST E: SCROLL PRODUCES CONTINUOUS SPATIAL MOVEMENT
  // -------------------------------------------------------------
  console.log('[TEST E] Verifying Continuous Scroll Movement Across Stages...');
  
  // 1. Scroll through Arrival and verify parallax differential
  const weInitial = await pageD.eval(() => window.getComputedStyle(document.getElementById('heroForeWe')).transform);
  await pageD.eval(() => window.scrollTo(0, 400));
  await sleep(350);
  const weScrolled = await pageD.eval(() => window.getComputedStyle(document.getElementById('heroForeWe')).transform);
  const arrivalMotionDetected = weInitial !== weScrolled;
  console.log(`  Hero WE Scroll Transform Changed: ${arrivalMotionDetected ? 'YES ✓' : 'NO ✗'}`);

  // 2. Scroll to stageObjects
  await pageD.eval(() => document.getElementById('stageObjects')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await sleep(400);
  const stageObjectsActive = await pageD.eval(() => document.querySelector('.stage-coord-link.active')?.dataset.stage === 'objects');
  console.log(`  Stage 02 (Objects) Active in Rail Nav: ${stageObjectsActive ? 'YES ✓' : 'NO ✗'}`);

  // 3. Scroll to stageOccasions
  await pageD.eval(() => document.getElementById('stageOccasions')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await sleep(500);
  const occasionsActive = await pageD.eval(() => document.querySelector('.stage-coord-link.active')?.dataset.stage === 'occasions');
  const wordsVisible = await pageD.eval(() => {
    const words = Array.from(document.querySelectorAll('.occasion-word-object'));
    return words.every(w => parseFloat(window.getComputedStyle(w).opacity) > 0.5);
  });
  console.log(`  Stage 04 (Occasions) Active: ${occasionsActive ? 'YES ✓' : 'NO ✗'} | Words Revealed: ${wordsVisible ? 'YES ✓' : 'NO ✗'}`);

  // 4. Scroll to stageChamber
  await pageD.eval(() => document.getElementById('stageChamber')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await sleep(500);
  const chamberActive = await pageD.eval(() => document.querySelector('.stage-coord-link.active')?.dataset.stage === 'chamber');
  console.log(`  Stage 06 (Chamber) Active: ${chamberActive ? 'YES ✓' : 'NO ✗'}`);

  const passE = arrivalMotionDetected && stageObjectsActive && occasionsActive && wordsVisible && chamberActive;
  console.log(`  -> TEST E: ${passE ? 'PASS ✓' : 'FAIL ✗'}\n`);
  if (!passE) overallPass = false;

  await pageD.close();

  // -------------------------------------------------------------
  // TEST F: MULTI-VIEWPORT VERIFICATION (1440, 1024, 768, 430, 390)
  // -------------------------------------------------------------
  console.log('[TEST F] Multi-Viewport Responsive QA...');
  const viewports = [
    { width: 1440, height: 900, name: '1440 Desktop' },
    { width: 1024, height: 768, name: '1024 Tablet L' },
    { width: 768, height: 1024, name: '768 Tablet P' },
    { width: 430, height: 932, name: '430 Mobile Pro Max' },
    { width: 390, height: 844, name: '390 Mobile' }
  ];

  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.width <= 768 });
    await vpPage.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1200 });

    const checks = await vpPage.eval(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body ? document.body.scrollWidth : 0;
      const overflowPx = Math.max(0, Math.max(scrollW, bodyScrollW) - docW);
      const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).length;
      const stCount = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;

      return { overflowPx, brokenImages, stCount };
    });

    const vpPass = checks.overflowPx === 0 && checks.brokenImages === 0 &&
                   checks.stCount > 0 && vpPage.consoleErrors.length === 0;
    console.log(`  [${vp.name.padEnd(20)}] Overflow: ${checks.overflowPx}px | Broken Imgs: ${checks.brokenImages} | STs: ${checks.stCount} -> ${vpPass ? 'PASS ✓' : 'FAIL ✗'}`);
    if (!vpPass) overallPass = false;

    await vpPage.close();
  }

  await browser.close();

  console.log('\n====================================================');
  console.log(`FINAL RESULT: ${overallPass ? 'ALL TESTS PASSED (6/6) ✓' : 'SOME TESTS FAILED ✗'}`);
  console.log('====================================================');

  if (!overallPass) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
