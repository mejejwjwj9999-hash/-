import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GradeStatistics {
  totalStudents: number;
  totalCourses: number;
  overallGPA: number;
  passRate: number;
  departmentStats: Record<string, {
    students: number;
    averageGPA: number;
    passRate: number;
  }>;
  gradeDistribution: Record<string, number>;
  semesterComparison: Array<{
    semester: string;
    academicYear: string;
    averageGPA: number;
    totalStudents: number;
  }>;
}

export const useGradeStatistics = (academicYear?: string, semester?: string) => {
  return useQuery({
    queryKey: ['grade-statistics', academicYear, semester],
    queryFn: async (): Promise<GradeStatistics> => {
      let query = supabase
        .from('grades')
        .select(`
          id,
          total_grade,
          letter_grade,
          gpa_points,
          academic_year,
          semester,
          student_profiles!grades_student_id_fkey (
            id,
            student_id,
            first_name,
            last_name,
            department
          ),
          courses!grades_course_id_fkey (
            id,
            course_code,
            course_name_ar,
            department
          )
        `);

      if (academicYear) {
        query = query.eq('academic_year', academicYear);
      }

      if (semester) {
        query = query.eq('semester', semester);
      }

      const { data: grades, error } = await query;
      if (error) throw error;

      // حساب الإحصائيات
      const validGrades = grades || [];
      const totalStudents = new Set(validGrades.map(g => g.student_profiles?.id)).size;
      const totalCourses = new Set(validGrades.map(g => g.courses?.id)).size;
      
      const gpaSum = validGrades.reduce((sum, grade) => sum + (grade.gpa_points || 0), 0);
      const overallGPA = validGrades.length > 0 ? gpaSum / validGrades.length : 0;
      
      const passedGrades = validGrades.filter(g => (g.gpa_points || 0) >= 1.0);
      const passRate = validGrades.length > 0 ? (passedGrades.length / validGrades.length) * 100 : 0;

      // إحصائيات الأقسام
      const departmentStats: Record<string, any> = {};
      validGrades.forEach(grade => {
        const dept = grade.student_profiles?.department || 'غير محدد';
        if (!departmentStats[dept]) {
          departmentStats[dept] = {
            students: new Set(),
            totalGPA: 0,
            gradeCount: 0,
            passedGrades: 0,
          };
        }
        departmentStats[dept].students.add(grade.student_profiles?.id);
        departmentStats[dept].totalGPA += grade.gpa_points || 0;
        departmentStats[dept].gradeCount++;
        if ((grade.gpa_points || 0) >= 1.0) {
          departmentStats[dept].passedGrades++;
        }
      });

      // تحويل إحصائيات الأقسام
      const processedDepartmentStats: Record<string, any> = {};
      Object.keys(departmentStats).forEach(dept => {
        const stats = departmentStats[dept];
        processedDepartmentStats[dept] = {
          students: stats.students.size,
          averageGPA: stats.gradeCount > 0 ? stats.totalGPA / stats.gradeCount : 0,
          passRate: stats.gradeCount > 0 ? (stats.passedGrades / stats.gradeCount) * 100 : 0,
        };
      });

      // توزيع الدرجات
      const gradeDistribution: Record<string, number> = {};
      validGrades.forEach(grade => {
        const letter = grade.letter_grade || 'غير محدد';
        gradeDistribution[letter] = (gradeDistribution[letter] || 0) + 1;
      });

      // مقارنة الفصول - استعلام منفصل للحصول على بيانات تاريخية
      const { data: semesterData } = await supabase
        .from('grades')
        .select('academic_year, semester, gpa_points, student_id')
        .order('academic_year', { ascending: false })
        .order('semester', { ascending: true });

      const semesterComparison: Array<any> = [];
      const semesterMap = new Map<string, { gpaSum: number; count: number; students: Set<string> }>();

      (semesterData || []).forEach(grade => {
        const key = `${grade.academic_year}-${grade.semester}`;
        if (!semesterMap.has(key)) {
          semesterMap.set(key, { gpaSum: 0, count: 0, students: new Set() });
        }
        const semesterStats = semesterMap.get(key)!;
        semesterStats.gpaSum += grade.gpa_points || 0;
        semesterStats.count++;
        semesterStats.students.add(grade.student_id);
      });

      semesterMap.forEach((stats, key) => {
        const [academicYear, semester] = key.split('-');
        semesterComparison.push({
          semester,
          academicYear,
          averageGPA: stats.count > 0 ? stats.gpaSum / stats.count : 0,
          totalStudents: stats.students.size,
        });
      });

      return {
        totalStudents,
        totalCourses,
        overallGPA,
        passRate,
        departmentStats: processedDepartmentStats,
        gradeDistribution,
        semesterComparison: semesterComparison.slice(0, 6), // آخر 6 فصول
      };
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
    retry: 2,
  });
};

export const useStudentGradeDetails = (studentId: string) => {
  return useQuery({
    queryKey: ['student-grade-details', studentId],
    queryFn: async () => {
      if (!studentId) return null;

      // جلب بيانات الطالب الشخصية
      const { data: student, error: studentError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      const { data: grades, error } = await supabase
        .from('grades')
        .select(`
          *,
          courses!grades_course_id_fkey (
            course_code,
            course_name_ar,
            course_name_en,
            credit_hours,
            department
          )
        `)
        .eq('student_id', studentId)
        .order('academic_year', { ascending: false })
        .order('semester', { ascending: false });

      if (error) throw error;

      const validGrades = grades || [];
      const totalCreditHours = validGrades.reduce((sum, grade) => 
        sum + (grade.courses?.credit_hours || 0), 0
      );
      
      const weightedGPASum = validGrades.reduce((sum, grade) => 
        sum + ((grade.gpa_points || 0) * (grade.courses?.credit_hours || 0)), 0
      );

      const cumulativeGPA = totalCreditHours > 0 ? weightedGPASum / totalCreditHours : 0;
      
      const completedHours = validGrades
        .filter(g => (g.gpa_points || 0) >= 1.0)
        .reduce((sum, grade) => sum + (grade.courses?.credit_hours || 0), 0);

      return {
        student,
        grades: validGrades,
        cumulativeGPA,
        totalCreditHours,
        completedHours,
        currentSemesterGPA: 0, // يمكن حسابه بناءً على الفصل الحالي
        academicStatus: cumulativeGPA >= 2.0 ? 'جيد' : 'تحت المراقبة',
      };
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // دقيقتان
  });
};