import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/art-direction-review');
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: '00-index', url: 'http://localhost:5173/index.html' },
  { name: '01-tokyo-editorial', url: 'http://localhost:5173/01-tokyo-editorial.html' },
  { name: '02-brutalist-fashion-index', url: 'http://localhost:5173/02-brutalist-fashion-index.html' },
  { name: '03-red-black-tokyo', url: 'http://localhost:5173/03-red-black-tokyo.html' },
  { name: '04-vertical-japanese-poster', url: 'http://localhost:5173/04-vertical-japanese-poster.html' },
  { name: '10-the-strange-one', url: 'http://localhost:5173/10-the-strange-one.html' },
];

async function capture() {
  const browser = await Browser.launch({ width: 1440, height: 900 });

  for (const item of pages) {
    console.log(`Inspecting ${item.name}...`);
    // 1440x900 Desktop
    const pDesktop = await browser.newPage({ width: 1440, height: 900 });
    await pDesktop.goto(item.url, { settleMs: 1500 });
    await pDesktop.screenshot({ path: join(outDir, `${item.name}-1440-hero.jpg`), fullPage: false });

    // Scroll down to mid / lookbook
    await pDesktop.wheel(1100);
    await new Promise(r => setTimeout(r, 600));
    await pDesktop.screenshot({ path: join(outDir, `${item.name}-1440-lookbook.jpg`), fullPage: false });

    // Scroll down to rental / bottom section
    await pDesktop.wheel(1500);
    await new Promise(r => setTimeout(r, 600));
    await pDesktop.screenshot({ path: join(outDir, `${item.name}-1440-rental.jpg`), fullPage: false });

    await pDesktop.close();

    // 430x932 Mobile Pro Max
    const pMobile = await browser.newPage({ width: 430, height: 932, mobile: true });
    await pMobile.goto(item.url, { settleMs: 1500 });
    await pMobile.screenshot({ path: join(outDir, `${item.name}-430-hero.jpg`), fullPage: false });
    await pMobile.wheel(800);
    await new Promise(r => setTimeout(r, 600));
    await pMobile.screenshot({ path: join(outDir, `${item.name}-430-mid.jpg`), fullPage: false });
    await pMobile.close();
  }

  await browser.close();
  console.log('Capture complete! Check directory:', outDir);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
