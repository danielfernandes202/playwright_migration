const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('file://' + require('path').resolve('playwright-report/index.html'), { waitUntil: 'networkidle' });
  await page.pdf({
    path: 'playwright-report.pdf',
    format: 'A4',
    printBackground: true
  });
  await browser.close();
})();
