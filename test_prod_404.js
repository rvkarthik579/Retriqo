async function run() {
  const response = await fetch(`https://project-e91rpll6s-rvkarthik579-8417s-projects.vercel.app/api/qr/scan/FAKE-123`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Body:", text);
}
run();
