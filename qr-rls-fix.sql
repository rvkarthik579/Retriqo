-- ============================================================
-- RETRIQO QR RLS FIX
-- Execute this in Supabase SQL Editor
-- Fixes: qr_codes RLS so authenticated users can read their
--        own qr_codes both directly and via file relationships.
-- ============================================================

-- Drop existing qr_codes policy that may have a user_id NULL edge case
DROP POLICY IF EXISTS "Allow users to manage their own QR codes" ON qr_codes;

-- Recreate with a dual-ownership check:
--   1. Direct ownership via user_id column (primary path)
--   2. Relational ownership via file_id → files → report_id → reports.user_id
--      (fallback for rows where user_id may be null due to schema changes)
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
