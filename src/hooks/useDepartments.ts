import { useQuery } from '@tanstack/react-query';
import { getAllDepartments, getDepartmentName, DepartmentId } from '@/domain/academics';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['academic-departments'],
    queryFn: () => getAllDepartments(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useDepartmentName = (departmentId: DepartmentId | null, language: 'ar' | 'en' = 'ar') => {
  return departmentId ? getDepartmentName(departmentId, language) : '';
};