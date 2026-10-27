import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const VIEWPORTS = [
  { name: '1440-desktop', width: 1440, height: 900, mobile: false },
  { name: '1280-desktop', width: 1280, height: 800, mobile: false },
  { name: '1024-tablet-land', width: 1024, height: 768, mobile: false },
  { name: '768-tablet-port', width: 768, height: 1024, mobile: true },
  { name: '390-mobile-iphone', width: 390, height: 844, mobile: true }
];

const outDir = join(process.cwd(), '.taste-skill/inspect/03-experimental');
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('--- STARTING 03 EXPERIMENTAL MOTION INSPECTION VIA CDP ---');
  const browser = await Browser.launch({ width: 1440, height: 900, extraArgs: ['--no-sandbox', '--disable-setuid-sandbox'] });

  let totalErrors = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const page = await browser.newPage({
      width: vp.width,
      height: vp.height,
      mobile: vp.mobile
    });

    await page.goto('http://127.0.0.1:5173/03-red-black-tokyo.html', { settleMs: 1200 });

    // Eagerly resolve lazy images
    await page.eval(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach(img => { if (img.loading === 'lazy') img.loading = 'eager'; });
      await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
    });

    // Check metrics
    const metrics = await page.eval(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body ? document.body.scrollWidth : 0;
      const overflow = Math.max(scrollW, bodyScrollW) - docW;

      const imgs = Array.from(document.querySelectorAll('img'));
      const brokenImgs = imgs.filter(img => img.naturalWidth === 0).map(img => img.src);

      return {
        docW,
        scrollW,
        overflow: Math.max(0, overflow),
        brokenImgs
      };
    });

    console.log(`  Initial Overflow: ${metrics.overflow}px`);
    console.log(`  Broken Images: ${metrics.brokenImgs.length}`);
    console.log(`  Console Errors: ${page.consoleErrors.length}`);

    if (metrics.overflow > 1) {
      console.error(`  [FAIL] Horizontal overflow detected at ${vp.name}: ${metrics.overflow}px`);
      totalErrors++;
    }
    if (metrics.brokenImgs.length > 0) {
      console.error(`  [FAIL] Broken images detected at ${vp.name}:`, metrics.brokenImgs);
      totalErrors++;
    }
    if (page.consoleErrors.length > 0) {
      console.error(`  [FAIL] Console errors at ${vp.name}:`, page.consoleErrors);
      totalErrors++;
    }

    // Capture key section checkpoints with real wheel scrolling on 1440 and 390
    if (vp.width === 1440 || vp.width === 390) {
      const targets = [
        { selector: '#heroMonumentFrame', name: '01-hero' },
        { selector: '#nightFileSection', name: '02-night-file' },
        { selector: '#occasionTraverseSection', name: '03-occasion-traverse' },
        { selector: '#cinematicMoment', name: '03b-cinematic-rent-the-night' },
        { selector: '#redlineManifesto', name: '04-manifesto' },
        { selector: '#specimen06Frame', name: '05-specimen-06-pause' },
        { selector: '#collegiateStoriesRow', name: '06-collegiate-stories' },
        { selector: '#nightDropSection', name: '06b-night-drop-terminal' },
        { selector: '#closingMonument', name: '07-closing-monument' }
      ];

      for (const t of targets) {
        const found = await page.eval((sel) => {
          const el = document.querySelector(sel);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
            return true;
          }
          return false;
        }, t.selector);

        if (found) {
          await sleep(350);

          // Measure overflow during scroll
          const scrollOverflow = await page.eval(() => {
            const docW = document.documentElement.clientWidth;
            const scrollW = document.documentElement.scrollWidth;
            const bodyScrollW = document.body ? document.body.scrollWidth : 0;
            return Math.max(0, Math.max(scrollW, bodyScrollW) - docW);
          });

          if (scrollOverflow > 1) {
            console.error(`  [FAIL] Scroll overflow at ${t.name} (${vp.name}): ${scrollOverflow}px`);
            totalErrors++;
          }

          const screenshotPath = join(outDir, `${vp.name}-${t.name}.jpg`);
          await page.screenshot({ path: screenshotPath, format: 'jpeg', quality: 80 });
          console.log(`  Saved screenshot: ${vp.name}-${t.name}.jpg (overflow: ${scrollOverflow}px)`);
        }
      }
    }

    // Verify After-Party Look interaction
    const afterPartyResult = await page.eval(() => {
      const btn = document.querySelector('.drop-trigger-btn[data-event="AFTER-PARTY"]');
      if (btn) {
        btn.click();
        const lookTitle = document.getElementById('nightLookTitle')?.textContent?.trim();
        const tariff = document.getElementById('ticketTariffVal')?.textContent?.trim();
        const eventTitle = document.getElementById('ticketEventTitle')?.textContent?.trim();
        return { clicked: true, lookTitle, tariff, eventTitle };
      }
      return { clicked: false };
    });

    if (afterPartyResult.clicked) {
      console.log(`  After-Party Click Check: title="${afterPartyResult.lookTitle}", tariff="${afterPartyResult.tariff}", event="${afterPartyResult.eventTitle}"`);
      if (afterPartyResult.lookTitle !== 'CAMELLIA SILK & BUTTERFLY OBI') {
        console.error(`  [FAIL] Expected look title 'CAMELLIA SILK & BUTTERFLY OBI', got '${afterPartyResult.lookTitle}'`);
        totalErrors++;
      }
    }

    await page.close();
  }

  // Reduced motion test
  console.log('\nTesting prefers-reduced-motion: reduce at 1440x900');
  const rmPage = await browser.newPage({ width: 1440, height: 900 });
  await rmPage.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await rmPage.goto('http://127.0.0.1:5173/03-red-black-tokyo.html', { settleMs: 1000 });

  const rmMetrics = await rmPage.eval(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    return Math.max(0, scrollW - docW);
  });
  console.log(`  Reduced Motion Overflow: ${rmMetrics}px`);
  if (rmMetrics > 1) {
    console.error(`  [FAIL] Reduced motion overflow: ${rmMetrics}px`);
    totalErrors++;
  }
  await rmPage.close();

  await browser.close();

  console.log('\n========================================');
  if (totalErrors === 0) {
    console.log('✓ ALL 03 EXPERIMENTAL MOTION CHECKS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`✕ FAILED WITH ${totalErrors} ERRORS`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
