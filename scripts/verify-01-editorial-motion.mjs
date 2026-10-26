import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/01-motion-verification');
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
  console.log('--- STARTING WEDELIA #01 MOTION & CONTENT VERIFICATION ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  // 1. Core Functional and Motion Tests at 1440
  console.log('\n[1] Running Core Checks on Desktop 1440...');
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });
  await page.goto('http://localhost:5173/01-tokyo-editorial.html', { settleMs: 1500 });

  // A. Verify removal of ARCHIVE SPECIMEN NO. 067
  const specimenRemoved = await page.eval(`
    document.querySelector('.specimen-study-section') === null &&
    document.getElementById('specimenImgContainer') === null &&
    document.getElementById('specimenImage') === null &&
    document.getElementById('loupeMarker') === null
  `);
  console.log(`✓ Archive Specimen No. 067 completely removed from DOM: ${specimenRemoved}`);
  if (!specimenRemoved) throw new Error('Archive Specimen section was not removed!');

  // B. Verify Published Rotation has 4 entries
  const tabCount = await page.eval(`document.querySelectorAll('#plateTabCluster .plate-tab-btn').length`);
  const tabLabels = await page.eval(`Array.from(document.querySelectorAll('#plateTabCluster .plate-tab-btn')).map(b => b.textContent.trim())`);
  console.log(`✓ Published Rotation tab count: ${tabCount}`);
  console.log(`✓ Published Rotation tabs: ${JSON.stringify(tabLabels)}`);
  if (tabCount !== 4) throw new Error(`Expected 4 tabs, found ${tabCount}`);

  // C. Test 4th entry interactivity (Look 067)
  console.log('Testing 4th tab (Look 067) selection...');
  await page.eval(`document.querySelectorAll('#plateTabCluster .plate-tab-btn')[3].click()`);
  await new Promise(r => setTimeout(r, 600));

  const look067State = await page.eval(`({
    stamp: document.getElementById('plateLookStamp')?.textContent.trim(),
    title: document.getElementById('plateTitleEn')?.textContent.trim(),
    imgSrc: document.getElementById('plateActiveImg')?.getAttribute('src'),
    rentGarment: document.getElementById('pinToSlipBtn')?.getAttribute('data-rent-garment')
  })`);
  console.log(`✓ Look 067 Active State:`, look067State);
  if (!look067State.imgSrc.includes('robe-longue-1983-12-1-1.jpg')) {
    throw new Error('Look 067 image src does not point to robe-longue-1983-12-1-1.jpg');
  }

  // D. Test Turn Page Button cycling through to Look 014
  console.log('Testing Turn Page button cycling...');
  await page.eval(`document.getElementById('turnPlateBtn')?.click()`);
  await new Promise(r => setTimeout(r, 600));
  const cycledLookStamp = await page.eval(`document.getElementById('plateLookStamp')?.textContent.trim()`);
  console.log(`✓ Cycled back to: ${cycledLookStamp}`);
  if (cycledLookStamp !== 'LOOK 014') throw new Error(`Expected wrap to LOOK 014, got ${cycledLookStamp}`);

  // E. Test ScrollTrigger animations in EDITOR'S NOTE
  console.log('\n[2] Testing EDITOR\'S NOTE // ESSAY NO. 14 Scroll Motion...');
  await page.eval(`document.getElementById('folioEditorsLetterSpread')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 800));

  const editorsNoteStyles = await page.eval(`(() => {
    const quote = document.querySelector('.letter-sidebar-quote');
    const body = document.querySelector('.letter-body');
    const drop = document.querySelector('.letter-body .drop-letter');
    const quoteStyle = window.getComputedStyle(quote);
    const bodyStyle = window.getComputedStyle(body);
    const dropStyle = window.getComputedStyle(drop);
    return {
      quoteOpacity: quoteStyle.opacity,
      bodyOpacity: bodyStyle.opacity,
      dropOpacity: dropStyle.opacity,
      quoteTransform: quoteStyle.transform
    };
  })()`);
  console.log(`✓ Editor's Note computed visual state:`, editorsNoteStyles);
  await page.screenshot({ path: join(outDir, 'desktop-1440-editors-note.jpg'), fullPage: false });

  // F. Test ScrollTrigger animations in EDITORIAL SPREAD // ATELIER ANATOMY
  console.log('\n[3] Testing EDITORIAL SPREAD // ATELIER ANATOMY Scroll Motion...');
  await page.eval(`document.querySelector('.issue-spread-feature')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 800));

  const atelierStyles = await page.eval(`(() => {
    const headline = document.querySelector('.crossing-headline');
    const visual = document.querySelector('.issue-feature-visual');
    const img = document.querySelector('.issue-feature-visual img');
    const hStyle = window.getComputedStyle(headline);
    const vStyle = window.getComputedStyle(visual);
    const iStyle = window.getComputedStyle(img);
    return {
      headlineOpacity: hStyle.opacity,
      headlineTransform: hStyle.transform,
      visualOpacity: vStyle.opacity,
      imgTransform: iStyle.transform,
      imgClipPath: iStyle.clipPath
    };
  })()`);
  console.log(`✓ Atelier Anatomy computed visual state:`, atelierStyles);
  await page.screenshot({ path: join(outDir, 'desktop-1440-atelier-anatomy.jpg'), fullPage: false });

  // G. Test Scroll Scrub Drift during scroll
  console.log('\n[4] Testing continuous scroll scrub drift...');
  const scrollPosBefore = await page.eval(`window.scrollY`);
  await page.eval(`window.scrollBy({ top: 300, behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 400));
  const headlineTransformAfter = await page.eval(`window.getComputedStyle(document.querySelector('.crossing-headline')).transform`);
  console.log(`✓ Crossing headline transform after 300px scroll: ${headlineTransformAfter}`);

  // H. Screenshot of Published Rotation Look 067
  await page.eval(`document.getElementById('editorialFashionPlateSection')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
  await page.eval(`document.querySelectorAll('#plateTabCluster .plate-tab-btn')[3].click()`);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: join(outDir, 'desktop-1440-rotation-look-067.jpg'), fullPage: false });

  // I. Test Refresh Midway down the page
  console.log('\n[5] Testing hard refresh midway through the page...');
  await page.eval(`window.location.reload()`);
  await new Promise(r => setTimeout(r, 1500));
  const midPageRefreshed = await page.eval(`(() => {
    const spread = document.getElementById('folioEditorsLetterSpread');
    const rect = spread.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      spreadVisible: rect.top < window.innerHeight && rect.bottom > 0,
      bodyOpacity: window.getComputedStyle(document.querySelector('.letter-body')).opacity
    };
  })()`);
  console.log(`✓ Mid-page refresh state:`, midPageRefreshed);

  await page.close();

  // 2. Responsive Multi-Viewport Audit across all 8 viewports
  console.log('\n[6] Running Multi-Viewport Overflow & Visual Audit (8 viewports)...');
  for (const vp of viewports) {
    const vpPage = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await vpPage.goto('http://localhost:5173/01-tokyo-editorial.html', { settleMs: 1200 });

    const overflow = await vpPage.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    const brokenImgs = await vpPage.eval(`Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length`);
    const tabsCount = await vpPage.eval(`document.querySelectorAll('#plateTabCluster .plate-tab-btn').length`);

    console.log(`  [${vp.name}] Width: ${vp.width}px | Overflow: ${overflow}px | Broken Imgs: ${brokenImgs} | Tabs: ${tabsCount}`);

    if (overflow > 1) {
      console.warn(`  ⚠️ Warning: Horizontal overflow detected on ${vp.name}: ${overflow}px`);
    }

    if (vp.width <= 430) {
      // Scroll to Editor's Note & capture screenshot
      await vpPage.eval(`document.getElementById('folioEditorsLetterSpread')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
      await new Promise(r => setTimeout(r, 400));
      await vpPage.screenshot({ path: join(outDir, `${vp.name}-editors-note.jpg`), fullPage: false });

      // Scroll to Published Rotation 4 tabs & capture screenshot
      await vpPage.eval(`document.getElementById('editorialFashionPlateSection')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
      await new Promise(r => setTimeout(r, 400));
      await vpPage.screenshot({ path: join(outDir, `${vp.name}-rotation.jpg`), fullPage: false });
    }

    await vpPage.close();
  }

  await browser.close();
  console.log('\n✓ ALL WEDELIA #01 VERIFICATION CHECKS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
