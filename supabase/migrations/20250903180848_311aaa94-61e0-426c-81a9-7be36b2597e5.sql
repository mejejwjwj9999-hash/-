-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) VALUES ('course-files', 'course-files', false);

-- Create RLS policies for course files bucket
CREATE POLICY "Admins can manage course files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'course-files' AND is_admin(auth.uid()));

CREATE POLICY "Students can view course files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'course-files' AND 
  EXISTS (
    SELECT 1 FROM course_files cf
    WHERE cf.file_path = CONCAT('https://nzziqvjfymosjjbzkrma.supabase.co/storage/v1/object/public/course-files/', name)
    AND cf.is_public = true
    AND cf.course_id IN (
      SELECT se.course_id FROM student_enrollments se
      JOIN student_profiles sp ON se.student_id = sp.id
      WHERE sp.user_id = auth.uid()
    )
  )
);