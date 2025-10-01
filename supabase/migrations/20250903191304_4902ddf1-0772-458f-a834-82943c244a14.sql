-- إزالة القيد الخاطئ إذا كان موجوداً
ALTER TABLE public.assignments DROP CONSTRAINT IF EXISTS assignments_created_by_fkey;

-- إضافة القيد الصحيح للمرجع إلى auth.users
ALTER TABLE public.assignments 
ADD CONSTRAINT assignments_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;