import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/03-verification');
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
  const browser = await Browser.launch({ width: 1440, height: 900 });

  for (const vp of viewports) {
    console.log(`Checking viewport: ${vp.name}...`);
    const page = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.mobile });

    await page.goto('http://127.0.0.1:5173/03-red-black-tokyo.html', { settleMs: 1500 });

    // Check overflow and broken images
    const overflow = await page.eval(`document.documentElement.scrollWidth - window.innerWidth`);
    const brokenImgs = await page.eval(`Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length`);

    console.log(`[${vp.name}] Overflow: ${overflow}px | Broken Images: ${brokenImgs}`);

    if (overflow > 0) {
      console.error(`ERROR: Horizontal overflow detected in ${vp.name}: ${overflow}px`);
    }

    await page.screenshot({ path: join(outDir, `${vp.name}-hero.jpg`), fullPage: false });

    // If desktop-1440, test interactions
    if (vp.name === 'desktop-1440') {
      console.log('Testing Flyer Swapper [02 DESSÈS CHIFFON]...');
      await page.eval(`document.querySelectorAll('.flyer-tab-btn')[1]?.click()`);
      await new Promise(r => setTimeout(r, 600));

      const plateTag = await page.eval(`document.getElementById('heroPlateTag')?.textContent`);
      const priceTag = await page.eval(`document.getElementById('heroPriceTag')?.textContent`);
      console.log(`After flyer switch: Plate=${plateTag} | Price=${priceTag}`);
      await page.screenshot({ path: join(outDir, 'desktop-1440-flyer-switch.jpg'), fullPage: false });

      console.log('Capturing Full-Viewport Cinematic Campaign Moment...');
      await page.eval(`document.getElementById('cinematicMoment')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: join(outDir, 'desktop-1440-cinematic-moment.jpg'), fullPage: false });

      console.log('Testing Tokyo Night Clock [01:14 UNDERPASS]...');
      await page.eval(`document.querySelectorAll('.night-time-pill')[1]?.click()`);
      await new Promise(r => setTimeout(r, 600));
      const clockTime = await page.eval(`document.getElementById('nightTimeMonument')?.textContent`);
      console.log(`After clock switch: Time=${clockTime}`);

      console.log('Testing SLAM NEXT DROP button...');
      await page.eval(`document.getElementById('slamNextDropBtn')?.click()`);
      await new Promise(r => setTimeout(r, 600));
      const dropBadge = await page.eval(`document.getElementById('nightDropStencilBadge')?.textContent`);
      console.log(`After slam next drop: Badge=${dropBadge}`);

      console.log('Testing SECURE NIGHT-DROP TICKET button...');
      await page.eval(`document.getElementById('secureNightTicketBtn')?.click()`);
      await new Promise(r => setTimeout(r, 600));
      const ticketBtnText = await page.eval(`document.getElementById('secureNightTicketBtn')?.textContent`);
      console.log(`After secure ticket: ButtonText=${ticketBtnText.trim()}`);
      await page.screenshot({ path: join(outDir, 'desktop-1440-ticket-secured.jpg'), fullPage: false });
    }

    await page.close();
  }

  await browser.close();
  console.log('Concept #03 Red / Black Tokyo verification complete!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
