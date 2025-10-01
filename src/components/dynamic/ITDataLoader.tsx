import React, { useEffect } from 'react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { seedITData } from '@/utils/seedITData';
import { toast } from '@/hooks/use-toast';

interface ITDataLoaderProps {
  children: React.ReactNode;
}

export const ITDataLoader: React.FC<ITDataLoaderProps> = ({ children }) => {
  const { data: program, isLoading, error } = useDynamicProgram('it');

  useEffect(() => {
    const loadITData = async () => {
      // إذا لم تكن البيانات موجودة ولا يوجد خطأ في التحميل
      if (!isLoading && !program && !error) {
        try {
          console.log('محاولة تحميل بيانات تكنولوجيا المعلومات...');
          await seedITData();
          toast({
            title: "تم تحميل البيانات",
            description: "تم تحميل بيانات برنامج تكنولوجيا المعلومات بنجاح",
          });
          // إعادة تحديث الصفحة لعرض البيانات الجديدة
          window.location.reload();
        } catch (error) {
          console.error('خطأ في تحميل بيانات تكنولوجيا المعلومات:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "حدث خطأ أثناء تحميل بيانات برنامج تكنولوجيا المعلومات",
            variant: "destructive",
          });
        }
      }
    };

    loadITData();
  }, [isLoading, program, error]);

  return <>{children}</>;
};