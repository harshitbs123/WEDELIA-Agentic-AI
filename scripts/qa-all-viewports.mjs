import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  { name: '00-master-entry-index', url: 'http://localhost:5173/index.html' },
  { name: '01-tokyo-editorial', url: 'http://localhost:5173/01-tokyo-editorial.html' },
  { name: '02-brutalist-fashion-index', url: 'http://localhost:5173/02-brutalist-fashion-index.html' },
  { name: '03-red-black-tokyo', url: 'http://localhost:5173/03-red-black-tokyo.html' },
  { name: '04-vertical-japanese-poster', url: 'http://localhost:5173/04-vertical-japanese-poster.html' },
  { name: '10-the-strange-one', url: 'http://localhost:5173/10-the-strange-one.html' },
];

const viewports = [
  { w: 1440, h: 900, label: '1440x900 (Desktop Large)', mobile: false },
  { w: 1280, h: 800, label: '1280x800 (Desktop Standard)', mobile: false },
  { w: 1024, h: 768, label: '1024x768 (Tablet Landscape)', mobile: false },
  { w: 768, h: 1024, label: '768x1024 (Tablet Portrait)', mobile: true },
  { w: 430, h: 932, label: '430x932 (iPhone Pro Max)', mobile: true },
  { w: 390, h: 844, label: '390x844 (iPhone 14/15/16)', mobile: true },
  { w: 375, h: 812, label: '375x812 (iPhone Mini)', mobile: true },
];

const outDir = join(process.cwd(), '.taste-skill/inspect/qa');
mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Launching headless Chrome for QA inspection across 7 viewports...');
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const results = [];

  for (const pageInfo of pages) {
    console.log(`\n========================================\nTesting: ${pageInfo.name}\n========================================`);
    for (const vp of viewports) {
      const page = await browser.newPage({ width: vp.w, height: vp.h, mobile: vp.mobile });
      try {
        await page.goto(pageInfo.url, { settleMs: 1200 });

        const metrics = await page.eval(() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body ? document.body.scrollWidth : 0;
          const overflow = Math.max(scrollW, bodyScrollW) - docW;

          // Broken images
          const imgs = Array.from(document.querySelectorAll('img'));
          const brokenImgs = imgs.filter(img => img.naturalWidth === 0).map(img => img.src);

          // Overflows
          const overflowingElements = [];
          if (overflow > 1) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > docW + 1) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  cls: el.className,
                  id: el.id,
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
                if (overflowingElements.length >= 3) break;
              }
            }
          }

          return {
            docW,
            scrollW,
            bodyScrollW,
            overflow: Math.max(0, overflow),
            brokenImgs,
            overflowingElements,
            title: document.title,
            sectionsCount: document.querySelectorAll('section, header, footer').length,
          };
        });

        const screenshotPath = join(outDir, `${pageInfo.name}-${vp.w}x${vp.h}.jpg`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const errors = [...page.consoleErrors];
        const status = (metrics.overflow <= 1 && errors.length === 0 && metrics.brokenImgs.length === 0) ? 'PASS' : 'WARN';

        const row = {
          concept: pageInfo.name,
          viewport: `${vp.w}x${vp.h}`,
          status,
          overflow: metrics.overflow,
          brokenImgs: metrics.brokenImgs.length,
          errors: errors.length,
          elements: metrics.overflowingElements,
          screenshot: `${pageInfo.name}-${vp.w}x${vp.h}.jpg`
        };
        results.push(row);
        console.log(`[${status}] ${vp.label}: overflow=${metrics.overflow}px, brokenImgs=${metrics.brokenImgs.length}, errors=${errors.length}`);
        if (metrics.overflow > 1) {
          console.log(`   Overflow culprits:`, JSON.stringify(metrics.overflowingElements));
        }
        if (errors.length > 0) {
          console.log(`   Console errors:`, errors);
        }
      } catch (err) {
        console.error(`Error on ${pageInfo.name} ${vp.w}x${vp.h}:`, err.message);
        results.push({
          concept: pageInfo.name,
          viewport: `${vp.w}x${vp.h}`,
          status: 'FAIL',
          error: err.message
        });
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  // Write summary json
  writeFileSync(join(outDir, 'qa-summary.json'), JSON.stringify(results, null, 2));
  console.log(`\nQA Inspection complete. Summary written to ${join(outDir, 'qa-summary.json')}`);
}

run().catch(console.error);
