import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProgramId } from '@/domain/academics';

export const useProgramFees = (programId?: ProgramId, academicYear?: number, semester?: number) => {
  return useQuery({
    queryKey: ['program-fees', programId, academicYear, semester],
    queryFn: async () => {
      let query = supabase
        .from('program_fees')
        .select('*')
        .eq('is_active', true);

      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (academicYear) {
        query = query.eq('academic_year', academicYear);
      }
      if (semester) {
        query = query.eq('semester', semester);
      }

      const { data, error } = await query.order('academic_year').order('semester');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!programId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useProgramFee = (programId: ProgramId, academicYear: number, semester: number) => {
  return useQuery({
    queryKey: ['program-fee', programId, academicYear, semester],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('program_fees')
        .select('*')
        .eq('program_id', programId)
        .eq('academic_year', academicYear)
        .eq('semester', semester)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const calculateProgramTotalFee = (feeData: any) => {
  if (!feeData) return 0;
  return (
    (feeData.base_fee || 0) +
    (feeData.registration_fee || 0) +
    (feeData.library_fee || 0) +
    (feeData.lab_fee || 0) +
    (feeData.exam_fee || 0)
  );
};