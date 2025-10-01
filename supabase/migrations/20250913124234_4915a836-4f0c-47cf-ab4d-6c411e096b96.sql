-- Tighten INSERT policy on content_change_log
DROP POLICY IF EXISTS "System can insert content change logs" ON public.content_change_log;
CREATE POLICY "Admins can insert content change logs"
ON public.content_change_log
FOR INSERT
WITH CHECK (has_admin_access(auth.uid()) OR is_admin(auth.uid()));