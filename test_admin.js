require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function runTest() {
  console.log('1. Is process.env.SUPABASE_SERVICE_ROLE_KEY defined?');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(serviceRoleKey ? 'YES' : 'NO');

  console.log('\n2. Does its value start with:');
  if (!serviceRoleKey) {
    console.log('N/A');
  } else if (serviceRoleKey.startsWith('eyJ')) {
    console.log('"eyJ"');
  } else if (serviceRoleKey.startsWith('sb_publishable_')) {
    console.log('"sb_publishable_"');
  } else {
    console.log('something else?');
  }

  console.log('\n3. Print the exact key variable used to construct the Supabase client.');
  console.log('Variable: process.env.SUPABASE_SERVICE_ROLE_KEY');

  // Replicating createSupabaseAdminClient exactly
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  console.log('\n4. Executing query...');
  const { data, error } = await supabase
    .from("qr_codes")
    .select("id, qr_unique_id")
    .limit(1);

  console.log('\n--- RESULTS ---');
  console.log('Number of rows:', data ? data.length : 0);
  console.log('Error:', error);
  console.log('RLS bypassed:', (data && data.length > 0) ? 'YES' : 'NO');
}

runTest();
