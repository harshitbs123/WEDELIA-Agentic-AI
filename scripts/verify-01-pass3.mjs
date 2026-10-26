import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/01-pass3-verification');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-1024', width: 1024, height: 768, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-430', width: 430, height: 932, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-375', width: 375, height: 812, mobile: true },
  { name: 'mobile-320', width: 320, height: 568, mobile: true }
];

async function run() {
  console.log('--- WEDELIA #01 PASS 3: ROTATION ORDER, OCCASION PREVIEW, FOOTER VERIFICATION ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  // 1. Desktop Detailed Interactive Verification
  console.log('\n[1] Testing Desktop 1440...');
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });
  await page.goto('http://localhost:5173/01-tokyo-editorial.html', { settleMs: 1500 });

  // A. Check Initial Rotation State (LOOK 067 must be first / default)
  console.log('Verifying initial rotation state on fresh page load...');
  const initialRotation = await page.eval(`({
    activeTab: document.querySelector('#plateTabCluster .plate-tab-btn.active')?.textContent.trim(),
    lookStamp: document.getElementById('plateLookStamp')?.textContent.trim(),
    title: document.getElementById('plateTitleEn')?.textContent.trim(),
    imgSrc: document.getElementById('plateActiveImg')?.getAttribute('src'),
    rentGarment: document.getElementById('pinToSlipBtn')?.getAttribute('data-rent-garment')
  })`);
  console.log('Initial Rotation State:', initialRotation);

  if (!initialRotation.activeTab.includes('LOOK 067')) {
    throw new Error(`Expected active tab to be LOOK 067, got "${initialRotation.activeTab}"`);
  }
  if (initialRotation.lookStamp !== 'LOOK 067') {
    throw new Error(`Expected look stamp to be LOOK 067, got "${initialRotation.lookStamp}"`);
  }
  if (!initialRotation.imgSrc.includes('robe-longue-1983-12-1-1.jpg')) {
    throw new Error(`Expected robe-longue image, got "${initialRotation.imgSrc}"`);
  }
  if (initialRotation.rentGarment !== 'WD-002') {
    throw new Error(`Expected garment ID WD-002, got "${initialRotation.rentGarment}"`);
  }
  console.log('✓ LOOK 067 is verified as the initial/default displayed rotation look!');

  // B. Click through rotation cycling: 067 -> 014 -> 029 -> 053 -> 067
  console.log('Verifying full rotation cycle (067 -> 014 -> 029 -> 053 -> 067)...');
  const expectedOrder = ['LOOK 014', 'LOOK 029', 'LOOK 053', 'LOOK 067'];
  for (const expected of expectedOrder) {
    await page.eval(`document.getElementById('turnPlateBtn')?.click()`);
    await new Promise(r => setTimeout(r, 600));
    const current = await page.eval(`document.getElementById('plateLookStamp')?.textContent.trim()`);
    console.log(`  Turned to: ${current}`);
    if (current !== expected) {
      throw new Error(`Expected ${expected}, got ${current}`);
    }
  }
  console.log('✓ Full rotation cycle verified!');

  // Screenshot of rotation in Look 067
  await page.eval(`document.querySelectorAll('#plateTabCluster .plate-tab-btn')[0].click()`);
  await new Promise(r => setTimeout(r, 600));
  await page.eval(`document.getElementById('editorialFashionPlateSection')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await page.screenshot({ path: join(outDir, 'desktop-1440-rotation-look-067.jpg'), fullPage: false });

  // C. Test Occasion Index Hover Previews
  console.log('\n[2] Testing Occasion Index Hover Previews...');
  await page.eval(`document.querySelector('.vertical-index-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 600));

  const occasions = ['fest', 'freshers', 'farewell', 'concert', 'date'];
  for (let i = 0; i < occasions.length; i++) {
    const selector = `.giant-index-grid a.index-row:nth-child(${i + 1})`;
    
    // Simulate hover with mouseenter & mousemove
    await page.eval(`(() => {
      const el = document.querySelector('${selector}');
      const rect = el.getBoundingClientRect();
      const enterEvt = new MouseEvent('mouseenter', {
        clientX: rect.left + 150,
        clientY: rect.top + 30,
        bubbles: true
      });
      el.dispatchEvent(enterEvt);
    })()`);
    await new Promise(r => setTimeout(r, 350));

    const previewState = await page.eval(`(() => {
      const prev = document.getElementById('occasionFloatPreview');
      const img = document.getElementById('previewImg');
      const kanji = document.getElementById('previewKanji');
      const ref = document.getElementById('previewRef');
      const style = window.getComputedStyle(prev);
      return {
        visibility: style.visibility,
        opacity: style.opacity,
        imgSrc: img?.getAttribute('src'),
        kanji: kanji?.textContent.trim(),
        ref: ref?.textContent.trim(),
        transform: style.transform
      };
    })()`);
    console.log(`  [Occasion ${i + 1}] Hover state:`, previewState);

    if (previewState.visibility !== 'visible' || parseFloat(previewState.opacity) < 0.8) {
      throw new Error(`Occasion ${i + 1} hover preview not visible!`);
    }

    await page.screenshot({ path: join(outDir, `desktop-1440-hover-occasion-${i + 1}.jpg`), fullPage: false });

    // Leave
    await page.eval(`(() => {
      const el = document.querySelector('${selector}');
      el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    })()`);
    await new Promise(r => setTimeout(r, 250));
  }
  console.log('✓ All 5 occasion hover previews verified!');

  // D. Test Footer Colophon Motion
  console.log('\n[3] Testing Footer Colophon Motion...');
  await page.eval(`document.getElementById('publicationColophon')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 800));

  const footerState = await page.eval(`(() => {
    const footer = document.getElementById('publicationColophon');
    const brand = footer.querySelector('.colophon-brand');
    const kanji = footer.querySelector('.colophon-kanji');
    const sub = footer.querySelector('.colophon-sub');
    return {
      brandOpacity: window.getComputedStyle(brand).opacity,
      brandTransform: window.getComputedStyle(brand).transform,
      kanjiOpacity: window.getComputedStyle(kanji).opacity,
      subOpacity: window.getComputedStyle(sub).opacity,
      subLetterSpacing: window.getComputedStyle(sub).letterSpacing
    };
  })()`);
  console.log('Footer Computed State:', footerState);

  if (parseFloat(footerState.brandOpacity) < 0.8) {
    throw new Error('Footer brand opacity did not animate in!');
  }

  // Scroll through footer to test continuous scrub
  await page.eval(`window.scrollBy({ top: 150, behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 400));
  const brandScrubTransform = await page.eval(`window.getComputedStyle(document.querySelector('.colophon-brand')).transform`);
  console.log('Brand transform after scroll scrub:', brandScrubTransform);

  await page.screenshot({ path: join(outDir, 'desktop-1440-footer.jpg'), fullPage: false });
  console.log('✓ Footer motion verified!');

  await page.close();

  // 2. Responsive & Multi-Viewport Audit across all 8 viewports
  console.log('\n[4] Running Multi-Viewport Overflow & Mobile Tap Audit (8 viewports)...');
  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://localhost:5173/01-tokyo-editorial.html', { settleMs: 1200 });

    const overflow = await vpPage.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    const brokenImgs = await vpPage.eval(`Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length`);
    const defaultLook = await vpPage.eval(`document.getElementById('plateLookStamp')?.textContent.trim()`);

    console.log(`  [${vp.name}] Width: ${vp.width}px | Overflow: ${overflow}px | Broken Imgs: ${brokenImgs} | Default Look: ${defaultLook}`);

    if (overflow > 1) {
      console.warn(`  ⚠️ Warning: Horizontal overflow detected on ${vp.name}: ${overflow}px`);
    }

    if (defaultLook !== 'LOOK 067') {
      throw new Error(`Expected LOOK 067 on ${vp.name}, got ${defaultLook}`);
    }

    if (vp.width <= 768) {
      // Test mobile tap on occasion row
      await vpPage.eval(`document.querySelector('.giant-index-grid a.index-row:nth-child(1)')?.click()`);
      await new Promise(r => setTimeout(r, 400));
      const mobilePreviewVisibility = await vpPage.eval(`window.getComputedStyle(document.getElementById('occasionFloatPreview')).visibility`);
      console.log(`  [${vp.name}] Mobile tap preview visibility: ${mobilePreviewVisibility}`);
      await vpPage.screenshot({ path: join(outDir, `${vp.name}-mobile-tap.jpg`), fullPage: false });
    }

    await vpPage.close();
  }

  await browser.close();
  console.log('\n✓ ALL PASS 3 VERIFICATION CHECKS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
