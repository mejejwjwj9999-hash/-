-- إصلاح مشكلة search_path في دالة handle_new_student
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.student_profiles (
    user_id,
    student_id,
    first_name,
    last_name,
    email,
    college,
    department,
    academic_year,
    semester,
    admission_date
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'student_id', 'STD' || to_char(now(), 'YYYYMMDD') || LPAD(nextval('public.student_id_seq')::text, 4, '0')),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', 'غير محدد'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'غير محدد'),
    COALESCE((NEW.raw_user_meta_data->>'academic_year')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'semester')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'admission_date')::date, now()::date)
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and continue without blocking user creation
    RAISE LOG 'Error in handle_new_student: %', SQLERRM;
    RETURN NEW;
END;
$$;