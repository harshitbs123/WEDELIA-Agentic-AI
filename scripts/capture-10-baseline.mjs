import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/10-baseline');
mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Capturing baseline screenshots for Concept #10...');
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900, mobile: false });

  await page.goto('http://127.0.0.1:5173/10-the-strange-one.html', { settleMs: 1600 });

  // 1. Hero
  await page.screenshot({ path: join(outDir, '10-base-hero.jpg'), fullPage: false });

  // 2. Section 2: Asymmetric stage
  await page.eval(`document.querySelector('.spatial-stage-grid')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-stage.jpg'), fullPage: false });

  // 3. Section 3: Scattered occasion
  await page.eval(`document.querySelector('.scattered-occasion-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-occasions.jpg'), fullPage: false });

  // 4. Section 4: Look objects
  await page.eval(`document.querySelector('.look-installation-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-look-objects.jpg'), fullPage: false });

  // 5. Section 5: Blueprint
  await page.eval(`document.querySelector('.blueprint-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-blueprint.jpg'), fullPage: false });

  // 6. Section 6: Chamber
  await page.eval(`document.querySelector('.spatial-chamber-section')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-chamber.jpg'), fullPage: false });

  // 7. Colophon exit
  await page.eval(`document.querySelector('.spatial-colophon-exit')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
  await sleep(400);
  await page.screenshot({ path: join(outDir, '10-base-exit.jpg'), fullPage: false });

  await page.close();
  await browser.close();
  console.log('Baseline captures complete.');
}

run().catch(console.error);
