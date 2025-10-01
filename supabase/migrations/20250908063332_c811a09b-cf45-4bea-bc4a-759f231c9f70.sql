-- إنشاء مستخدم تجريبي بصلاحيات إدارية للاختبار
INSERT INTO admin_user_roles (user_id, role, is_active, granted_by)
SELECT 
  auth.uid(),
  'content_admin'::admin_role,
  true,
  auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  updated_at = now();