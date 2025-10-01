import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const useContactForm = () => {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      // Insert into contact_messages table
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'unread',
          is_read: false
        });
      
      if (error) throw error;
      return data;
    },
  });
};