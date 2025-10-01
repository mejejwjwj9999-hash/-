-- Fix RLS violation when trigger inserts into admin_content_revisions
-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.admin_content_revisions ENABLE ROW LEVEL SECURITY;

-- Allow admins (has_admin_access) to insert revision rows created by the trigger
DROP POLICY IF EXISTS "Admins can insert content revisions" ON public.admin_content_revisions;
CREATE POLICY "Admins can insert content revisions"
ON public.admin_content_revisions
FOR INSERT
TO authenticated
WITH CHECK (has_admin_access(auth.uid()));
