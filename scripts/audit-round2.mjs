import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/audit-round2');
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: '01-tokyo-editorial', url: 'http://localhost:5173/01-tokyo-editorial.html' },
  { name: '02-brutalist-fashion-index', url: 'http://localhost:5173/02-brutalist-fashion-index.html' },
  { name: '03-red-black-tokyo', url: 'http://localhost:5173/03-red-black-tokyo.html' },
  { name: '04-vertical-japanese-poster', url: 'http://localhost:5173/04-vertical-japanese-poster.html' },
  { name: '10-the-strange-one', url: 'http://localhost:5173/10-the-strange-one.html' },
];

async function run() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  for (const pageInfo of pages) {
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto(pageInfo.url, { settleMs: 1500 });
    await page.screenshot({ path: join(outDir, `${pageInfo.name}-desktop-hero.jpg`), fullPage: false });
    // Scroll half way and screenshot
    await page.wheel(1200);
    await page.screenshot({ path: join(outDir, `${pageInfo.name}-desktop-mid.jpg`), fullPage: false });
    await page.close();

    // Mobile
    const mPage = await browser.newPage({ width: 390, height: 844, mobile: true });
    await mPage.goto(pageInfo.url, { settleMs: 1500 });
    await mPage.screenshot({ path: join(outDir, `${pageInfo.name}-mobile-hero.jpg`), fullPage: false });
    await mPage.close();

    console.log(`Audited: ${pageInfo.name}`);
  }
  await browser.close();
}

run().catch(console.error);
