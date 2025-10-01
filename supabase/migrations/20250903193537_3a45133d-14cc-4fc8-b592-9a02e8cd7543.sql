-- إضافة حقل اسم المدرس إلى جدول المقررات
ALTER TABLE public.courses 
ADD COLUMN instructor_name TEXT;