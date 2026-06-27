const { chromium } = require('@playwright/test');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for dashboard...');
  await page.waitForURL('**/dashboard');

  console.log('Navigating to new project...');
  await page.goto('http://localhost:3000/dashboard/new-project');
  
  await page.fill('input[name="machineName"]', 'Test Machine ' + Date.now());
  await page.click('button[type="submit"]');
  
  console.log('Waiting for project page...');
  await page.waitForURL('**/dashboard/projects/*');
  const projectUrl = page.url();
  console.log('Project URL:', projectUrl);
  
  console.log('Navigating to upload page...');
  await page.goto(projectUrl + '/upload');
  
  console.log('Uploading file...');
  // create dummy pdf
  const fs = require('fs');
  fs.writeFileSync('dummy.pdf', 'dummy pdf content');
  await page.setInputFiles('input[type="file"]', 'dummy.pdf');
  
  await page.click('button:has-text("Upload")');
  await page.waitForTimeout(2000);
  
  console.log('Generating QR...');
  await page.click('button:has-text("Generate QR")');
  
  await page.waitForTimeout(3000);
  
  const scanLink = await page.getAttribute('a:has-text("Copy Link")', 'href');
  // the scan link is actually not an href if it's a button, let's find the input with the URL
  // wait, the app might show a Preview button or we can extract the qrUniqueId
  console.log('Finding scan URL...');
  
  await browser.close();
})();
