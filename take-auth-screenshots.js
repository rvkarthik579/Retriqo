const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:3002/login', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: 'C:/Users/rvkar/.gemini/antigravity/brain/e007ae0c-b61b-43ff-bfdf-72fd063796d2/login.png' });
  
  await page.goto('http://localhost:3002/register', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: 'C:/Users/rvkar/.gemini/antigravity/brain/e007ae0c-b61b-43ff-bfdf-72fd063796d2/register.png' });
  
  await browser.close();
})();
