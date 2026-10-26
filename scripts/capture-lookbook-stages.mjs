import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/lookbook-stages');
mkdirSync(outDir, { recursive: true });

const targets = [
  { file: '01-tokyo-editorial.html', selector: '#editorialFashionPlateSection', name: '01-fashion-plate' },
  { file: '02-brutalist-fashion-index.html', selector: '#masterSpecimenInspector', name: '02-specimen-inspector' },
  { file: '03-red-black-tokyo.html', selector: '#featuredNightDropStage', name: '03-midnight-drop' },
  { file: '04-vertical-japanese-poster.html', selector: '#lookExhibitStage', name: '04-hanging-scroll' },
  { file: '10-the-strange-one.html', selector: '#spatialLookObjectsSection', name: '10-spatial-monolith' },
];

async function run() {
  const browser = await Browser.launch({ width: 1440, height: 900 });

  for (const t of targets) {
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto(`http://localhost:5173/${t.file}`, { settleMs: 1500 });
    await page.eval(`document.querySelector("${t.selector}")?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: join(outDir, `${t.name}-desktop.jpg`), fullPage: false });
    await page.close();

    // Mobile
    const mPage = await browser.newPage({ width: 390, height: 844, mobile: true });
    await mPage.goto(`http://localhost:5173/${t.file}`, { settleMs: 1500 });
    await mPage.eval(`document.querySelector("${t.selector}")?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 800));
    await mPage.screenshot({ path: join(outDir, `${t.name}-mobile.jpg`), fullPage: false });
    await mPage.close();

    console.log(`Captured: ${t.name}`);
  }

  await browser.close();
}

run().catch(console.error);
