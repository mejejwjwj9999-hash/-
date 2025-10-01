import React, { useEffect } from 'react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { seedMidwiferyData } from '@/utils/seedMidwiferyData';
import { toast } from '@/hooks/use-toast';

interface MidwiferyDataLoaderProps {
  children: React.ReactNode;
}

export const MidwiferyDataLoader: React.FC<MidwiferyDataLoaderProps> = ({ children }) => {
  const { data: program, isLoading, error } = useDynamicProgram('midwifery');

  useEffect(() => {
    const loadMidwiferyData = async () => {
      // إذا لم تكن البيانات موجودة ولا يوجد خطأ في التحميل
      if (!isLoading && !program && !error) {
        try {
          console.log('محاولة تحميل بيانات القبالة...');
          await seedMidwiferyData();
          toast({
            title: "تم تحميل البيانات",
            description: "تم تحميل بيانات برنامج تقنيات القبالة بنجاح",
          });
          // إعادة تحديث الصفحة لعرض البيانات الجديدة
          window.location.reload();
        } catch (error) {
          console.error('خطأ في تحميل بيانات القبالة:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "حدث خطأ أثناء تحميل بيانات برنامج تقنيات القبالة",
            variant: "destructive",
          });
        }
      }
    };

    loadMidwiferyData();
  }, [isLoading, program, error]);

  return <>{children}</>;
};