-- ============================================================
-- FINAL RETRIQO QR RLS FIX
-- Execute this in the Supabase SQL Editor
-- 
-- Root Cause: 
-- 1. `qr_codes.user_id` may be null or non-existent in the schema.
-- 2. `reports.user_id` is null because it isn't inserted during upload.
-- Because of this, the previous RLS policy for `qr_codes` evaluated to FALSE, 
-- preventing authenticated users from reading their own QR codes in ProjectStudio.
-- 
-- Fix:
-- Route the RLS check all the way up to `projects.user_id`, which is guaranteed 
-- to be populated and is already successfully used for `reports` and `files` RLS.
-- ============================================================

DROP POLICY IF EXISTS "Allow users to manage their own QR codes" ON qr_codes;

CREATE POLICY "Allow users to manage their own QR codes"
ON qr_codes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM files
    INNER JOIN reports ON reports.id = files.report_id
    INNER JOIN projects ON projects.id = reports.project_id
    WHERE files.id = qr_codes.file_id
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM files
    INNER JOIN reports ON reports.id = files.report_id
    INNER JOIN projects ON projects.id = reports.project_id
    WHERE files.id = qr_codes.file_id
    AND projects.user_id = auth.uid()
  )
);
