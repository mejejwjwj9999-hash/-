import { seedITData } from './seedITData';
import { seedBusinessData } from './seedBusinessData';
import { seedNursingData } from './seedNursingData';
import { seedMidwiferyData } from './seedMidwiferyData';
import { seedPharmacyData } from './seedPharmacyData';
import { toast } from '@/hooks/use-toast';

export const seedAllProgramsData = async () => {
  try {
    console.log('بدء تحميل بيانات جميع البرامج الأكاديمية...');
    
    const results = await Promise.allSettled([
      seedITData(),
      seedBusinessData(),
      seedNursingData(),
      seedMidwiferyData(),
      seedPharmacyData()
    ]);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    if (failed > 0) {
      console.warn(`تم تحميل ${successful} برامج بنجاح، فشل في تحميل ${failed} برامج`);
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`فشل تحميل البرنامج رقم ${index + 1}:`, result.reason);
        }
      });
    } else {
      console.log('تم تحميل جميع البرامج الأكاديمية بنجاح');
    }

    toast({
      title: "تم تحميل البيانات",
      description: `تم تحميل ${successful} برامج أكاديمية بنجاح${failed > 0 ? ` وفشل في تحميل ${failed} برامج` : ''}`,
      variant: failed > 0 ? "destructive" : "default"
    });

    return { successful, failed, results };
  } catch (error) {
    console.error('خطأ في تحميل بيانات البرامج:', error);
    toast({
      title: "خطأ في تحميل البيانات",
      description: "حدث خطأ أثناء تحميل بيانات البرامج الأكاديمية",
      variant: "destructive"
    });
    throw error;
  }
};