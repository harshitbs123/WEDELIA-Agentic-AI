import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/03-tokyo-after-dark');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-1024', width: 1024, height: 768, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true }
];

async function run() {
  console.log('🚀 Launching Chrome with sandbox bypass flags...');
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

    // Scroll through the entire document to trigger lazy images and ScrollTrigger animations
    await page.eval(async () => {
      const step = window.innerHeight;
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 80));
      }
      window.scrollTo(0, total);
      await new Promise(r => setTimeout(r, 200));

      // Wait for all images in the document to complete loading/decoding
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(async img => {
        if (!img.complete) {
          await new Promise(r => { img.onload = img.onerror = r; });
        }
        try {
          if (img.decode) await img.decode();
        } catch (e) {}
      }));
    });
    await new Promise(r => setTimeout(r, 300));

    // 1. Horizontal overflow check
    const overflow = await page.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    console.log(`[${vp.name}] Horizontal overflow: ${overflow}px`);

    // 2. Broken image check
    const imgAudit = await page.eval(`
      Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth: img.offsetWidth,
        displayedHeight: img.offsetHeight
      }))
    `);

    const brokenImgs = imgAudit.filter(i => !i.complete || i.naturalWidth === 0);
    console.log(`[${vp.name}] Total images in DOM: ${imgAudit.length} | Broken: ${brokenImgs.length}`);
    if (brokenImgs.length > 0) {
      console.error(`🚨 BROKEN IMAGES DETECTED:`, brokenImgs);
    }

    // 3. Check presence of selected editorial images in the DOM
    const presentSrcs = imgAudit.map(i => i.src);
    const requiredImages = [
      'red1.webp', 'red2.avif', 'red3.avif', 'red4.avif', 'red4-alt.avif', 'red5.avif',
      'red6.avif', 'red7.avif', 'red8.avif', 'red9.avif', 'red10.avif', 'red11.avif'
    ];

    const missingImages = requiredImages.filter(req => !presentSrcs.some(src => src.includes(req)));
    console.log(`[${vp.name}] Required images verified. Missing count: ${missingImages.length}`);
    if (missingImages.length > 0) {
      console.error(`🚨 MISSING REQUIRED IMAGES:`, missingImages);
    }

    // 4. Check Night Archive Photoshoot specimens count (9 specimens after removing Split-Tone & Wet-Look)
    const dossierCount = await page.eval(`document.querySelectorAll('.night-archive-photoshoot .dossier-frame').length`);
    console.log(`[${vp.name}] Dossier items in Night Archive photoshoot: ${dossierCount} / 9`);

    // Take screenshot of hero
    await page.eval(`window.scrollTo(0, 0)`);
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: join(outDir, `${vp.name}-hero.jpg`), fullPage: false });

    // Scroll to photoshoot and capture
    await page.eval(`document.getElementById('nightArchivePhotoshoot')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: join(outDir, `${vp.name}-night-archive.jpg`), fullPage: false });

    // If desktop-1440, perform deep interactive verification
    if (vp.name === 'desktop-1440') {
      console.log('\n--- Deep Interaction Tests (desktop-1440) ---');

      // Test Hero flyer tabs razor-wipe
      console.log('Testing Hero Flyer Tabs: Switching to 02 VERMILION COAT (red1)...');
      await page.eval(`document.querySelectorAll('.flyer-tab-btn')[1]?.click()`);
      await new Promise(r => setTimeout(r, 700));
      const heroImg1 = await page.eval(`document.getElementById('heroMonumentImg')?.src`);
      console.log(`Hero image after Tab 2 click: ${heroImg1} (expected: red1.webp)`);

      console.log('Switching to 03 FLIGHT BOMBER (red10)...');
      await page.eval(`document.querySelectorAll('.flyer-tab-btn')[2]?.click()`);
      await new Promise(r => setTimeout(r, 700));
      const heroImg2 = await page.eval(`document.getElementById('heroMonumentImg')?.src`);
      console.log(`Hero image after Tab 3 click: ${heroImg2} (expected: red10.avif)`);

      console.log('Switching back to 01 RACING BOMBER (red8)...');
      await page.eval(`document.querySelectorAll('.flyer-tab-btn')[0]?.click()`);
      await new Promise(r => setTimeout(r, 700));
      const heroImg3 = await page.eval(`document.getElementById('heroMonumentImg')?.src`);
      console.log(`Hero image after Tab 1 click: ${heroImg3} (expected: red8.avif)`);

      // Test Comp 3 Campaign Drop Cards
      console.log('\nTesting Comp 3 Campaign Drop Cards...');
      await page.eval(`document.querySelectorAll('.campaign-poster-card')[1]?.click()`);
      await new Promise(r => setTimeout(r, 500));
      const featuredImg = await page.eval(`document.getElementById('featuredDropActiveImg')?.src`);
      const dropBadge = await page.eval(`document.getElementById('nightDropStencilBadge')?.textContent`);
      console.log(`Active drop image: ${featuredImg} | Badge: ${dropBadge} (expected: red11.avif / DROP 02 // FAREWELL)`);

      // Test SLAM NEXT DROP button
      console.log('Testing SLAM NEXT DROP button...');
      await page.eval(`document.getElementById('slamNextDropBtn')?.click()`);
      await new Promise(r => setTimeout(r, 500));
      const nextBadge = await page.eval(`document.getElementById('nightDropStencilBadge')?.textContent`);
      const nextImg = await page.eval(`document.getElementById('featuredDropActiveImg')?.src`);
      console.log(`After slam: Badge: ${nextBadge} | Image: ${nextImg} (expected: DROP 03 // FESTIVAL / red1.webp)`);

      // Test Comp 6.5 Night Drop Terminal triggers
      console.log('\nTesting Comp 6.5 Night Drop Terminal...');
      await page.eval(`document.querySelectorAll('.drop-trigger-btn')[2]?.click()`); // FAREWELL
      await new Promise(r => setTimeout(r, 500));
      const terminalImg = await page.eval(`document.getElementById('nightDropImg')?.src`);
      const terminalLook = await page.eval(`document.getElementById('nightLookTitle')?.textContent`);
      console.log(`Terminal look after FAREWELL click: ${terminalLook} | Image: ${terminalImg}`);
    }

    results.push({
      viewport: vp.name,
      overflow,
      totalImages: imgAudit.length,
      brokenImages: brokenImgs.length,
      missingRequired: missingImages.length,
      dossierCount
    });

    await page.close();
  }

  await browser.close();

  console.log('\n========================================');
  console.log('FINAL VERIFICATION SUMMARY:');
  console.log('========================================');
  console.table(results);

  const anyFailures = results.some(r => r.overflow > 0 || r.brokenImages > 0 || r.missingRequired > 0 || r.dossierCount !== 9);
  if (anyFailures) {
    console.error('❌ VERIFICATION FAILED: Review table above.');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED: All editorial images verified cleanly across all 5 viewports with 0 overflow and 0 broken images.');
  }
}

run().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
