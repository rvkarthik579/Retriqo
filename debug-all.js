const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERROR:', msg.text());
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  console.log('Homepage loaded.');
  
  const routes = ['/privacy', '/terms', '/security', '/login', '/register'];
  
  for (const route of routes) {
    console.log(`Navigating to ${route}...`);
    await page.goto(`http://localhost:3001${route}`, { waitUntil: 'networkidle0' });
    console.log(`${route} loaded.`);
  }
  
  await browser.close();
})();
