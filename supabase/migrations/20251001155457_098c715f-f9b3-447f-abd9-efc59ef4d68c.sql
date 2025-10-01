-- إصلاح search_path للدوال الجديدة لتحسين الأمان

-- إعادة إنشاء دالة log_role_changes مع search_path آمن
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.roles_audit_log (
    action,
    entity_type,
    entity_id,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_OP,
    'role',
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إعادة إنشاء دالة log_user_role_changes مع search_path آمن
CREATE OR REPLACE FUNCTION public.log_user_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.roles_audit_log (
    action,
    entity_type,
    entity_id,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_OP,
    'user_role_assignment',
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إعادة إنشاء دالة update_roles_updated_at مع search_path آمن
CREATE OR REPLACE FUNCTION public.update_roles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;