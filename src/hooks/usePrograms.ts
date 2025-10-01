import { useQuery } from '@tanstack/react-query';
import { 
  getAllPrograms, 
  getProgramsByDepartment, 
  getProgramName, 
  getProgramFee,
  DepartmentId, 
  ProgramId 
} from '@/domain/academics';

export const usePrograms = () => {
  return useQuery({
    queryKey: ['academic-programs'],
    queryFn: () => getAllPrograms(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useProgramsByDepartment = (departmentId: DepartmentId | null) => {
  return useQuery({
    queryKey: ['programs-by-department', departmentId],
    queryFn: () => departmentId ? getProgramsByDepartment(departmentId) : [],
    enabled: !!departmentId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useProgramName = (programId: ProgramId | null, language: 'ar' | 'en' = 'ar') => {
  return programId ? getProgramName(programId, language) : '';
};

export const useProgramFee = (programId: ProgramId | null) => {
  return programId ? getProgramFee(programId) : 0;
};