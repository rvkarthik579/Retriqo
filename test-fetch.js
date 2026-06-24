const url1 = 'https://project-qr-xi.vercel.app/retriqo-logo.svg';
const url2 = 'https://project-qr-xi.vercel.app/retriqo-mark.svg';

async function fetchInfo(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log('URL: ' + url);
    console.log('Status: ' + res.status + ' ' + res.statusText);
    console.log('Content-Type: ' + res.headers.get('content-type'));
    console.log('Body (first 100 chars): ' + text.substring(0, 100));
    console.log('---');
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await fetchInfo(url1);
  await fetchInfo(url2);
}

run();
