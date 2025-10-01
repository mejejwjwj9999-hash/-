
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useServiceRequests = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['service-requests', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const createServiceRequest = useMutation({
    mutationFn: async (requestData: {
      title: string;
      description: string;
      service_type: string;
      priority?: string;
      attachment_url?: string;
      additional_data?: any;
    }) => {
      if (!profile?.id) throw new Error('No profile found');
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          student_id: profile.id,
          ...requestData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast({
        title: 'تم إرسال الطلب',
        description: 'سيتم مراجعة طلبك والرد عليه قريباً',
      });
    },
    onError: (error) => {
      console.error('Error creating service request:', error);
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    },
  });

  return {
    ...query,
    createServiceRequest,
  };
};
