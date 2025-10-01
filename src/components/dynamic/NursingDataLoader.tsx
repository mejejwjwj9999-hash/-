import React, { useEffect } from 'react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { seedNursingData } from '@/utils/seedNursingData';
import { toast } from '@/hooks/use-toast';

interface NursingDataLoaderProps {
  children: React.ReactNode;
}

export const NursingDataLoader: React.FC<NursingDataLoaderProps> = ({ children }) => {
  const { data: program, isLoading, error } = useDynamicProgram('nursing');

  useEffect(() => {
    const loadNursingData = async () => {
      // إذا لم تكن البيانات موجودة ولا يوجد خطأ في التحميل
      if (!isLoading && !program && !error) {
        try {
          console.log('محاولة تحميل بيانات التمريض...');
          await seedNursingData();
          toast({
            title: "تم تحميل البيانات",
            description: "تم تحميل بيانات برنامج التمريض بنجاح",
          });
          // إعادة تحديث الصفحة لعرض البيانات الجديدة
          window.location.reload();
        } catch (error) {
          console.error('خطأ في تحميل بيانات التمريض:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "حدث خطأ أثناء تحميل بيانات برنامج التمريض",
            variant: "destructive",
          });
        }
      }
    };

    loadNursingData();
  }, [isLoading, program, error]);

  return <>{children}</>;
};