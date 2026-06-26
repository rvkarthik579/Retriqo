const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  'https://wlcdsetmsombnzaqiofw.supabase.co',
  'sb_publishable_hW6kMOms28Yf1Pqt5fzCXQ_ofCQv1YO'
);

function generateQRId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return `QR-${id}`;
}

async function run() {
  console.log("1. Generating ID...");
  const generatedId = generateQRId();
  console.log("Generated ID:", generatedId);

  console.log("2. Signing up test user...");
  const email = `test-${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123'
  });
  
  if (authError) {
    console.log("Auth Error:", authError);
    return;
  }
  
  const userId = authData.user.id;

  console.log("3. Inserting Project...");
  const { data: proj, error: projErr } = await supabase.from('projects').insert({
    user_id: userId,
    machine_name: 'Test Machine',
    location: 'Test Location'
  }).select().single();
  
  if (projErr) return console.log("Proj Err:", projErr);

  console.log("4. Inserting Report...");
  const { data: rep, error: repErr } = await supabase.from('reports').insert({
    project_id: proj.id,
    status: 'pass',
    remarks: 'none'
  }).select().single();

  if (repErr) return console.log("Rep Err:", repErr);

  console.log("5. Inserting File...");
  const { data: file, error: fileErr } = await supabase.from('files').insert({
    project_id: proj.id,
    file_name: 'test.pdf',
    file_size: 1000,
    file_type: 'application/pdf',
    file_path: 'test/test.pdf'
  }).select().single();

  if (fileErr) return console.log("File Err:", fileErr);

  console.log("6. Inserting QR Code...");
  const { data: qr, error: qrErr } = await supabase.from('qr_codes').insert({
    file_id: file.id,
    report_id: rep.id,
    user_id: userId,
    qr_unique_id: generatedId,
    is_active: true
  }).select().single();

  if (qrErr) return console.log("QR Err:", qrErr);

  console.log("Stored ID:", qr.qr_unique_id);

  console.log("7. Fetching back exactly from DB...");
  const { data: fetchQr, error: fetchErr } = await supabase.from('qr_codes').select('*').eq('id', qr.id).single();
  if (fetchErr) return console.log("Fetch Err:", fetchErr);
  
  console.log("Fetched ID:", fetchQr.qr_unique_id);

  console.log("\n--- TRACE SUMMARY ---");
  console.log("Generated ID:", generatedId);
  console.log("Stored ID:", fetchQr.qr_unique_id);
  console.log("QR Encoded ID:", `https://projectqr.app/scan/${fetchQr.qr_unique_id}`);
  
  // We simulate API receiving ID by just using the fetched ID since the route extracts it exactly from URL params
  console.log("API Received ID:", fetchQr.qr_unique_id);
}

run();
