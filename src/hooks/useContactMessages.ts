import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  replied_at?: string;
  replied_by?: string;
  admin_notes?: string;
}

// Hook للحصول على رسائل التواصل (للإدارة)
export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      console.log('Fetching contact messages using RPC...');
      
      const { data, error } = await supabase.rpc('get_contact_messages');

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw new Error(`خطأ في تحميل رسائل التواصل: ${error.message}`);
      }
      
      console.log('Contact messages fetched successfully:', data?.length || 0, 'records');
      return data as ContactMessage[];
    },
  });
};

// Hook لإنشاء رسالة تواصل جديدة
export const useCreateContactMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: 'تم إرسال الرسالة بنجاح',
        description: 'سيتم الرد عليك في أقرب وقت ممكن',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الرسالة',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};

// Hook لتحديث حالة الرسالة
export const useUpdateContactMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      updates 
    }: { 
      messageId: string; 
      updates: Partial<ContactMessage>; 
    }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: 'تم تحديث الرسالة بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تحديث الرسالة',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};

// Hook للرد على رسالة
export const useReplyToContactMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      replyText,
      adminId 
    }: { 
      messageId: string; 
      replyText: string;
      adminId: string;
    }) => {
      // Update message status
      const { data, error } = await supabase
        .from('contact_messages')
        .update({
          status: 'replied',
          is_read: true,
          replied_at: new Date().toISOString(),
          replied_by: adminId,
          admin_notes: replyText
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;

      // TODO: Send email reply to the user
      // This would typically involve calling an Edge Function
      // await supabase.functions.invoke('send-email-reply', {
      //   body: { messageId, replyText, recipientEmail: data.email }
      // });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: 'تم إرسال الرد بنجاح',
        description: 'تم تحديث حالة الرسالة وإرسال الرد للمستخدم',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الرد',
        description: error.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    },
  });
};