// Dev utility: full-page screenshots of key routes in light/dark at several widths.
// Usage: node scripts/screenshots.mjs <outDir> [baseUrl] [routes...]
import { chromium } from '@playwright/test';

const [outDir, base = 'http://localhost:3000', ...routesArg] = process.argv.slice(2);
const routes = routesArg.length ? routesArg : ['/'];
const widths = (process.env.WIDTHS ?? '1440,390').split(',').map(Number);
const themes = (process.env.THEMES ?? 'light').split(',');
const full = process.env.FULL !== '0';

const browser = await chromium.launch();
for (const theme of themes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width < 600 ? 844 : 900 },
      deviceScaleFactor: 1,
      colorScheme: theme === 'dark' ? 'dark' : 'light',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const name = `${route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/?=&]/g, '_')}-${width}-${theme}.png`;
      await page.screenshot({ path: `${outDir}/${name}`, fullPage: full });
      console.log('saved', name);
    }
    await context.close();
  }
}
await browser.close();
