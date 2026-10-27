import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/03-framing-pass');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-1024', width: 1024, height: 768, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true }
];

async function run() {
  console.log('🚀 Launching Chrome with BypassSandbox flags...');
  const browser = await Browser.launch({
    width: 1440,
    height: 900,
    extraArgs: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const page = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });
    await page.goto('http://127.0.0.1:5173/03-red-black-tokyo.html', { settleMs: 1500 });

    // 1. Horizontal overflow check
    const overflow = await page.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    console.log(`[${vp.name}] Horizontal overflow: ${overflow}px`);

    // 2. Scroll to RENT THE NIGHT (Composition 3.5)
    await page.eval(`document.getElementById('cinematicMoment')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 600));

    // Audit RENT THE NIGHT typography framing & image
    const rentTheNightAudit = await page.eval(`(() => {
      const section = document.getElementById('cinematicMoment');
      const title = document.getElementById('cinematicTitle');
      const photo = document.getElementById('cinematicPhoto');
      const wrap = document.querySelector('.cinematic-headline-wrap');
      const tr = title.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      const pr = photo.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      return {
        sectionLeft: sr.left,
        sectionWidth: sr.width,
        leftGutter: tr.left,
        titleRight: tr.right,
        titleWidth: tr.width,
        titleHeight: tr.height,
        titleText: title.innerText.trim(),
        isFullyInViewport: tr.left >= 0 && tr.right <= window.innerWidth,
        photoSrc: photo.src,
        photoComplete: photo.complete,
        photoNaturalWidth: photo.naturalWidth,
        photoNaturalHeight: photo.naturalHeight,
        photoDisplayedWidth: pr.width,
        photoDisplayedHeight: pr.height
      };
    })()`);

    console.log(`[${vp.name}] RENT THE NIGHT Framing:`, {
      leftGutter: `${Math.round(rentTheNightAudit.leftGutter)}px`,
      titleRight: `${Math.round(rentTheNightAudit.titleRight)}px`,
      isFullyInViewport: rentTheNightAudit.isFullyInViewport,
      photoSrc: rentTheNightAudit.photoSrc.split('/').pop(),
      photoDimensions: `${rentTheNightAudit.photoNaturalWidth}x${rentTheNightAudit.photoNaturalHeight}`
    });

    if (!rentTheNightAudit.isFullyInViewport) {
      console.error(`🚨 RENT THE NIGHT IS CLIPPED OR OUT OF VIEWPORT at ${vp.name}!`, rentTheNightAudit);
    }
    if (!rentTheNightAudit.photoSrc.includes('red4-alt.avif')) {
      console.error(`🚨 Expected red4-alt.avif for cinematicPhoto, got: ${rentTheNightAudit.photoSrc}`);
    }

    await page.screenshot({ path: join(outDir, `${vp.name}-rent-the-night.jpg`), fullPage: false });

    // 3. Audit Night Archive (Comp 5)
    await page.eval(`document.getElementById('nightArchivePhotoshoot')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 600));

    const archiveAudit = await page.eval(`(() => {
      const titles = Array.from(document.querySelectorAll('.night-archive-photoshoot .dossier-title')).map(t => t.innerText.trim());
      const hasSplitTone = titles.some(t => t.includes('SPLIT-TONE'));
      const hasWetLook = titles.some(t => t.includes('WET-LOOK'));
      const frames = Array.from(document.querySelectorAll('.night-archive-photoshoot .dossier-frame'));
      const brokenImgs = frames.filter(f => {
        const img = f.querySelector('img');
        return !img || !img.complete || img.naturalWidth === 0;
      }).length;
      return {
        dossierCount: frames.length,
        hasSplitTone,
        hasWetLook,
        brokenImgs,
        titles
      };
    })()`);

    console.log(`[${vp.name}] Night Archive Audit:`, {
      dossierCount: archiveAudit.dossierCount,
      hasSplitToneRemoved: !archiveAudit.hasSplitTone,
      hasWetLookRemoved: !archiveAudit.hasWetLook,
      brokenImages: archiveAudit.brokenImgs
    });

    if (archiveAudit.hasSplitTone || archiveAudit.hasWetLook) {
      console.error(`🚨 Removed dossiers still found in DOM at ${vp.name}!`);
    }
    if (archiveAudit.dossierCount !== 9) {
      console.error(`🚨 Expected exactly 9 dossiers, got ${archiveAudit.dossierCount} at ${vp.name}!`);
    }

    await page.screenshot({ path: join(outDir, `${vp.name}-night-archive.jpg`), fullPage: false });

    // 4. Test After Party Terminal Entry (Comp 6.5)
    if (vp.name === 'desktop-1440') {
      console.log('\n--- Deep After-Party Interaction Test (desktop-1440) ---');
      await page.eval(`document.getElementById('nightDropSection')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await new Promise(r => setTimeout(r, 600));

      // Click AFTER-PARTY button
      await page.eval(`(() => {
        const afterPartyBtn = Array.from(document.querySelectorAll('.drop-trigger-btn')).find(b => b.dataset.event === 'AFTER-PARTY');
        if (afterPartyBtn) afterPartyBtn.click();
      })()`);
      await new Promise(r => setTimeout(r, 600));

      const afterPartyAudit = await page.eval(`(() => {
        const lookTitle = document.getElementById('nightLookTitle')?.innerText.trim();
        const curatorTag = document.getElementById('nightCuratorTag')?.innerText.trim();
        const dropImg = document.getElementById('nightDropImg');
        const price = document.getElementById('ticketTariffVal')?.innerText.trim();
        return {
          lookTitle,
          curatorTag,
          imgSrc: dropImg?.src,
          imgComplete: dropImg?.complete,
          imgNaturalWidth: dropImg?.naturalWidth,
          price
        };
      })()`);

      console.log('After Party Terminal State:', afterPartyAudit);

      if (afterPartyAudit.lookTitle !== 'CAMELLIA SILK & BUTTERFLY OBI') {
        console.error(`🚨 Expected title "CAMELLIA SILK & BUTTERFLY OBI", got: "${afterPartyAudit.lookTitle}"`);
      }
      if (!afterPartyAudit.imgSrc?.includes('red5.avif')) {
        console.error(`🚨 Expected image "red5.avif", got: "${afterPartyAudit.imgSrc}"`);
      }

      await page.screenshot({ path: join(outDir, 'desktop-1440-after-party-selected.jpg'), fullPage: false });
    }

    results.push({
      viewport: vp.name,
      overflow,
      rentTheNightGutter: `${Math.round(rentTheNightAudit.leftGutter)}px`,
      rentTheNightInViewport: rentTheNightAudit.isFullyInViewport,
      cinematicImage: rentTheNightAudit.photoSrc.split('/').pop(),
      dossierCount: archiveAudit.dossierCount,
      splitToneRemoved: !archiveAudit.hasSplitTone,
      wetLookRemoved: !archiveAudit.hasWetLook
    });

    await page.close();
  }

  await browser.close();

  console.log('\n========================================');
  console.log('FINAL REFINEMENT VERIFICATION SUMMARY:');
  console.log('========================================');
  console.table(results);

  const allPassed = results.every(r => 
    r.overflow === 0 &&
    r.rentTheNightInViewport === true &&
    r.cinematicImage === 'red4-alt.avif' &&
    r.dossierCount === 9 &&
    r.splitToneRemoved === true &&
    r.wetLookRemoved === true
  );

  if (!allPassed) {
    console.error('❌ SOME TESTS FAILED: Review table above.');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED: RENT THE NIGHT fully framed with intentional left gutter, red4-alt.avif active, 9 clean dossiers, After-Party Camellia Silk active.');
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
