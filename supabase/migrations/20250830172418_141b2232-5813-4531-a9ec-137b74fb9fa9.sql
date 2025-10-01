
-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grades_student_academic ON grades(student_id, academic_year, semester);
CREATE INDEX IF NOT EXISTS idx_payments_student_status ON payments(student_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_student_unread ON notifications(student_id, is_read);
CREATE INDEX IF NOT EXISTS idx_service_requests_student_status ON service_requests(student_id, status);
CREATE INDEX IF NOT EXISTS idx_class_schedule_academic ON class_schedule(academic_year, semester);

-- Add missing foreign key relationships
ALTER TABLE grades ADD CONSTRAINT fk_grades_course FOREIGN KEY (course_id) REFERENCES courses(id);
ALTER TABLE class_schedule ADD CONSTRAINT fk_schedule_course FOREIGN KEY (course_id) REFERENCES courses(id);

-- Update service_requests table to include additional fields needed
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS estimated_completion_date DATE;

-- Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Students can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'student-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'student-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage all documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'student-documents' AND
  is_admin(auth.uid())
);

-- Add triggers for updated_at columns where missing
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that need them
DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE grades;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;

-- Set replica identity for realtime updates
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE service_requests REPLICA IDENTITY FULL;
ALTER TABLE grades REPLICA IDENTITY FULL;
ALTER TABLE payments REPLICA IDENTITY FULL;
ALTER TABLE documents REPLICA IDENTITY FULL;

-- Add sample data for testing (if tables are empty)
-- Insert sample courses if none exist
INSERT INTO courses (course_code, course_name_ar, course_name_en, department, college, credit_hours, description)
SELECT * FROM (VALUES
  ('CS101', 'مقدمة في علوم الحاسوب', 'Introduction to Computer Science', 'علوم الحاسوب', 'كلية تكنولوجيا المعلومات', 3, 'مقرر تأسيسي في علوم الحاسوب'),
  ('MATH101', 'الرياضيات العامة', 'General Mathematics', 'الرياضيات', 'كلية العلوم', 3, 'مقرر أساسي في الرياضيات'),
  ('ENG101', 'اللغة الإنجليزية', 'English Language', 'اللغة الإنجليزية', 'كلية الآداب', 2, 'مقرر اللغة الإنجليزية الأساسي'),
  ('PHYS101', 'الفيزياء العامة', 'General Physics', 'الفيزياء', 'كلية العلوم', 4, 'مقرر الفيزياء الأساسي')
) AS t(course_code, course_name_ar, course_name_en, department, college, credit_hours, description)
WHERE NOT EXISTS (SELECT 1 FROM courses LIMIT 1);
