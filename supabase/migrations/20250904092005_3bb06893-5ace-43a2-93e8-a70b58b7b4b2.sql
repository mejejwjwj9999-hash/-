-- إصلاح مشكلة search_path في الدالة
CREATE OR REPLACE FUNCTION update_assignment_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- تحديث حالة الواجبات المنتهية الصلاحية
  UPDATE assignments 
  SET status = 'completed'
  WHERE due_date < NOW() 
  AND status = 'active';
END;
$$;