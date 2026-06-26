const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wlcdsetmsombnzaqiofw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_hW6kMOms28Yf1Pqt5fzCXQ_ofCQv1YO'
);

async function run() {
  // Fetch latest QR code
  const { data: qr, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("DB Error:", error);
    return;
  }

  console.log("Stored ID:", qr.qr_unique_id);

  // Simulate generation (mocked to show how it's done)
  console.log("Generated ID (example pattern): QR-XXXX...");

  // Send to local test API (mocked request to the same logic)
  const response = await fetch(`https://project-qr-xi.vercel.app/api/qr/scan/${qr.qr_unique_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  
  const text = await response.text();
  console.log("API Received ID from URL path param:", qr.qr_unique_id);
  console.log("API Response:", response.status, text);
}
run();
