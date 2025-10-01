// TypeScript interfaces للمقررات والملفات والواجبات

export interface Course {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
  department: string;
  department_id?: string;
  college: string;
  description?: string;
  prerequisites?: string[];
  academic_year: number;
  semester: number;
  program_id?: string;
  specialization?: string;
  instructor_name?: string;
  created_at: string;
}

export interface EnrolledCourse extends Course {
  enrollmentId: string;
  enrollmentDate: string;
  instructor: string;
  currentGrade: number;
  status: 'enrolled' | 'completed' | 'withdrawn';
  color: string;
  // إضافة aliases للتوافق مع النظام القديم
  courseId: string;
  name: string;
  code: string;
  credits: number;
}

export interface CourseFile {
  id: string;
  course_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  category?: string;
  description?: string;
  is_public: boolean;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  courses?: {
    course_name_ar: string;
    course_name_en?: string;
    course_code: string;
  };
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  instructions?: string;
  due_date: string;
  max_grade?: number;
  submission_type?: string;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  courses?: {
    course_name_ar: string;
    course_name_en?: string;
    course_code: string;
  };
  assignment_submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text?: string;
  file_path?: string;
  file_name?: string;
  attachment_url?: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  grade?: number;
  feedback?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  student_profiles?: {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface NotificationWithFilters {
  id: string;
  student_id: string;
  title: string;
  message: string;
  type: string;
  category?: string;
  priority: 'low' | 'normal' | 'medium' | 'high';
  is_read: boolean;
  action_url?: string;
  expires_at?: string;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  department_id?: string;
  program_id?: string;
  college: string;
  academic_year: number;
  semester: number;
  specialization?: string;
  status: string;
  account_status?: string;
  created_at: string;
  updated_at: string;
}