
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useSchedule = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['schedule', profile?.id, profile?.academic_year, profile?.semester],
    queryFn: async () => {
      console.log('Fetching schedule for profile:', profile);
      
      if (!profile?.id) {
        console.log('No profile ID, returning empty array');
        return [];
      }
      
      // First, get the courses this student is enrolled in
      const { data: enrolledCourses, error: enrollmentError } = await supabase
        .from('student_enrollments')
        .select('course_id, academic_year, semester')
        .eq('student_id', profile.id)
        .eq('status', 'enrolled');
      
      if (enrollmentError) {
        console.error('Error fetching enrolled courses:', enrollmentError);
        throw enrollmentError;
      }
      
      if (!enrolledCourses || enrolledCourses.length === 0) {
        console.log('No enrolled courses found');
        return [];
      }
      
      const courseIds = enrolledCourses.map(enrollment => enrollment.course_id).filter(Boolean);
      
      if (courseIds.length === 0) {
        console.log('No valid course IDs found');
        return [];
      }
      
      // Get course details with department/program info
      const { data: coursesWithDetails, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);
      
      if (coursesError) {
        console.error('Error fetching course details:', coursesError);
        throw coursesError;
      }
      
      // Filter courses that match student's department/program/year/semester
      const validCourseIds = coursesWithDetails?.filter(course => {
        const departmentMatch = !profile.department_id || course.department_id === profile.department_id;
        const programMatch = !profile.program_id || course.program_id === profile.program_id;
        const yearMatch = !profile.academic_year || course.academic_year === profile.academic_year;
        const semesterMatch = !profile.semester || course.semester === profile.semester;
        
        console.log('Course filtering check:', {
          courseId: course.id,
          courseName: course.course_name_ar,
          departmentMatch,
          programMatch,
          yearMatch,
          semesterMatch,
          studentDept: profile.department_id,
          courseDept: course.department_id,
          studentProgram: profile.program_id,
          courseProgram: course.program_id
        });
        
        return departmentMatch && programMatch && yearMatch && semesterMatch;
      }).map(c => c.id) || [];
      
      console.log('Valid course IDs after filtering:', validCourseIds);
      
      if (validCourseIds.length === 0) {
        console.log('No valid courses found for student after department/program filtering');
        return [];
      }
      
      // Then get the schedule for valid courses only
      // Handle different academic_year formats: sometimes it's stored as "1" (year level) 
      // and sometimes as "2025" (calendar year)
      const currentCalendarYear = new Date().getFullYear();
      const academicYearVariants = [
        profile.academic_year?.toString() || '1',
        currentCalendarYear.toString(),
        (currentCalendarYear + 1).toString()
      ];
      
      console.log('Searching for schedule with academic_year variants:', academicYearVariants);
      console.log('Searching for semester:', profile.semester?.toString() || '1');
      console.log('Valid course IDs to search:', validCourseIds);

      const { data: scheduleData, error: scheduleError } = await supabase
        .from('class_schedule')
        .select(`
          *,
          courses!class_schedule_course_id_fkey (
            course_name_ar,
            course_code,
            credit_hours,
            course_name_en,
            department_id,
            program_id,
            academic_year,
            semester
          )
        `)
        .in('course_id', validCourseIds)
        .in('academic_year', academicYearVariants)
        .eq('semester', profile.semester?.toString() || '1')
        .order('day_of_week')
        .order('start_time');
      
      if (scheduleError) {
        console.error('Error fetching schedule:', scheduleError);
        throw scheduleError;
      }
      
      // Additional filtering to ensure schedule matches student profile
      const filteredSchedule = scheduleData?.filter(schedule => {
        const course = schedule.courses;
        if (!course) return false;
        
        const departmentMatch = !profile.department_id || course.department_id === profile.department_id;
        const programMatch = !profile.program_id || course.program_id === profile.program_id;
        // More flexible year matching since academic_year can be in different formats
        const yearMatch = !profile.academic_year || 
          course.academic_year === profile.academic_year || 
          schedule.academic_year === profile.academic_year?.toString() ||
          academicYearVariants.includes(schedule.academic_year);
        const semesterMatch = course.semester === profile.semester || 
          schedule.semester === profile.semester?.toString();
        
        console.log('Schedule final filtering:', {
          courseId: schedule.course_id,
          courseName: course.course_name_ar,
          scheduleAcademicYear: schedule.academic_year,
          scheduleSemester: schedule.semester,
          departmentMatch,
          programMatch,
          yearMatch,
          semesterMatch
        });
        
        return departmentMatch && programMatch && yearMatch && semesterMatch;
      }) || [];
      
      console.log('Schedule data fetched and filtered:', filteredSchedule);
      return filteredSchedule;
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
