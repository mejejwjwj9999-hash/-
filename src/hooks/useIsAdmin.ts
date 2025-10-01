
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = (userId?: string | null) => {
  return useQuery({
    queryKey: ["is-admin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase.rpc("is_admin", { _user_id: userId });
      if (error) {
        console.error("is_admin RPC error:", error);
        return false;
      }
      return Boolean(data);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1m
  });
};
