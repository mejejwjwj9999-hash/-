-- Enable RLS and add safe policies for student registration requests
-- Root fix for RLS violation on insert

-- 1) Ensure RLS is enabled
ALTER TABLE public.student_registration_requests ENABLE ROW LEVEL SECURITY;

-- 2) Ensure status defaults to 'pending' so inserts without explicit status pass the WITH CHECK
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'student_registration_requests'
      AND column_name = 'status'
  ) THEN
    RAISE EXCEPTION 'Column status not found on student_registration_requests';
  END IF;
  -- Set default to pending (idempotent)
  EXECUTE $$ALTER TABLE public.student_registration_requests
           ALTER COLUMN status SET DEFAULT 'pending'::text$$;
END $$;

-- 3) Admins can fully manage the table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_registration_requests'
      AND policyname = 'Admins can manage registration requests'
  ) THEN
    CREATE POLICY "Admins can manage registration requests"
    ON public.student_registration_requests
    FOR ALL
    USING (has_admin_access(auth.uid()))
    WITH CHECK (has_admin_access(auth.uid()));
  END IF;
END $$;

-- 4) Allow public/unauthenticated users to create registration requests safely
--    Prevent clients from setting admin-only fields or non-pending status
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_registration_requests'
      AND policyname = 'Public can create registration requests'
  ) THEN
    CREATE POLICY "Public can create registration requests"
    ON public.student_registration_requests
    FOR INSERT
    WITH CHECK (
      -- status must be pending (or null which will default to pending)
      (status IS NULL OR status = 'pending')
      AND reviewed_at IS NULL
      AND reviewed_by IS NULL
      AND admin_notes IS NULL
      AND rejection_reason IS NULL
    );
  END IF;
END $$;

-- Optional: If there is an updated_at column, keep it fresh (won't error if trigger exists already)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'student_registration_requests'
      AND column_name = 'updated_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_student_registration_requests_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_student_registration_requests_set_updated_at
    BEFORE UPDATE ON public.student_registration_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;