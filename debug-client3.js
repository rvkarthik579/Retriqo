const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('CONSOLE [', msg.type(), ']:', msg.text());
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  
  console.log('Clicking the Sign In link...');
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(el => el.textContent === 'Sign In');
    if (link) link.click();
  });
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  await browser.close();
})();
