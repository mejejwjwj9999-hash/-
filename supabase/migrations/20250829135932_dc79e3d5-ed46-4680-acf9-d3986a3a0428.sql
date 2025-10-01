-- Create the student_id_seq sequence that's missing
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

-- Create the trigger that calls handle_new_student function when a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created_student
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student();