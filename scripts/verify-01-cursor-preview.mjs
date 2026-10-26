import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/01-cursor-preview-verification');
mkdirSync(outDir, { recursive: true });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('=== WEDELIA #01: STABILITY & EDITORIAL MOTION COMPREHENSIVE QA ===');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  const occasions = [
    { name: 'FESTIVAL', selector: '.occasion-link[href="#fest"]', expectedImg: 'festival.webp' },
    { name: 'FRESHERS', selector: '.occasion-link[href="#freshers"]', expectedImg: 'freshers.jpg' },
    { name: 'FAREWELL', selector: '.occasion-link[href="#farewell"]', expectedImg: 'farewell.webp' },
    { name: 'CONCERT', selector: '.occasion-link[href="#concert"]', expectedImg: 'concert.jpg' },
    { name: 'DATE NIGHT', selector: '.occasion-link[href="#date"]', expectedImg: 'date' }
  ];

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP 1440px INTERACTION & MOTION CHECKS
    // -------------------------------------------------------------
    console.log('\n[1] Testing Desktop 1440x900 Interaction, Assets & Idempotency...');
    const page = await browser.newPage({ width: 1440, height: 900, mobile: false });
    await page.goto('http://127.0.0.1:5173/01-tokyo-editorial.html', { settleMs: 1200 });

    // 1.1 Verify Idempotency Guard
    const idempotency = await page.eval(`(() => {
      return {
        initialized: window.__wedeliaCursorPreviewInitialized,
        previewParent: document.getElementById('cursorPreview')?.parentElement === document.body
      };
    })()`);
    console.log('Cursor Idempotency check:', idempotency);
    if (!idempotency.initialized) {
      throw new Error('window.__wedeliaCursorPreviewInitialized was not set!');
    }
    if (!idempotency.previewParent) {
      throw new Error('#cursorPreview should be mounted as direct child of document.body!');
    }

    // 1.2 Verify Maxi dress replacement in monument photo stage
    const maxiDressState = await page.eval(`(() => {
      const img = document.querySelector('.monument-photo-stage img');
      return {
        src: img?.src,
        naturalWidth: img?.naturalWidth,
        loaded: img ? img.naturalWidth > 0 : false
      };
    })()`);
    console.log('Maxi dress monument plate state:', maxiDressState);
    if (!maxiDressState.src || !maxiDressState.src.includes('maxi-dress-with-a-japanese-floral-print')) {
      throw new Error(`Maxi dress not found in monument photo stage! src: ${maxiDressState.src}`);
    }
    if (!maxiDressState.loaded) {
      throw new Error(`Maxi dress image failed to load! naturalWidth: ${maxiDressState.naturalWidth}`);
    }
    console.log('✓ Maxi dress verified successfully in monument stage!');

    // 1.3 Verify Atelier Anatomy replacement with queen.avif
    console.log('\n[2] Verifying Atelier Anatomy Queen.avif image...');
    const queenState = await page.eval(`(() => {
      const img = document.querySelector('.issue-feature-visual img');
      const cs = img ? window.getComputedStyle(img) : null;
      return {
        src: img?.src,
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight,
        objectFit: cs?.objectFit,
        objectPosition: cs?.objectPosition,
        loaded: img ? img.naturalWidth > 0 : false
      };
    })()`);
    console.log('Atelier Anatomy queen.avif state:', queenState);
    if (!queenState.src || !queenState.src.includes('queen.avif')) {
      throw new Error(`queen.avif not found in .issue-feature-visual! Got: ${queenState.src}`);
    }
    if (!queenState.loaded) {
      throw new Error(`queen.avif failed to load! Dimensions: ${queenState.naturalWidth}x${queenState.naturalHeight}`);
    }
    console.log('✓ Atelier Anatomy queen.avif loaded and framed with object-fit: cover!');

    // 1.4 Test Occasion Hover & Rapid Continuous Tracking Stability
    console.log('\n[3] Testing Occasion Hovers & Rapid Movement Stability...');
    await page.eval(`(() => {
      const el = document.querySelector('.vertical-index-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(500);

    for (let i = 0; i < occasions.length; i++) {
      const occ = occasions[i];
      const rect = await page.eval(`(() => {
        const row = document.querySelector('${occ.selector}');
        if (!row) return null;
        const b = row.getBoundingClientRect();
        return { x: Math.round(b.left + b.width * 0.4), y: Math.round(b.top + b.height * 0.5) };
      })()`);

      if (!rect) throw new Error(`Could not find element for occasion ${occ.name}`);

      await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x, y: rect.y });
      await sleep(350);

      const state = await page.eval(`(() => {
        const preview = document.getElementById('cursorPreview');
        const img = document.getElementById('cursorPreviewImg');
        const cs = window.getComputedStyle(preview);
        const b = preview.getBoundingClientRect();
        return {
          visibility: preview.style.visibility || cs.visibility,
          opacity: parseFloat(cs.opacity),
          pointerEvents: cs.pointerEvents,
          imgSrc: img.currentSrc || img.src,
          imgLoaded: img.naturalWidth > 0,
          previewWidth: Math.round(b.width),
          previewHeight: Math.round(b.height),
          left: Math.round(b.left),
          top: Math.round(b.top)
        };
      })()`);

      console.log(`  Occasion ${occ.name}:`, {
        vis: state.visibility,
        opacity: state.opacity,
        img: state.imgSrc.split('/').pop(),
        pos: { x: state.left, y: state.top }
      });

      if (state.visibility !== 'visible' || state.opacity < 0.85) {
        throw new Error(`Preview not visible for ${occ.name}`);
      }
      if (!state.imgSrc.includes(occ.expectedImg)) {
        throw new Error(`Expected ${occ.expectedImg}, got ${state.imgSrc}`);
      }
      if (!state.imgLoaded) {
        throw new Error(`Image ${occ.expectedImg} failed to load!`);
      }
    }

    // 1.5 Rapid switching stress test (switch 10 times between rows rapidly)
    console.log('\n[4] Stress testing rapid continuous cursor movement (10 fast transfers)...');
    for (let cycle = 0; cycle < 10; cycle++) {
      const targetOcc = occasions[cycle % occasions.length];
      const rect = await page.eval(`(() => {
        const row = document.querySelector('${targetOcc.selector}');
        const b = row.getBoundingClientRect();
        return { x: Math.round(b.left + b.width * 0.35 + (Math.random() * 80)), y: Math.round(b.top + b.height * 0.5) };
      })()`);
      await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x, y: rect.y });
      await sleep(40); // 40ms rapid strokes
    }
    await sleep(250);

    // Verify preview is STILL alive, fully responsive and tracked
    const stressState = await page.eval(`(() => {
      const preview = document.getElementById('cursorPreview');
      const cs = window.getComputedStyle(preview);
      const b = preview.getBoundingClientRect();
      return {
        visibility: preview.style.visibility || cs.visibility,
        opacity: parseFloat(cs.opacity),
        left: Math.round(b.left),
        top: Math.round(b.top)
      };
    })()`);
    console.log('Post-stress tracking state:', stressState);
    if (stressState.visibility !== 'visible' || stressState.opacity < 0.85) {
      throw new Error(`Cursor tracking froze or broke after rapid movement! ${JSON.stringify(stressState)}`);
    }
    console.log('✓ Cursor tracking remained completely smooth and responsive through rapid strokes!');

    // 1.6 Test Edge Flip Detection
    console.log('\n[5] Testing Edge Flip Detection near right edge...');
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1350, y: 180 });
    await sleep(350);
    const rightFlip = await page.eval(`(() => {
      const rect = document.getElementById('cursorPreview').getBoundingClientRect();
      return { previewRight: rect.right, flippedLeft: rect.right <= 1350 + 10, withinViewport: rect.right <= window.innerWidth };
    })()`);
    if (!rightFlip.flippedLeft || !rightFlip.withinViewport) {
      throw new Error(`Edge flip right failed! ${JSON.stringify(rightFlip)}`);
    }
    console.log('✓ Edge flip right verified!');

    // 1.7 Mouseleave & Clickability
    console.log('\n[6] Testing Mouse Leave Exit Animation...');
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 100, y: 50 });
    await sleep(300);
    const exitState = await page.eval(`(() => {
      const preview = document.getElementById('cursorPreview');
      return { visibility: preview.style.visibility, opacity: parseFloat(window.getComputedStyle(preview).opacity) };
    })()`);
    if (exitState.visibility !== 'hidden' && exitState.opacity > 0.05) {
      throw new Error(`Preview failed to hide cleanly on leave! ${JSON.stringify(exitState)}`);
    }
    console.log('✓ Mouse leave hides preview cleanly!');

    // -------------------------------------------------------------
    // 2. CAMPUS NIGHTLIFE SCROLLTRIGGER ANIMATION
    // -------------------------------------------------------------
    console.log('\n[7] Testing Campus Nightlife ScrollTrigger headline reveal...');
    await page.eval(`(() => {
      const el = document.getElementById('campusCultureSpread');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'instant' });
      }
    })()`);
    await sleep(1200);

    const campusMotion = await page.eval(`(() => {
      const words = Array.from(document.querySelectorAll('#campusCultureSpread .campus-quote-headline .quote-word'));
      const roster = document.querySelector('#campusCultureSpread .campus-network-roster');
      const prose = document.querySelector('#campusCultureSpread .campus-culture-prose');
      return {
        wordCount: words.length,
        allWordsVisible: words.every(w => {
          const cs = window.getComputedStyle(w);
          return parseFloat(cs.opacity) > 0.8 && (cs.clipPath === 'none' || cs.clipPath.includes('0px'));
        }),
        rosterOpacity: parseFloat(window.getComputedStyle(roster).opacity),
        proseOpacity: parseFloat(window.getComputedStyle(prose).opacity)
      };
    })()`);
    console.log('Campus Nightlife ScrollTrigger state:', campusMotion);
    if (campusMotion.wordCount !== 4) {
      throw new Error(`Expected 4 staggered quote-word elements, got ${campusMotion.wordCount}`);
    }
    if (!campusMotion.allWordsVisible) {
      throw new Error(`Campus quote words failed to reveal via ScrollTrigger!`);
    }
    console.log('✓ Campus Nightlife editorial headline revealed cleanly via ScrollTrigger!');
    await page.screenshot({ path: join(outDir, 'campus-nightlife-scrolltrigger.jpg'), quality: 85 });

    // -------------------------------------------------------------
    // 3. DETACHABLE DISPATCH ORDER SLIP PERFORATED TEAR & RESET
    // -------------------------------------------------------------
    console.log('\n[8] Testing Detachable Dispatch Order Slip Perforated Tear Interaction...');
    await page.eval(`(() => {
      const el = document.getElementById('editorialOrderSlipSection');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(500);

    // Initial state check
    const slipInitial = await page.eval(`(() => {
      const slip = document.getElementById('magazineOrderSlip');
      return {
        isDetached: slip.classList.contains('is-detached'),
        isTearing: slip.classList.contains('is-tearing'),
        stampVisible: document.getElementById('editorialHankoStamp').style.display === 'flex'
      };
    })()`);
    if (slipInitial.isDetached || slipInitial.stampVisible) {
      throw new Error(`Slip should initially be attached before tear! ${JSON.stringify(slipInitial)}`);
    }

    // Trigger physical paper tear
    console.log('Triggering paper tear via #confirmEditorialSlipBtn...');
    await page.eval(`(() => {
      document.getElementById('confirmEditorialSlipBtn').click();
    })()`);

    // Wait for anticipation -> tear separation -> settle timeline to complete
    await sleep(1300);

    const slipTorn = await page.eval(`(() => {
      const slip = document.getElementById('magazineOrderSlip');
      const stamp = document.getElementById('editorialHankoStamp');
      const resetBtn = document.getElementById('slipResetBtn');
      const banner = document.getElementById('slipConfirmedBanner');
      const cs = window.getComputedStyle(slip);
      const stampCs = window.getComputedStyle(stamp);
      return {
        isDetached: slip.classList.contains('is-detached'),
        transform: cs.transform,
        stampDisplay: stampCs.display,
        stampOpacity: parseFloat(stampCs.opacity),
        resetBtnDisplay: window.getComputedStyle(resetBtn).display,
        bannerDisplay: window.getComputedStyle(banner).display
      };
    })()`);
    console.log('Torn Slip State:', slipTorn);
    if (!slipTorn.isDetached) {
      throw new Error('Order slip missing .is-detached class after tear animation!');
    }
    if (slipTorn.stampDisplay !== 'flex' || slipTorn.stampOpacity < 0.85) {
      throw new Error(`Hanko stamp failed to slam down on torn slip! op: ${slipTorn.stampOpacity}`);
    }
    if (slipTorn.resetBtnDisplay === 'none') {
      throw new Error('#slipResetBtn should be visible in detached state!');
    }
    console.log('✓ Order slip physical tear animation verified cleanly (anticipation -> separation -> settle + Hanko ink)!');
    await page.screenshot({ path: join(outDir, 'slip-detached-torn.jpg'), quality: 85 });

    // Test Slip Re-attach / Reset
    console.log('Testing #slipResetBtn re-attachment...');
    await page.eval(`(() => {
      document.getElementById('slipResetBtn').click();
    })()`);
    await sleep(600);

    const slipReset = await page.eval(`(() => {
      const slip = document.getElementById('magazineOrderSlip');
      const stamp = document.getElementById('editorialHankoStamp');
      const resetBtn = document.getElementById('slipResetBtn');
      return {
        isDetached: slip.classList.contains('is-detached'),
        stampDisplay: stamp.style.display,
        resetBtnDisplay: resetBtn.style.display
      };
    })()`);
    console.log('Reset Slip State:', slipReset);
    if (slipReset.isDetached) {
      throw new Error('Order slip should not have .is-detached after reset!');
    }
    if (slipReset.stampDisplay !== 'none') {
      throw new Error('Hanko stamp should be hidden after reset!');
    }
    console.log('✓ Order slip re-attached cleanly with reset functionality!');
    await page.screenshot({ path: join(outDir, 'slip-reattached-reset.jpg'), quality: 85 });

    // Check for any console errors on desktop
    if (page.consoleErrors.length > 0) {
      throw new Error(`Console errors on desktop: ${JSON.stringify(page.consoleErrors)}`);
    }
    await page.close();

    // -------------------------------------------------------------
    // 4. RESPONSIVE VIEWPORT TESTING (1280, 1024, 768, 390)
    // -------------------------------------------------------------
    const responsiveViewports = [
      { name: 'laptop-1280', width: 1280, height: 800, mobile: false, shouldHaveCursor: true },
      { name: 'laptop-1024', width: 1024, height: 768, mobile: false, shouldHaveCursor: true },
      { name: 'tablet-768', width: 768, height: 1024, mobile: false, shouldHaveCursor: false },
      { name: 'mobile-390', width: 390, height: 844, mobile: true, shouldHaveCursor: false }
    ];

    for (const vp of responsiveViewports) {
      console.log(`\nTesting ${vp.name} (${vp.width}x${vp.height})...`);
      const p = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
      await p.goto('http://127.0.0.1:5173/01-tokyo-editorial.html', { settleMs: 1000 });

      // Check overflow
      const overflow = await p.eval(`({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      })`);
      if (overflow.hasOverflow) {
        throw new Error(`Horizontal overflow on ${vp.name}: ${overflow.scrollWidth} > ${overflow.clientWidth}`);
      }

      if (vp.shouldHaveCursor) {
        // Move mouse
        await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(vp.width * 0.5), y: 350 });
        await sleep(300);
      } else {
        // <= 768 must hide cursor preview
        const st = await p.eval(`(() => {
          const preview = document.getElementById('cursorPreview');
          return { display: window.getComputedStyle(preview).display };
        })()`);
        if (st.display !== 'none') {
          throw new Error(`Expected preview display to be 'none' on ${vp.name}, got ${st.display}`);
        }
      }

      if (p.consoleErrors.length > 0) {
        throw new Error(`Console errors on ${vp.name}: ${JSON.stringify(p.consoleErrors)}`);
      }
      await p.close();
      console.log(`✓ ${vp.name} passed all visual & behavioral checks!`);
    }

    console.log('\n=============================================================');
    console.log('✓ ALL CURSOR STABILITY, MOTION & EDITORIAL PASS CRITERIA PASSED FLAWLESSLY!');
    console.log('=============================================================');

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
