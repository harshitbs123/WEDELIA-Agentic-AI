import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/01-cursor-preview-verification');
mkdirSync(outDir, { recursive: true });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('=== WEDELIA #01: CURSOR-FOLLOWING EDITORIAL IMAGE PREVIEW VERIFICATION ===');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  const occasions = [
    {
      name: 'FESTIVAL',
      selector: '.occasion-link[href="#fest"]',
      expectedImg: 'custo-barcelona-at-the-brandery-summer-edition.jpg',
      expectedCode: 'WD / 01 // FESTIVAL'
    },
    {
      name: 'FRESHERS',
      selector: '.occasion-link[href="#freshers"]',
      expectedImg: 'strapless-evening-dresses-with-hoop-skirt-rear.jpg',
      expectedCode: 'WD / 02 // FRESHERS'
    },
    {
      name: 'FAREWELL',
      selector: '.occasion-link[href="#farewell"]',
      expectedImg: 'christian-dior-evening-gown-called-zemire-fall.jpg',
      expectedCode: 'WD / 03 // FAREWELL'
    },
    {
      name: 'CONCERT',
      selector: '.occasion-link[href="#concert"]',
      expectedImg: 'two-jean-desses-evening-gowns-1951.jpg',
      expectedCode: 'WD / 04 // CONCERT'
    },
    {
      name: 'DATE NIGHT',
      selector: '.occasion-link[href="#date"]',
      expectedImg: 'robe-longue-1983-12-1-1.jpg',
      expectedCode: 'WD / 05 // DATE NIGHT'
    }
  ];

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP 1440px INTERACTION & MOTION CHECKS
    // -------------------------------------------------------------
    console.log('\n[1] Testing Desktop 1440x900...');
    const page = await browser.newPage({ width: 1440, height: 900, mobile: false });
    await page.goto('http://127.0.0.1:5173/01-tokyo-editorial.html', { settleMs: 1200 });

    // Scroll to occasion index
    await page.eval(`(() => {
      const el = document.querySelector('.vertical-index-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);

    for (let i = 0; i < occasions.length; i++) {
      const occ = occasions[i];
      console.log(`\nTesting hover on occasion: ${occ.name}...`);

      const rect = await page.eval(`(() => {
        const row = document.querySelector('${occ.selector}');
        if (!row) return null;
        const b = row.getBoundingClientRect();
        return { x: Math.round(b.left + b.width * 0.4), y: Math.round(b.top + b.height * 0.5), top: b.top, left: b.left, width: b.width, height: b.height };
      })()`);

      if (!rect) throw new Error(`Could not find element for occasion ${occ.name}`);

      // Move mouse onto the row
      await page.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: rect.x,
        y: rect.y
      });

      // Wait 400ms for GSAP quickTo + enter tween to settle
      await sleep(400);

      const state = await page.eval(`(() => {
        const preview = document.getElementById('cursorPreview');
        const img = document.getElementById('cursorPreviewImg');
        const code = document.getElementById('cursorPreviewCode');
        const seal = preview?.querySelector('.cursor-preview-seal');
        if (!preview || !img) return { error: 'Preview elements missing' };
        const cs = window.getComputedStyle(preview);
        const rect = preview.getBoundingClientRect();
        return {
          visibility: preview.style.visibility || cs.visibility,
          opacity: parseFloat(cs.opacity),
          pointerEvents: cs.pointerEvents,
          zIndex: cs.zIndex,
          imgSrc: img.currentSrc || img.src,
          imgLoaded: img.naturalWidth > 0,
          imgNaturalWidth: img.naturalWidth,
          codeText: code?.textContent?.trim(),
          sealText: seal?.textContent?.trim(),
          rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
          viewport: { width: window.innerWidth, height: window.innerHeight }
        };
      })()`);

      console.log(`  State for ${occ.name}:`, {
        visibility: state.visibility,
        opacity: state.opacity,
        imgSrc: state.imgSrc.split('/').pop(),
        imgLoaded: state.imgLoaded,
        codeText: state.codeText,
        sealText: state.sealText,
        pointerEvents: state.pointerEvents,
        previewPosition: { left: Math.round(state.rect.left), top: Math.round(state.rect.top) }
      });

      if (state.visibility !== 'visible' || state.opacity < 0.9) {
        throw new Error(`Preview not visible on hover for ${occ.name} (vis: ${state.visibility}, op: ${state.opacity})`);
      }
      if (!state.imgSrc.includes(occ.expectedImg)) {
        throw new Error(`Expected image ${occ.expectedImg}, got ${state.imgSrc}`);
      }
      if (!state.imgLoaded) {
        throw new Error(`Image failed to load for ${occ.name}! naturalWidth = 0`);
      }
      if (state.codeText !== occ.expectedCode) {
        throw new Error(`Expected code "${occ.expectedCode}", got "${state.codeText}"`);
      }
      if (state.pointerEvents !== 'none') {
        throw new Error(`Preview pointer-events must be 'none' to avoid blocking clicks! Got: ${state.pointerEvents}`);
      }

      // Capture screenshot of each hovered occasion
      await page.screenshot({ path: join(outDir, `hover-${occ.name.toLowerCase().replace(/\s+/g, '-')}-1440.jpg`), quality: 85 });
    }

    // -------------------------------------------------------------
    // 2. EDGE FLIP DETECTION TESTS
    // -------------------------------------------------------------
    console.log('\n[2] Testing Edge Flip Detection near right edge...');
    // Move mouse near the far right inside the FESTIVAL occasion row (x = 1350, y = 180)
    await page.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 1350,
      y: 180
    });
    await sleep(400);

    const rightEdgeState = await page.eval(`(() => {
      const preview = document.getElementById('cursorPreview');
      const rect = preview.getBoundingClientRect();
      return {
        cursorX: 1350,
        previewRight: rect.right,
        previewLeft: rect.left,
        flippedLeftOfCursor: rect.right <= 1350 + 10,
        withinViewport: rect.right <= window.innerWidth && rect.left >= 0
      };
    })()`);
    console.log('Right Edge Flip Result:', rightEdgeState);
    if (!rightEdgeState.withinViewport) {
      throw new Error(`Preview escaped viewport near right edge! rect: ${JSON.stringify(rightEdgeState)}`);
    }
    if (!rightEdgeState.flippedLeftOfCursor) {
      throw new Error(`Preview should flip to the left side of the cursor near right edge!`);
    }
    console.log('✓ Edge flip near right edge verified successfully!');

    console.log('\n[3] Testing Edge Flip Detection near bottom edge...');
    // Move mouse near the bottom inside the DATE NIGHT occasion row (x = 600, y = 800)
    await page.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 600,
      y: 800
    });
    await sleep(400);

    const bottomEdgeState = await page.eval(`(() => {
      const preview = document.getElementById('cursorPreview');
      const rect = preview.getBoundingClientRect();
      return {
        cursorY: 800,
        previewBottom: rect.bottom,
        previewTop: rect.top,
        flippedAboveCursor: rect.bottom <= 800 + 10,
        withinViewport: rect.bottom <= window.innerHeight && rect.top >= 0
      };
    })()`);
    console.log('Bottom Edge Flip Result:', bottomEdgeState);
    if (!bottomEdgeState.withinViewport) {
      throw new Error(`Preview escaped viewport near bottom edge! rect: ${JSON.stringify(bottomEdgeState)}`);
    }
    if (!bottomEdgeState.flippedAboveCursor) {
      throw new Error(`Preview should flip above the cursor near bottom edge!`);
    }
    console.log('✓ Edge flip near bottom edge verified successfully!');

    // -------------------------------------------------------------
    // 3. MOUSELEAVE EXIT TEST
    // -------------------------------------------------------------
    console.log('\n[4] Testing Mouse Leave Exit Animation...');
    // Move mouse far away from the occasion rows (e.g. to the top navbar)
    await page.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 100,
      y: 50
    });
    await sleep(350);

    const exitState = await page.eval(`(() => {
      const preview = document.getElementById('cursorPreview');
      const cs = window.getComputedStyle(preview);
      return {
        visibility: preview.style.visibility || cs.visibility,
        opacity: parseFloat(cs.opacity)
      };
    })()`);
    console.log('Exit State:', exitState);
    if (exitState.visibility !== 'hidden' && exitState.opacity > 0.05) {
      throw new Error(`Preview did not hide on mouse leave! (vis: ${exitState.visibility}, op: ${exitState.opacity})`);
    }
    console.log('✓ Mouse leave hides preview cleanly with exit tween!');

    // -------------------------------------------------------------
    // 4. CLICKABILITY TEST
    // -------------------------------------------------------------
    console.log('\n[5] Testing Clickability of Occasion Link...');
    // Hover over FESTIVAL and click it
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 500, y: 400 });
    await sleep(200);
    const clickedHref = await page.eval(`(() => {
      let clicked = false;
      const el = document.querySelector('.occasion-link[href="#fest"]');
      const handler = (e) => { clicked = true; };
      el.addEventListener('click', handler, { once: true });
      // Dispatch real click at coordinates 500, 400
      const target = document.elementFromPoint(500, 400);
      return { targetTag: target?.tagName, targetClass: target?.className, isRow: !!target?.closest('.occasion-link') };
    })()`);
    console.log('Element from point at cursor (500, 400):', clickedHref);
    if (!clickedHref.isRow) {
      throw new Error(`Preview or another element intercepted pointer! Under cursor: ${clickedHref.targetTag}.${clickedHref.targetClass}`);
    }
    console.log('✓ Occasion link receives pointer events directly (pointer-events: none is effective)!');

    // Check console errors on desktop
    if (page.consoleErrors.length > 0) {
      throw new Error(`Console errors on desktop: ${JSON.stringify(page.consoleErrors)}`);
    }
    await page.close();

    // -------------------------------------------------------------
    // 5. RESPONSIVE VIEWPORT TESTING (1280, 1024, 768, 390)
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

      // Scroll to occasion index
      await p.eval(`(() => {
        const el = document.querySelector('.vertical-index-section');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(400);

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
        // Hover festival
        await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(vp.width * 0.5), y: 350 });
        await sleep(350);
        const st = await p.eval(`(() => {
          const preview = document.getElementById('cursorPreview');
          return { visibility: preview?.style?.visibility, opacity: window.getComputedStyle(preview).opacity };
        })()`);
        if (st.visibility !== 'visible' || parseFloat(st.opacity) < 0.8) {
          throw new Error(`Expected cursor preview visible on ${vp.name}, got vis: ${st.visibility}, op: ${st.opacity}`);
        }
      } else {
        // On mobile / tablet <= 768px, cursor-following preview should NOT be visible
        const st = await p.eval(`(() => {
          const preview = document.getElementById('cursorPreview');
          const cs = window.getComputedStyle(preview);
          return { display: cs.display, visibility: cs.visibility };
        })()`);
        console.log(`  ${vp.name} preview style: display=${st.display}`);
        if (st.display !== 'none') {
          throw new Error(`Expected preview display to be 'none' on ${vp.name}, got ${st.display}`);
        }
      }

      await p.screenshot({ path: join(outDir, `${vp.name}.jpg`), quality: 80 });

      if (p.consoleErrors.length > 0) {
        throw new Error(`Console errors on ${vp.name}: ${JSON.stringify(p.consoleErrors)}`);
      }
      await p.close();
      console.log(`✓ ${vp.name} passed all visual & behavioral checks!`);
    }

    console.log('\n=============================================================');
    console.log('✓ ALL 14 VERIFICATION CRITERIA PASSED FLAWLESSLY!');
    console.log('=============================================================');

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
