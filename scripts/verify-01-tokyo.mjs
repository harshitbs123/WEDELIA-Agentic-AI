import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/tokyo-verification');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-430', width: 430, height: 932, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-375', width: 375, height: 812, mobile: true }
];

async function run() {
  const browser = await Browser.launch({ width: 1440, height: 900 });

  for (const vp of viewports) {
    console.log(`Checking viewport: ${vp.name}...`);
    const page = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });

    await page.goto('http://localhost:5173/01-tokyo-editorial.html', { settleMs: 1500 });

    // Check overflow and broken images
    const overflow = await page.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    const brokenImgs = await page.eval(`Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length`);

    console.log(`[${vp.name}] Overflow: ${overflow}px | Broken Images: ${brokenImgs}`);

    await page.screenshot({ path: join(outDir, `${vp.name}-hero.jpg`), fullPage: false });

    // Scroll to mid fashion plate
    await page.eval(`document.getElementById('editorialFashionPlateSection')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: join(outDir, `${vp.name}-plate.jpg`), fullPage: false });

    // If desktop, test TURN SPREAD button click
    if (vp.name === 'desktop-1440') {
      console.log('Testing TURN SPREAD button click...');
      await page.eval(`document.getElementById('turnPageBtn')?.click()`);
      await new Promise(r => setTimeout(r, 800));
      const folioText = await page.eval(`document.getElementById('folioCountLabel')?.textContent`);
      console.log(`Folio label after turn: ${folioText}`);
      await page.screenshot({ path: join(outDir, `desktop-1440-after-turn.jpg`), fullPage: false });
    }

    await page.close();
  }

  await browser.close();
  console.log('Tokyo Editorial verification complete!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
