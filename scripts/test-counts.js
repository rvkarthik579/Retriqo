require('dotenv').config({ path: '.env.local' });

async function query(table) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return await res.json();
}

async function run() {
  const reports = await query('reports');
  const files = await query('files');
  const qrs = await query('qr_codes');

  console.log(`TOTAL REPORTS: ${reports.length}`);
  console.log(`TOTAL FILES: ${files.length}`);
  console.log(`TOTAL QRs: ${qrs.length}`);

  if (reports.length > 0) {
    // Group by report
    reports.forEach(r => {
      const reportFiles = files.filter(f => f.report_id === r.id);
      const reportQrs = qrs.filter(q => q.report_id === r.id);
      console.log(`\nReport ${r.id}:`);
      console.log(`- Files: ${reportFiles.length}`);
      console.log(`- QRs: ${reportQrs.length}`);
      
      // Look at specific file names
      const uniqueNames = [...new Set(reportFiles.map(f => f.file_name))];
      console.log(`- Unique File Names:`, uniqueNames);
    });
  }
}

run().catch(console.error);
