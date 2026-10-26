import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/04-baseline');
mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/04-vertical-japanese-poster.html', { settleMs: 1500 });

  // 1. Desktop hero
  await page.screenshot({ path: join(outDir, '04-baseline-desktop-hero.jpg'), fullPage: false });

  // 2. Poster 002 (Occasions)
  await page.eval(`document.querySelector('.occasion-poster-grid')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: join(outDir, '04-baseline-desktop-occasions.jpg'), fullPage: false });

  // 3. Poster 003 (Look Exhibition)
  await page.eval(`document.querySelector('.look-exhibit-layout')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: join(outDir, '04-baseline-desktop-look-exhibit.jpg'), fullPage: false });

  // 4. Poster 005 (Loan Certificate)
  await page.eval(`document.querySelector('.lease-scroll-layout')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: join(outDir, '04-baseline-desktop-loan.jpg'), fullPage: false });

  // 5. Mobile 390
  await page.close();
  const mobilePage = await browser.newPage({ width: 390, height: 844, mobile: true });
  await mobilePage.goto('http://127.0.0.1:5173/04-vertical-japanese-poster.html', { settleMs: 1500 });
  await mobilePage.screenshot({ path: join(outDir, '04-baseline-mobile-hero.jpg'), fullPage: false });
  await mobilePage.close();

  await browser.close();
  console.log('Concept #04 baseline screenshots captured!');
}

run().catch(console.error);
