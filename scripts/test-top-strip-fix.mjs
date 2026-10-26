import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), '.taste-skill/inspect/top-strip-fixed');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 1440, height: 900, name: '1440' },
  { width: 1280, height: 800, name: '1280' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 430, height: 932, name: '430' },
  { width: 390, height: 844, name: '390' },
  { width: 375, height: 812, name: '375' },
  { width: 320, height: 568, name: '320' }
];

async function run() {
  console.log('====================================================');
  console.log('TOP NAVIGATION STRIP RESPONSIVE QA (ALL 8 VIEWPORTS)');
  console.log('====================================================\n');

  const browser = await Browser.launch({ width: 1440, height: 900 });
  let overallPass = true;

  for (const pageName of ['03-red-black-tokyo.html', '04-vertical-japanese-poster.html', '10-the-strange-one.html']) {
    const prefix = pageName.startsWith('03') ? '03-chase' : (pageName.startsWith('04') ? '04-contemplate' : '10-navigate');
    console.log(`--- Testing ${pageName} ---`);

    for (const vp of viewports) {
      const page = await browser.newPage({ width: vp.width, height: vp.height, mobile: vp.width <= 768 });
      await page.goto(`http://127.0.0.1:5173/${pageName}`, { settleMs: 500 });

      const inspectResult = await page.eval(() => {
        const nav = document.querySelector('.switch-nav');
        if (!nav) return { error: 'nav not found' };

        const navRect = nav.getBoundingClientRect();
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bodyScrollW = document.body ? document.body.scrollWidth : 0;
        const overflowPx = Math.max(0, Math.max(scrollW, bodyScrollW) - docW);

        // Get all visible interactive links and text labels in nav
        const items = Array.from(nav.querySelectorAll('a, span:not(.live-drop-dot):not(.spatial-node-dot):not(.vermilion-dot)'))
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
          })
          .map(el => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              text: el.textContent.trim(),
              href: el.getAttribute('href') || null,
              left: Math.round(r.left),
              right: Math.round(r.right),
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              width: Math.round(r.width),
              height: Math.round(r.height),
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth
            };
          });

        // Check if any text overflows its element boundary
        const textOverflows = items.filter(i => i.scrollWidth > i.clientWidth + 2).map(i => ({
          text: i.text,
          width: i.clientWidth,
          needed: i.scrollWidth
        }));

        // Check for collisions between siblings on the same horizontal row
        const collisions = [];
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i];
            const b = items[j];
            // If they are on the same vertical band (row)
            const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (verticalOverlap > 6) { // More than 6px vertical overlap means same row
              // Check horizontal overlap
              const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
              if (horizontalOverlap > 1) { // 1px threshold
                collisions.push({ a: a.text, b: b.text, overlapPx: horizontalOverlap });
              }
            }
          }
        }

        return {
          navHeight: Math.round(navRect.height),
          overflowPx,
          itemCount: items.length,
          textOverflows,
          collisions
        };
      });

      const pass = inspectResult.overflowPx === 0 &&
                   inspectResult.collisions.length === 0 &&
                   inspectResult.textOverflows.length === 0 &&
                   page.consoleErrors.length === 0;

      if (!pass) overallPass = false;

      console.log(`  [${vp.name.padStart(4)}px] Nav H: ${inspectResult.navHeight}px | Items: ${inspectResult.itemCount} | Collisions: ${inspectResult.collisions.length} | Overflow: ${inspectResult.overflowPx}px -> ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
      if (!pass) {
        if (inspectResult.collisions.length > 0) console.log('    Collisions:', JSON.stringify(inspectResult.collisions));
        if (inspectResult.textOverflows.length > 0) console.log('    Text Overflows:', JSON.stringify(inspectResult.textOverflows));
        if (page.consoleErrors.length > 0) console.log('    Errors:', page.consoleErrors);
      }

      // Screenshot the top strip
      await page.screenshot({
        path: join(outDir, `${prefix}-${vp.name}.jpg`),
        clip: { x: 0, y: 0, width: vp.width, height: inspectResult.navHeight + 20, scale: 1 }
      });

      await page.close();
    }
    console.log('');
  }

  await browser.close();

  console.log('====================================================');
  console.log(`OVERALL TOP STRIP QA: ${overallPass ? 'ALL 16 CHECKS PASSED (16/16) ✓' : 'FAILED ✗'}`);
  console.log('====================================================');

  if (!overallPass) process.exit(1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
