-- إنشاء جداول إدارة شؤون الطلاب

-- جدول خدمات شؤون الطلاب
CREATE TABLE public.student_affairs_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT NOT NULL DEFAULT 'FileText',
  category TEXT NOT NULL DEFAULT 'academic',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  required_documents JSONB DEFAULT '[]'::jsonb,
  processing_time TEXT,
  fee_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول النوادي الطلابية
CREATE TABLE public.student_clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  category TEXT NOT NULL DEFAULT 'academic',
  logo_url TEXT,
  banner_url TEXT,
  supervisor_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  meeting_schedule TEXT,
  location TEXT,
  max_members INTEGER,
  current_members INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'recruiting')),
  is_featured BOOLEAN DEFAULT false,
  requirements JSONB DEFAULT '[]'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الأنشطة الطلابية
CREATE TABLE public.student_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  type TEXT NOT NULL DEFAULT 'event' CHECK (type IN ('event', 'workshop', 'competition', 'seminar', 'trip', 'cultural', 'sports')),
  category TEXT NOT NULL DEFAULT 'academic',
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  location TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  organizer_name TEXT,
  organizer_contact TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'open', 'closed', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  fee_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول طلبات الانضمام للنوادي
CREATE TABLE public.club_join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES public.student_clubs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT,
  motivation_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(club_id, student_id)
);

-- جدول تسجيلات الأنشطة
CREATE TABLE public.activity_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.student_activities(id) ON DELETE CASCADE,
  student_id UUID,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  participant_type TEXT DEFAULT 'student' CHECK (participant_type IN ('student', 'external')),
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confirmation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(activity_id, participant_email)
);

-- إضافة الفهارس لتحسين الأداء
CREATE INDEX idx_student_affairs_services_category ON public.student_affairs_services(category);
CREATE INDEX idx_student_affairs_services_status ON public.student_affairs_services(status);
CREATE INDEX idx_student_clubs_category ON public.student_clubs(category);
CREATE INDEX idx_student_clubs_status ON public.student_clubs(status);
CREATE INDEX idx_student_activities_type ON public.student_activities(type);
CREATE INDEX idx_student_activities_status ON public.student_activities(status);
CREATE INDEX idx_student_activities_dates ON public.student_activities(start_date, end_date);
CREATE INDEX idx_club_join_requests_status ON public.club_join_requests(status);
CREATE INDEX idx_activity_registrations_status ON public.activity_registrations(status);

-- تفعيل RLS
ALTER TABLE public.student_affairs_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_registrations ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للخدمات
CREATE POLICY "Public can view active services" ON public.student_affairs_services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage services" ON public.student_affairs_services
  FOR ALL USING (has_admin_access(auth.uid()));

-- سياسات RLS للنوادي
CREATE POLICY "Public can view active clubs" ON public.student_clubs
  FOR SELECT USING (status IN ('active', 'recruiting'));

CREATE POLICY "Admins can manage clubs" ON public.student_clubs
  FOR ALL USING (has_admin_access(auth.uid()));

-- سياسات RLS للأنشطة
CREATE POLICY "Public can view open activities" ON public.student_activities
  FOR SELECT USING (status IN ('open', 'ongoing', 'completed'));

CREATE POLICY "Admins can manage activities" ON public.student_activities
  FOR ALL USING (has_admin_access(auth.uid()));

-- سياسات RLS لطلبات الانضمام
CREATE POLICY "Students can view own requests" ON public.club_join_requests
  FOR SELECT USING (student_id = get_current_student_id());

CREATE POLICY "Students can create requests" ON public.club_join_requests
  FOR INSERT WITH CHECK (student_id = get_current_student_id());

CREATE POLICY "Admins can manage all requests" ON public.club_join_requests
  FOR ALL USING (has_admin_access(auth.uid()));

-- سياسات RLS لتسجيلات الأنشطة
CREATE POLICY "Students can view own registrations" ON public.activity_registrations
  FOR SELECT USING (student_id = get_current_student_id() OR participant_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Students can register for activities" ON public.activity_registrations
  FOR INSERT WITH CHECK (student_id = get_current_student_id() OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all registrations" ON public.activity_registrations
  FOR ALL USING (has_admin_access(auth.uid()));

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_student_affairs_services_updated_at
  BEFORE UPDATE ON public.student_affairs_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_clubs_updated_at
  BEFORE UPDATE ON public.student_clubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_activities_updated_at
  BEFORE UPDATE ON public.student_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_club_join_requests_updated_at
  BEFORE UPDATE ON public.club_join_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_registrations_updated_at
  BEFORE UPDATE ON public.activity_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بيانات أولية للخدمات
INSERT INTO public.student_affairs_services (title_ar, description_ar, icon, category, processing_time, fee_amount) VALUES
('شهادة تخرج', 'إصدار شهادة التخرج الرسمية للطلاب المتخرجين', 'Award', 'certificates', '3-5 أيام عمل', 5000),
('شهادة تقديرات', 'إصدار شهادة التقديرات لجميع السنوات الدراسية', 'FileText', 'certificates', '2-3 أيام عمل', 2000),
('بيان درجات', 'إصدار بيان مفصل بجميع درجات الطالب', 'ClipboardList', 'certificates', '1-2 يوم عمل', 1500),
('شهادة طالب', 'إصدار شهادة تثبت أن الطالب مسجل بالكلية', 'UserCheck', 'certificates', 'نفس اليوم', 1000),
('تأجيل الدراسة', 'طلب تأجيل الدراسة لفصل دراسي أو أكثر', 'Clock', 'academic', '5-7 أيام عمل', 0),
('الانسحاب من مقرر', 'طلب الانسحاب من مقرر دراسي', 'Minus', 'academic', '2-3 أيام عمل', 0),
('إضافة مقرر', 'طلب إضافة مقرر دراسي جديد', 'Plus', 'academic', '2-3 أيام عمل', 0),
('تغيير التخصص', 'طلب تغيير التخصص الدراسي', 'ArrowLeftRight', 'academic', '10-14 يوم عمل', 10000),
('استعادة كلمة المرور', 'طلب استعادة كلمة مرور النظام الأكاديمي', 'Key', 'technical', '1-2 يوم عمل', 0),
('تحديث البيانات الشخصية', 'طلب تحديث البيانات الشخصية في النظام', 'Edit', 'administrative', '3-5 أيام عمل', 0);

-- إدراج بيانات أولية للنوادي
INSERT INTO public.student_clubs (name_ar, description_ar, category, supervisor_name, location, max_members) VALUES
('نادي تقنية المعلومات', 'نادي يهتم بتطوير المهارات التقنية والبرمجة', 'technical', 'د. أحمد محمد', 'مختبر الحاسوب', 50),
('نادي الأدب والثقافة', 'نادي يهتم بالأنشطة الأدبية والثقافية', 'cultural', 'د. فاطمة علي', 'قاعة المحاضرات الكبرى', 40),
('نادي المناظرات', 'نادي يهتم بتطوير مهارات المناظرة والخطابة', 'academic', 'د. عبدالله حسن', 'قاعة المناقشات', 30),
('نادي العلوم الطبية', 'نادي يركز على الأنشطة العلمية والطبية', 'scientific', 'د. مريم سالم', 'المختبر الطبي', 35),
('نادي الرياضة', 'نادي يهتم بالأنشطة الرياضية والبدنية', 'sports', 'الأستاذ خالد يوسف', 'الملعب الرياضي', 60),
('نادي الفنون', 'نادي يهتم بالفنون التشكيلية والإبداعية', 'artistic', 'الأستاذة نور محمد', 'استوديو الفنون', 25),
('نادي التطوع', 'نادي يهتم بالعمل التطوعي وخدمة المجتمع', 'social', 'د. سعد أحمد', 'قاعة الأنشطة', 45),
('نادي ريادة الأعمال', 'نادي يهتم بتطوير الأفكار الريادية والمشاريع', 'business', 'د. علياء حسين', 'مركز الابتكار', 30);

-- إدراج بيانات أولية للأنشطة
INSERT INTO public.student_activities (title_ar, description_ar, type, category, start_date, end_date, registration_deadline, location, max_participants, organizer_name) VALUES
('ورشة البرمجة المتقدمة', 'ورشة تدريبية في البرمجة باستخدام Python و JavaScript', 'workshop', 'technical', '2024-02-15 10:00:00+00', '2024-02-17 16:00:00+00', '2024-02-10 23:59:59+00', 'مختبر الحاسوب', 25, 'نادي تقنية المعلومات'),
('مسابقة الشعر العربي', 'مسابقة ثقافية في الشعر العربي الكلاسيكي والحديث', 'competition', 'cultural', '2024-02-20 15:00:00+00', '2024-02-20 18:00:00+00', '2024-02-18 23:59:59+00', 'قاعة المحاضرات الكبرى', 40, 'نادي الأدب والثقافة'),
('رحلة علمية لمستشفى الثورة', 'رحلة تعليمية لطلاب الطب والتمريض', 'trip', 'scientific', '2024-02-25 08:00:00+00', '2024-02-25 16:00:00+00', '2024-02-22 23:59:59+00', 'مستشفى الثورة', 30, 'نادي العلوم الطبية'),
('بطولة كرة القدم', 'بطولة داخلية لكرة القدم بين أقسام الكلية', 'sports', 'sports', '2024-03-01 14:00:00+00', '2024-03-05 18:00:00+00', '2024-02-28 23:59:59+00', 'الملعب الرياضي', 60, 'نادي الرياضة'),
('معرض الفنون التشكيلية', 'معرض لأعمال الطلاب في الفنون التشكيلية', 'event', 'artistic', '2024-03-10 10:00:00+00', '2024-03-12 20:00:00+00', '2024-03-08 23:59:59+00', 'قاعة المعارض', 50, 'نادي الفنون'),
('ندوة ريادة الأعمال', 'ندوة حول بناء المشاريع الناشئة والاستثمار', 'seminar', 'business', '2024-03-15 14:00:00+00', '2024-03-15 17:00:00+00', '2024-03-13 23:59:59+00', 'قاعة المؤتمرات', 80, 'نادي ريادة الأعمال');