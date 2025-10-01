-- امنح كل مستخدم لديه دور admin في user_roles صلاحية has_admin_access عبر admin_user_roles
INSERT INTO admin_user_roles (user_id, role, is_active)
SELECT ur.user_id, 'super_admin'::admin_role, true
FROM user_roles ur
LEFT JOIN admin_user_roles ar ON ar.user_id = ur.user_id AND ar.is_active = true
WHERE ur.role = 'admin'::app_role AND ar.user_id IS NULL;