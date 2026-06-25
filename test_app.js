const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let errors = [];
  page.on('pageerror', error => {
    console.error('PAGE_ERROR:', error);
    errors.push(error);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE_ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  await page.goto('http://localhost:8000/index.html');

  // Wait a little bit for scripts to run
  await page.waitForTimeout(2000);

  await browser.close();

  if (errors.length > 0) {
    console.error('Errors found during execution.');
    process.exit(1);
  } else {
    console.log('Test successful: No errors.');
    process.exit(0);
  }
})();
