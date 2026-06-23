const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:3001 ...');
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log('Navigation threw:', e);
  }
  
  console.log('Clicking the Sign In link...');
  try {
    await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a')).find(el => el.textContent === 'Sign In');
      if (link) link.click();
      else console.log('Link not found!');
    });
    // Wait for a bit to let client-side navigation happen
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (e) {
    console.log('Clicking threw:', e);
  }
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot-after-click.png' });
  
  await browser.close();
})();
