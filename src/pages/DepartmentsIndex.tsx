import React, { useEffect } from 'react';
import { Laptop, Briefcase, Heart, Home, GraduationCap, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { DepartmentHero } from '@/components/departments/DepartmentHero';
import { DepartmentCard } from '@/components/departments/DepartmentCard';
import { DepartmentFeatures } from '@/components/departments/DepartmentFeatures';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';
import { useActiveAcademicDepartments } from '@/hooks/useAcademicDepartments';
import { seedAcademicDepartments } from '@/utils/seedAcademicDepartments';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, any> = {
  'Laptop': Laptop,
  'Briefcase': Briefcase,
  'Heart': Heart,
  'GraduationCap': GraduationCap
};

const DepartmentsIndex = () => {
  const { data: departments, isLoading } = useActiveAcademicDepartments();

  useEffect(() => {
    // رفع البيانات الأولية عند أول تحميل للصفحة
    const initializeDepartments = async () => {
      try {
        await seedAcademicDepartments();
      } catch (error) {
        console.error('Error initializing departments:', error);
      }
    };
    initializeDepartments();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeroSection
        icon={GraduationCap}
        title="الأقسام الأكاديمية"
        subtitle="استكشف برامجنا التعليمية المتنوعة المصممة لإعداد جيل من الخريجين المؤهلين والمبدعين"
        badges={[
          { icon: BookOpen, text: "3 أقسام أكاديمية" },
          { icon: Users, text: "أكثر من 250 طالب" },
          { icon: GraduationCap, text: "برامج معتمدة" }
        ]}
        primaryCta={{ text: "استكشف الأقسام", href: "#departments" }}
        secondaryCta={{ text: "تواصل معنا", href: "/contact" }}
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: "الرئيسية", href: "/", icon: Home },
              { label: "الأقسام الأكاديمية", icon: GraduationCap }
            ]}
          />
        }
      />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Departments Grid */}
        {!isLoading && departments && departments.length > 0 && (
          <motion.div
            id="departments"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {departments.map((dept) => {
              const IconComponent = iconMap[dept.icon_name] || GraduationCap;
              const departmentData = {
                id: dept.department_key,
                title: dept.name_ar,
                titleEn: dept.name_en || '',
                icon: IconComponent,
                color: 'bg-blue-50 text-blue-600',
                bgGradient: 'from-blue-500 to-blue-600',
                href: dept.metadata?.href || `/departments/${dept.department_key}`,
                programsCount: dept.metadata?.programsCount || 0,
                programs: dept.metadata?.programs || [],
                description: dept.description_ar || '',
                features: dept.metadata?.features || []
              };

              return (
                <motion.div key={dept.id} variants={itemVariants}>
                  <DepartmentCard 
                    department={departmentData}
                    language="ar"
                    variant="featured"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* No Data State */}
        {!isLoading && (!departments || departments.length === 0) && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد أقسام أكاديمية متاحة حالياً</p>
          </div>
        )}

        {/* Features Section */}
        <DepartmentFeatures language="ar" />
      </div>
    </div>
  );
};

export default DepartmentsIndex;