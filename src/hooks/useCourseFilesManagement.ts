import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { CourseFile } from '@/types/course';

// Hook لجلب ملفات المقرر للطلاب
export const useStudentCourseFiles = (courseId?: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['student-course-files', courseId, profile?.id],
    queryFn: async (): Promise<CourseFile[]> => {
      if (!profile?.id) return [];

      try {
        let query = supabase
          .from('course_files')
          .select(`
            *,
            courses:course_id (
              course_name_ar,
              course_name_en,
              course_code
            )
          `)
          .eq('is_public', true);

        if (courseId) {
          query = query.eq('course_id', courseId);
        } else {
          // جلب ملفات المقررات المسجل فيها الطالب فقط
          const { data: enrollments } = await supabase
            .from('student_enrollments')
            .select('course_id')
            .eq('student_id', profile.id)
            .eq('status', 'enrolled');

          if (enrollments && enrollments.length > 0) {
            const courseIds = enrollments.map(e => e.course_id);
            query = query.in('course_id', courseIds);
          } else {
            return []; // لا توجد مقررات مسجل فيها
          }
        }

        const { data, error } = await query
          .order('created_at', { ascending: false });

        if (error) {
          console.error('خطأ في جلب ملفات المقرر للطالب:', error);
          throw error;
        }

        return (data || []) as CourseFile[];

      } catch (error) {
        console.error('خطأ في جلب ملفات المقرر للطالب:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 دقائق
    retry: 2,
  });
};

// Hook لإدارة ملفات المقررات للمسؤولين
export const useAdminCourseFiles = (courseId?: string) => {
  return useQuery({
    queryKey: ['admin-course-files', courseId],
    queryFn: async (): Promise<CourseFile[]> => {
      try {
        let query = supabase
          .from('course_files')
          .select(`
            *,
            courses:course_id (
              course_name_ar,
              course_name_en,
              course_code
            )
          `);

        if (courseId) {
          query = query.eq('course_id', courseId);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false });

        if (error) {
          console.error('خطأ في جلب ملفات المقرر للمسؤول:', error);
          throw error;
        }

        return (data || []) as CourseFile[];

      } catch (error) {
        console.error('خطأ في جلب ملفات المقرر للمسؤول:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook لرفع ملف جديد (للمسؤولين)
export const useUploadCourseFile = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileData: {
      course_id: string;
      file_name: string;
      file_path: string;
      file_size?: number;
      file_type: string;
      category?: string;
      description?: string;
      is_public?: boolean;
    }) => {
      if (!profile?.id) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const { data, error } = await supabase
        .from('course_files')
        .insert({
          ...fileData,
          uploaded_by: profile.id,
          is_public: fileData.is_public ?? true
        })
        .select()
        .single();

      if (error) {
        console.error('خطأ في رفع الملف:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('تم رفع الملف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
    },
    onError: (error: any) => {
      console.error('فشل في رفع الملف:', error);
      toast.error('فشل في رفع الملف: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لتحديث ملف (للمسؤولين)
export const useUpdateCourseFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      fileId, 
      updates 
    }: {
      fileId: string;
      updates: Partial<CourseFile>;
    }) => {
      const { data, error } = await supabase
        .from('course_files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) {
        console.error('خطأ في تحديث الملف:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('تم تحديث الملف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
    },
    onError: (error: any) => {
      console.error('فشل في تحديث الملف:', error);
      toast.error('فشل في تحديث الملف: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لحذف ملف (للمسؤولين)
export const useDeleteCourseFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('course_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('خطأ في حذف الملف:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('تم حذف الملف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-files'] });
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
    },
    onError: (error: any) => {
      console.error('فشل في حذف الملف:', error);
      toast.error('فشل في حذف الملف: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لجلب إحصائيات ملفات المقررات
export const useCourseFilesStatistics = () => {
  return useQuery({
    queryKey: ['course-files-statistics'],
    queryFn: async () => {
      try {
        // جلب إحصائيات شاملة
        const { data: allFiles, error } = await supabase
          .from('course_files')
          .select('course_id, file_type, file_size, category, is_public, created_at');

        if (error) throw error;

        const files = allFiles || [];
        
        return {
          total: files.length,
          byType: files.reduce((acc, file) => {
            const type = file.file_type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byCategory: files.reduce((acc, file) => {
            const category = file.category || 'general';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          totalSize: files.reduce((acc, file) => acc + (file.file_size || 0), 0),
          publicFiles: files.filter(f => f.is_public).length,
          privateFiles: files.filter(f => !f.is_public).length,
          recentFiles: files.filter(f => {
            const fileDate = new Date(f.created_at);
            const now = new Date();
            const diffDays = (now.getTime() - fileDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 7; // آخر أسبوع
          }).length
        };

      } catch (error) {
        console.error('خطأ في جلب إحصائيات الملفات:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 دقائق
    retry: 2,
  });
};

// Hook لتحميل ملف
export const useDownloadCourseFile = () => {
  return useMutation({
    mutationFn: async (filePath: string) => {
      try {
        // التحقق من نوع المسار - إذا كان URL كاملاً، استخدمه مباشرة
        if (filePath.startsWith('http')) {
          window.open(filePath, '_blank');
          return null;
        }

        // إذا كان مساراً لملف في Storage
        const { data, error } = await supabase.storage
          .from('course-files')
          .download(filePath);

        if (error) {
          console.error('خطأ في تحميل الملف:', error);
          // في حالة فشل التحميل من Storage، جرب الرابط المباشر
          const { data: publicUrlData } = supabase.storage
            .from('course-files')
            .getPublicUrl(filePath);
          
          if (publicUrlData.publicUrl) {
            window.open(publicUrlData.publicUrl, '_blank');
            return null;
          }
          throw error;
        }

        // إنشاء رابط التحميل من البيانات المسترجعة
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filePath.split('/').pop() || 'file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return data;
      } catch (error) {
        console.error('فشل في تحميل الملف:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('فشل في تحميل الملف:', error);
      toast.error('فشل في تحميل الملف');
    },
  });
};

// Hook للبحث في ملفات المقررات
export const useSearchCourseFiles = (
  searchQuery: string,
  filters: {
    courseId?: string;
    category?: string;
    fileType?: string;
  } = {}
) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['search-course-files', searchQuery, filters, profile?.id],
    queryFn: async (): Promise<CourseFile[]> => {
      if (!searchQuery.trim()) return [];

      try {
        let query = supabase
          .from('course_files')
          .select(`
            *,
            courses:course_id (
              course_name_ar,
              course_name_en,
              course_code
            )
          `)
          .or(`file_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

        // تطبيق الفلاتر
        if (filters.courseId) {
          query = query.eq('course_id', filters.courseId);
        }
        
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        
        if (filters.fileType) {
          query = query.eq('file_type', filters.fileType);
        }

        // للطلاب، عرض الملفات العامة فقط للمقررات المسجلين فيها
        if (profile?.role !== 'admin') {
          query = query.eq('is_public', true);
          
          const { data: enrollments } = await supabase
            .from('student_enrollments')
            .select('course_id')
            .eq('student_id', profile?.id)
            .eq('status', 'enrolled');

          if (enrollments && enrollments.length > 0) {
            const courseIds = enrollments.map(e => e.course_id);
            query = query.in('course_id', courseIds);
          } else {
            return []; // لا توجد مقررات مسجل فيها
          }
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return (data || []) as CourseFile[];

      } catch (error) {
        console.error('خطأ في البحث عن الملفات:', error);
        throw error;
      }
    },
    enabled: !!searchQuery.trim(),
    staleTime: 30 * 1000, // 30 ثانية
    retry: 1,
  });
};