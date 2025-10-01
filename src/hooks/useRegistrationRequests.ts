import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  student_id: string;
  college: string;
  department: string;
  specialization: string;
  program_id?: string;
  department_id?: string;
  academic_year: number;
  semester: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// Hook للحصول على طلبات التسجيل (للإدارة)
export const useRegistrationRequests = () => {
  return useQuery({
    queryKey: ['registration-requests'],
    queryFn: async () => {
      console.log('Fetching registration requests using RPC...');
      
      const { data, error } = await supabase.rpc('get_registration_requests');

      if (error) {
        console.error('Error fetching registration requests:', error);
        throw new Error(`خطأ في تحميل طلبات التسجيل: ${error.message}`);
      }
      
      console.log('Registration requests fetched successfully:', data?.length || 0, 'records');
      return data as RegistrationRequest[];
    },
  });
};

// Hook لإنشاء طلب تسجيل جديد
export const useCreateRegistrationRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: Omit<RegistrationRequest, 'id' | 'status' | 'created_at' | 'updated_at' | 'reviewed_at' | 'reviewed_by' | 'admin_notes' | 'rejection_reason'> & { password: string }) => {
      // تشفير كلمة المرور
      const passwordHash = await hashPassword(requestData.password);
      
      const { error } = await supabase
        .from('student_registration_requests')
        .insert([{
          first_name: requestData.first_name,
          last_name: requestData.last_name,
          email: requestData.email,
          phone: requestData.phone,
          address: requestData.address,
          student_id: requestData.student_id,
          college: requestData.college,
          department: requestData.department,
          specialization: requestData.specialization,
          program_id: requestData.program_id,
          department_id: requestData.department_id,
          academic_year: requestData.academic_year,
          semester: requestData.semester,
          password_hash: passwordHash,
        }]);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
      toast({
        title: 'تم إرسال طلب التسجيل بنجاح',
        description: 'سيتم مراجعة طلبك من قبل الإدارة وسيتم إشعارك بالنتيجة',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};

// Hook لموافقة على طلب تسجيل
export const useApproveRegistrationRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, adminId }: { requestId: string; adminId: string }) => {
      const { data, error } = await supabase.rpc('approve_student_registration', {
        request_id: requestId,
        admin_id: adminId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
      if (data?.success) {
        toast({
          title: 'تم اعتماد الطلب بنجاح',
          description: data?.message || 'تم اعتماد الطلب وسيتم إنشاء حساب الطالب لاحقاً',
        });
      } else {
        toast({
          title: 'خطأ في اعتماد الطلب',
          description: data?.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في اعتماد الطلب',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};

// Hook لرفض طلب تسجيل
export const useRejectRegistrationRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, adminId, reason }: { requestId: string; adminId: string; reason: string }) => {
      const { data, error } = await supabase.rpc('reject_student_registration', {
        request_id: requestId,
        admin_id: adminId,
        rejection_reason: reason,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['registration-requests'] });
      if (data?.success) {
        toast({
          title: 'تم رفض الطلب',
          description: 'تم إرسال إشعار للطالب بسبب الرفض',
        });
      } else {
        toast({
          title: 'خطأ في رفض الطلب',
          description: data?.error || 'حدث خطأ غير متوقع',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في رفض الطلب',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};

// وظيفة بسيطة لتشفير كلمة المرور (في الواقع يجب أن تتم في الخادم)
async function hashPassword(password: string): Promise<string> {
  // هذا مجرد تشفير بسيط للعرض - في الواقع يجب استخدام bcrypt في الخادم
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}