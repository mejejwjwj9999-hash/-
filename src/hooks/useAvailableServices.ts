
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AvailableService = {
  id: string;
  service_id: string;
  service_name: string;
  service_description: string;
  is_active: boolean;
  category: string;
  icon_name: string;
  created_at: string;
  updated_at: string;
};

export const useAvailableServices = () => {
  return useQuery({
    queryKey: ["available-services"],
    queryFn: async (): Promise<AvailableService[]> => {
      console.log("Loading available services from Supabase database");
      
      // Using any to bypass TypeScript until types are regenerated
      const { data, error } = await (supabase as any)
        .from('available_services')
        .select('*')
        .eq('is_active', true)
        .order('service_name');
      
      if (error) {
        console.error('Error fetching available services:', error);
        throw error;
      }
      
      console.log('Successfully loaded services from database:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
