import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Laptop, Briefcase, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import { DepartmentCard } from '@/components/departments/DepartmentCard';

interface DepartmentsSectionProps {
  language?: 'ar' | 'en';
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ language = 'ar' }) => {
  const departments = [
    {
      id: 'tech_science',
      title: language === 'ar' ? 'قسم العلوم التقنية والحاسوب' : 'Technical & Computer Sciences Department',
      icon: Laptop,
      color: 'bg-blue-50 text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
      href: '/departments/tech-science',
      programs: [
        language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology'
      ],
      description: language === 'ar' 
        ? 'يضم القسم برامج متخصصة في علوم الحاسوب والتكنولوجيا المتقدمة'
        : 'The department includes specialized programs in computer science and advanced technology'
    },
    {
      id: 'admin_humanities',
      title: language === 'ar' ? 'قسم العلوم الإدارية والإنسانية' : 'Administrative & Humanities Department',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600',
      bgGradient: 'from-amber-500 to-orange-500',
      href: '/departments/admin-humanities',
      programs: [
        language === 'ar' ? 'إدارة الأعمال' : 'Business Administration'
      ],
      description: language === 'ar' 
        ? 'يقدم القسم برامج في الإدارة والأعمال والعلوم الإنسانية'
        : 'The department offers programs in management, business, and humanities'
    },
    {
      id: 'medical',
      title: language === 'ar' ? 'قسم العلوم الطبية' : 'Medical Sciences Department',
      icon: Heart,
      color: 'bg-red-50 text-red-600',
      bgGradient: 'from-red-500 to-pink-500',
      href: '/departments/medical',
      programs: [
        language === 'ar' ? 'التمريض' : 'Nursing',
        language === 'ar' ? 'الصيدلة' : 'Pharmacy',
        language === 'ar' ? 'القبالة' : 'Midwifery'
      ],
      description: language === 'ar' 
        ? 'يضم القسم برامج طبية متخصصة في الرعاية الصحية'
        : 'The department includes specialized medical programs in healthcare'
    }
  ];

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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <EditableContent 
              pageKey="homepage" 
              elementKey="departments_title" 
              elementType="text"
              fallback={language === 'ar' ? 'الأقسام الأكاديمية' : 'Academic Departments'}
              language={language}
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="departments_description" 
              elementType="text"
              fallback={language === 'ar' 
                ? 'أقسام أكاديمية متنوعة تضم برامج معتمدة ومصممة لإعداد خريجين مؤهلين لسوق العمل'
                : 'Diverse academic departments with accredited programs designed to prepare qualified graduates for the job market'
              }
              language={language}
            />
          </p>
        </div>

        {/* Departments Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {departments.map((department, index) => (
            <motion.div key={department.id} variants={itemVariants}>
              <DepartmentCard 
                department={{
                  ...department,
                  titleEn: department.title,
                  programsCount: department.programs.length
                }}
                language={language}
                variant="default"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Departments Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button asChild variant="university" size="lg">
            <Link to="/departments">
              {language === 'ar' ? 'عرض جميع الأقسام الأكاديمية' : 'View All Academic Departments'}
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};