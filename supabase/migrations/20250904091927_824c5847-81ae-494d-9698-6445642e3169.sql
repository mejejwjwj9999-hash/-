-- تحسين RLS policies للواجبات والتسليمات

-- حذف السياسات القديمة للواجبات
DROP POLICY IF EXISTS "Students can view assignments for their enrolled courses" ON assignments;
DROP POLICY IF EXISTS "Admins can manage all assignments" ON assignments;

-- حذف السياسات القديمة للتسليمات
DROP POLICY IF EXISTS "Students can view their own submissions" ON assignment_submissions;
DROP POLICY IF EXISTS "Students can submit their own assignments" ON assignment_submissions;
DROP POLICY IF EXISTS "Students can update their own submissions" ON assignment_submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON assignment_submissions;

-- إنشاء سياسات محسنة للواجبات
CREATE POLICY "Students can view assignments for enrolled courses"
ON assignments FOR SELECT
USING (
  -- السماح للطلاب برؤية الواجبات للمقررات المسجلين فيها فقط
  course_id IN (
    SELECT se.course_id 
    FROM student_enrollments se
    JOIN student_profiles sp ON se.student_id = sp.id
    WHERE sp.user_id = auth.uid() 
    AND se.status = 'enrolled'
  )
);

CREATE POLICY "Admins can manage all assignments"
ON assignments FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- إنشاء سياسات محسنة للتسليمات
CREATE POLICY "Students can view own submissions"
ON assignment_submissions FOR SELECT
USING (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Students can create own submissions"
ON assignment_submissions FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
  AND assignment_id IN (
    -- التأكد من أن الواجب للمقررات المسجل فيها الطالب
    SELECT a.id
    FROM assignments a
    WHERE a.course_id IN (
      SELECT se.course_id 
      FROM student_enrollments se
      JOIN student_profiles sp ON se.student_id = sp.id
      WHERE sp.user_id = auth.uid() 
      AND se.status = 'enrolled'
    )
  )
);

CREATE POLICY "Students can update own submissions"
ON assignment_submissions FOR UPDATE
USING (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
)
WITH CHECK (
  student_id IN (
    SELECT sp.id 
    FROM student_profiles sp 
    WHERE sp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all submissions"
ON assignment_submissions FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- تحسين فهرس للأداء
CREATE INDEX IF NOT EXISTS idx_assignments_course_status ON assignments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student ON assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_status ON student_enrollments(student_id, status);

-- إضافة تحديث للجدولة الزمنية للواجبات
CREATE OR REPLACE FUNCTION update_assignment_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- تحديث حالة الواجبات المنتهية الصلاحية
  UPDATE assignments 
  SET status = 'completed'
  WHERE due_date < NOW() 
  AND status = 'active';
END;
$$;

-- تشغيل الدالة لتحديث الحالات
SELECT update_assignment_status();