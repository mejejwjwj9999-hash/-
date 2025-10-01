
-- إضافة العلاقات المفقودة بين الجداول
ALTER TABLE class_schedule 
ADD CONSTRAINT fk_class_schedule_course 
FOREIGN KEY (course_id) REFERENCES courses(id);

ALTER TABLE grades 
ADD CONSTRAINT fk_grades_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id),
ADD CONSTRAINT fk_grades_course 
FOREIGN KEY (course_id) REFERENCES courses(id);

ALTER TABLE payments 
ADD CONSTRAINT fk_payments_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id);

ALTER TABLE service_requests 
ADD CONSTRAINT fk_service_requests_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id);

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id);

ALTER TABLE documents 
ADD CONSTRAINT fk_documents_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id);

ALTER TABLE notifications 
ADD CONSTRAINT fk_notifications_student 
FOREIGN KEY (student_id) REFERENCES student_profiles(id);

-- إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_student_id ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_class_schedule_course_id ON class_schedule(course_id);

-- إضافة تسلسل لرقم الطالب إذا لم يكن موجوداً
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers للجداول التي تحتاجها
DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER update_student_profiles_updated_at 
    BEFORE UPDATE ON student_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at 
    BEFORE UPDATE ON service_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إضافة بيانات تجريبية للاختبار
INSERT INTO courses (course_code, course_name_ar, course_name_en, department, college, credit_hours, description) VALUES
('CS101', 'مقدمة في البرمجة', 'Introduction to Programming', 'علوم الحاسوب', 'كلية تكنولوجيا المعلومات', 3, 'مقدمة أساسية في البرمجة'),
('MATH101', 'الرياضيات الأساسية', 'Basic Mathematics', 'الرياضيات', 'كلية العلوم', 3, 'مبادئ الرياضيات الأساسية'),
('ENG101', 'اللغة الإنجليزية', 'English Language', 'اللغات', 'كلية الآداب', 2, 'تعلم أساسيات اللغة الإنجليزية')
ON CONFLICT (course_code) DO NOTHING;

-- إضافة بعض الإعدادات العامة
INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
('site_name', '"جامعة كلية أيلول"', 'اسم الموقع', 'general'),
('academic_year', '"2024-2025"', 'السنة الدراسية الحالية', 'academic'),
('current_semester', '"الفصل الأول"', 'الفصل الدراسي الحالي', 'academic'),
('tuition_fee', '500000', 'الرسوم الدراسية بالريال اليمني', 'financial')
ON CONFLICT (setting_key) DO NOTHING;
