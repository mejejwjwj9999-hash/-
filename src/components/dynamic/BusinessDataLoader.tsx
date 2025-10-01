import React, { useEffect } from 'react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { seedBusinessData } from '@/utils/seedBusinessData';
import { toast } from '@/hooks/use-toast';

interface BusinessDataLoaderProps {
  children: React.ReactNode;
}

export const BusinessDataLoader: React.FC<BusinessDataLoaderProps> = ({ children }) => {
  const { data: program, isLoading, error } = useDynamicProgram('business');

  useEffect(() => {
    const loadBusinessData = async () => {
      // إذا لم تكن البيانات موجودة ولا يوجد خطأ في التحميل
      if (!isLoading && !program && !error) {
        try {
          console.log('محاولة تحميل بيانات إدارة الأعمال...');
          await seedBusinessData();
          toast({
            title: "تم تحميل البيانات",
            description: "تم تحميل بيانات برنامج إدارة الأعمال بنجاح",
          });
          // إعادة تحديث الصفحة لعرض البيانات الجديدة
          window.location.reload();
        } catch (error) {
          console.error('خطأ في تحميل بيانات إدارة الأعمال:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "حدث خطأ أثناء تحميل بيانات برنامج إدارة الأعمال",
            variant: "destructive",
          });
        }
      }
    };

    loadBusinessData();
  }, [isLoading, program, error]);

  return <>{children}</>;
};