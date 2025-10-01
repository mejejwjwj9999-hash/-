
-- إنشاء جدول الملفات الشخصية للطلاب
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  admission_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'graduated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول المقررات الدراسية
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT UNIQUE NOT NULL,
  course_name_ar TEXT NOT NULL,
  course_name_en TEXT,
  credit_hours INTEGER NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  prerequisites TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول الدرجات
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  midterm_grade DECIMAL(5,2),
  final_grade DECIMAL(5,2),
  coursework_grade DECIMAL(5,2),
  total_grade DECIMAL(5,2),
  letter_grade TEXT CHECK (letter_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F')),
  gpa_points DECIMAL(3,2),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, semester, academic_year)
);

-- إنشاء جدول الجدول الدراسي
CREATE TABLE public.class_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_name TEXT NOT NULL,
  classroom TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول المدفوعات
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'YER',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  semester TEXT,
  academic_year TEXT,
  reference_number TEXT UNIQUE,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول طلبات الخدمات
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  documents JSONB,
  response TEXT,
  assigned_to TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول الوثائق
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_official BOOLEAN DEFAULT false,
  verification_code TEXT,
  issued_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول الإشعارات
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إنشاء جدول المواعيد
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  appointment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  location TEXT,
  staff_member TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security على جميع الجداول
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للطلاب
CREATE POLICY "Students can view their own profile" 
  ON public.student_profiles FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Students can update their own profile" 
  ON public.student_profiles FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Students can view courses" 
  ON public.courses FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Students can view their own grades" 
  ON public.grades FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view class schedules" 
  ON public.class_schedule FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Students can view their own payments" 
  ON public.payments FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create their own payments" 
  ON public.payments FOR INSERT 
  WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their own service requests" 
  ON public.service_requests FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create their own service requests" 
  ON public.service_requests FOR INSERT 
  WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their own documents" 
  ON public.documents FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can update their own notifications" 
  ON public.notifications FOR UPDATE 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their own appointments" 
  ON public.appointments FOR SELECT 
  USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create their own appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- إنشاء دالة للتحديث التلقائي لـ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفزات للتحديث التلقائي
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- إنشاء دالة لإنشاء ملف شخصي للطالب عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء تسلسل لرقم الطالب
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;

-- إنشاء المحفز لإنشاء ملف الطالب عند التسجيل
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student();

-- إدراج بيانات تجريبية للمقررات
INSERT INTO public.courses (course_code, course_name_ar, course_name_en, credit_hours, college, department, description) VALUES
('CHEM301', 'الكيمياء العضوية', 'Organic Chemistry', 3, 'كلية الصيدلة', 'الصيدلة', 'دراسة المركبات العضوية وتفاعلاتها'),
('ANAT201', 'علم التشريح', 'Human Anatomy', 4, 'كلية الصيدلة', 'الصيدلة', 'دراسة تشريح جسم الإنسان'),
('PHAR401', 'علم الأدوية', 'Pharmacology', 3, 'كلية الصيدلة', 'الصيدلة', 'دراسة تأثير الأدوية على الجسم'),
('PHYS201', 'الفيزياء الطبية', 'Medical Physics', 2, 'كلية الصيدلة', 'الصيدلة', 'تطبيقات الفيزياء في المجال الطبي'),
('BIOCHEM301', 'الكيمياء الحيوية', 'Biochemistry', 3, 'كلية الصيدلة', 'الصيدلة', 'دراسة العمليات الكيميائية في الكائنات الحية');
