const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let drawCount = 0;
  const targetDraws = 100;

  // Intercept console.log to get messages
  page.on('console', msg => {
    if (msg.text().startsWith('PERF_RESULT:')) {
      console.log(msg.text());
      drawCount++;
      if (drawCount >= targetDraws) {
        browser.close();
        process.exit(0);
      }
    }
  });

  await page.goto('http://localhost:8000/index.html');

  // Timeout in case something goes wrong
  setTimeout(async () => {
    console.error('Timed out waiting for logs');
    await browser.close();
    process.exit(1);
  }, 10000);
})();
