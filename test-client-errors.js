const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    console.log("Navigating to /login ...");
    await page.goto('http://localhost:3003/login', { waitUntil: 'networkidle0' });
    console.log("Navigated to /login");
    
    console.log("Clicking Sign In...");
    await page.click('a[href="/login"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("Navigated to /login");
  } catch(e) {
    console.log("Caught exception in puppeteer:", e);
  }
  
  await browser.close();
})();
