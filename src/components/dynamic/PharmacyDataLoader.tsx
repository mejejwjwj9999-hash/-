import React, { useEffect } from 'react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { seedPharmacyData } from '@/utils/seedPharmacyData';
import { toast } from '@/hooks/use-toast';

interface PharmacyDataLoaderProps {
  children: React.ReactNode;
}

export const PharmacyDataLoader: React.FC<PharmacyDataLoaderProps> = ({ children }) => {
  const { data: program, isLoading, error } = useDynamicProgram('pharmacy');

  useEffect(() => {
    const loadPharmacyData = async () => {
      // إذا لم تكن البيانات موجودة ولا يوجد خطأ في التحميل
      if (!isLoading && !program && !error) {
        try {
          console.log('محاولة تحميل بيانات الصيدلة...');
          await seedPharmacyData();
          toast({
            title: "تم تحميل البيانات",
            description: "تم تحميل بيانات برنامج الصيدلة بنجاح",
          });
          // إعادة تحديث الصفحة لعرض البيانات الجديدة
          window.location.reload();
        } catch (error) {
          console.error('خطأ في تحميل بيانات الصيدلة:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "حدث خطأ أثناء تحميل بيانات برنامج الصيدلة",
            variant: "destructive",
          });
        }
      }
    };

    loadPharmacyData();
  }, [isLoading, program, error]);

  return <>{children}</>;
};