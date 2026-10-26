import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/03-verification');
mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/03-red-black-tokyo.html', { settleMs: 1500 });

  // Scroll to Section 2: After Dark 23:47
  await page.eval(`document.getElementById('nightFileSection')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: join(outDir, 'desktop-1440-after-dark.jpg'), fullPage: false });

  // Scroll to Section 3: Midnight Campaign Look Drop stage
  await page.eval(`document.getElementById('featuredNightDropStage')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: join(outDir, 'desktop-1440-drop-stage.jpg'), fullPage: false });

  // Scroll to Section 4: Redline Protocol Manifesto
  await page.eval(`document.getElementById('redlineManifesto')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: join(outDir, 'desktop-1440-manifesto.jpg'), fullPage: false });

  // Scroll to Section 5: Archive Wall
  await page.eval(`document.querySelector('.night-archive-wall')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: join(outDir, 'desktop-1440-archive-wall.jpg'), fullPage: false });

  await page.close();
  await browser.close();
  console.log('Scrolled verification screenshots captured!');
}

run().catch(console.error);
