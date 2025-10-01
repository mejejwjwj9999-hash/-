import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EventRegistrationData {
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export const useEventRegistrations = (eventId: string) => {
  return useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (registrationData: EventRegistrationData) => {
      // Get current student profile if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      let studentId = null;
      if (user) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        studentId = profile?.id;
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{
          ...registrationData,
          student_id: studentId,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
      toast.success('تم التسجيل في الفعالية بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في التسجيل: ' + error.message);
    }
  });
};

export const useCheckRegistration = (eventId: string) => {
  return useQuery({
    queryKey: ['check-registration', eventId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return false;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('student_id', profile.id)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!eventId,
  });
};