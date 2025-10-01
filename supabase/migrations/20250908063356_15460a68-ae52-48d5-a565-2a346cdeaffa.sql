-- منح صلاحيات إدارية للمستخدم الحالي 
INSERT INTO admin_user_roles (user_id, role, is_active, granted_by, granted_at, created_at, updated_at)
VALUES (
  (SELECT auth.uid()),
  'super_admin'::admin_role,
  true,
  (SELECT auth.uid()),
  now(),
  now(),
  now()
);