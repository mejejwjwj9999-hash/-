-- Create secure RPC function to get contact messages
CREATE OR REPLACE FUNCTION public.get_contact_messages()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  status text,
  is_read boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  replied_at timestamp with time zone,
  replied_by uuid,
  admin_notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin access
  IF NOT has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    cm.id,
    cm.name,
    cm.email,
    cm.phone,
    cm.subject,
    cm.message,
    cm.status,
    cm.is_read,
    cm.created_at,
    cm.updated_at,
    cm.replied_at,
    cm.replied_by,
    cm.admin_notes
  FROM contact_messages cm
  ORDER BY cm.created_at DESC;
END;
$$;