-- Fix the security issues by updating functions with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_student()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = public
AS $function$
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
    COALESCE(NEW.raw_user_meta_data->>'student_id', 'STD' || to_char(now(), 'YYYYMMDD') || LPAD(nextval('student_id_seq')::text, 4, '0')),
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
END;
$function$;

-- Fix the handle_updated_at function as well
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;