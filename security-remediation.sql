-- ============================================================
-- RETRIQO SECURITY REMEDIATION SQL
-- Execute this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- ============================================================
-- PHASE 2A: ENABLE RLS ON ALL EXPOSED TABLES
-- ============================================================

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PHASE 2B: DROP ANY EXISTING PERMISSIVE POLICIES
-- ============================================================

-- Drop common auto-generated Supabase policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON reports;
DROP POLICY IF EXISTS "Enable read access for all users" ON files;
DROP POLICY IF EXISTS "Enable read access for all users" ON qr_codes;
DROP POLICY IF EXISTS "Enable read access for all users" ON scan_logs;
DROP POLICY IF EXISTS "Enable insert for all users" ON reports;
DROP POLICY IF EXISTS "Enable insert for all users" ON files;
DROP POLICY IF EXISTS "Enable insert for all users" ON qr_codes;
DROP POLICY IF EXISTS "Enable insert for all users" ON scan_logs;
DROP POLICY IF EXISTS "Enable update for all users" ON reports;
DROP POLICY IF EXISTS "Enable update for all users" ON files;
DROP POLICY IF EXISTS "Enable update for all users" ON qr_codes;
DROP POLICY IF EXISTS "Enable update for all users" ON scan_logs;
DROP POLICY IF EXISTS "Enable delete for all users" ON reports;
DROP POLICY IF EXISTS "Enable delete for all users" ON files;
DROP POLICY IF EXISTS "Enable delete for all users" ON qr_codes;
DROP POLICY IF EXISTS "Enable delete for all users" ON scan_logs;

-- Also drop any existing custom policies to prevent duplicates
DROP POLICY IF EXISTS "Allow users to manage their own reports" ON reports;
DROP POLICY IF EXISTS "Allow users to manage their own files" ON files;
DROP POLICY IF EXISTS "Allow users to manage their own QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Allow users to manage their own QR scan logs" ON scan_logs;

-- ============================================================
-- PHASE 2C: CREATE STRICT OWNERSHIP POLICIES
-- ============================================================

-- REPORTS: Direct ownership via user_id column
-- Allows authenticated users to SELECT, INSERT, UPDATE, DELETE only their own reports
CREATE POLICY "Allow users to manage their own reports"
ON reports
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- FILES: Relational ownership through reports.user_id
-- Files do not have a direct user_id; ownership is verified by joining to reports
CREATE POLICY "Allow users to manage their own files"
ON files
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM reports
    WHERE reports.id = files.report_id
    AND reports.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM reports
    WHERE reports.id = files.report_id
    AND reports.user_id = auth.uid()
  )
);

-- QR_CODES: Dual ownership check
-- Primary: direct ownership via user_id column
-- Fallback: relational ownership via file_id → files → reports.user_id
--           (covers edge cases where user_id was null due to schema version)
CREATE POLICY "Allow users to manage their own QR codes"
ON qr_codes
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM files
    INNER JOIN reports ON reports.id = files.report_id
    WHERE files.id = qr_codes.file_id
    AND reports.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM files
    INNER JOIN reports ON reports.id = files.report_id
    WHERE files.id = qr_codes.file_id
    AND reports.user_id = auth.uid()
  )
);

-- SCAN_LOGS: Relational ownership through qr_codes.user_id
-- Scan logs do not have a direct user_id; ownership is verified by joining to qr_codes
CREATE POLICY "Allow users to manage their own QR scan logs"
ON scan_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM qr_codes
    WHERE qr_codes.id = scan_logs.qr_id
    AND qr_codes.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM qr_codes
    WHERE qr_codes.id = scan_logs.qr_id
    AND qr_codes.user_id = auth.uid()
  )
);

-- ============================================================
-- PHASE 3: STORAGE SECURITY
-- Restrict the project-qr-files bucket so that:
-- 1. Only authenticated users can list/read/write their own folder
-- 2. Anonymous users cannot list or download anything
-- ============================================================

-- NOTE: Storage policies are managed in the Supabase Dashboard under
-- Storage → Policies. The SQL below creates them programmatically.

-- First, drop existing permissive storage policies if any
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- Allow authenticated users to SELECT (read/download) only files in their own user folder
CREATE POLICY "Allow users to read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-qr-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to INSERT (upload) only to their own user folder
CREATE POLICY "Allow users to upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-qr-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to UPDATE only their own files
CREATE POLICY "Allow users to update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-qr-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to DELETE only their own files
CREATE POLICY "Allow users to delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-qr-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- VERIFICATION QUERIES (run these after applying the policies)
-- ============================================================

-- Check RLS is enabled on all tables:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies WHERE schemaname = 'public';

-- Check storage policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'storage';
