import React from 'react';
import { useDynamicPrograms } from '@/hooks/useDynamicPrograms';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProgramCard } from '@/components/academic-programs/ProgramCard';

interface DynamicAcademicProgramsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  language?: 'ar' | 'en';
}

export const DynamicAcademicPrograms: React.FC<DynamicAcademicProgramsProps> = ({
  limit,
  showViewAll = true,
  className = '',
  language = 'ar'
}) => {
  const { data: programs, isLoading, error } = useDynamicPrograms();

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(limit || 6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-12 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-destructive">حدث خطأ في تحميل البرامج الأكاديمية</div>
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <div className="text-muted-foreground">لا توجد برامج أكاديمية متاحة حالياً</div>
      </div>
    );
  }

  const displayPrograms = limit ? programs.slice(0, limit) : programs;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={className}>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayPrograms.map((program, index) => (
          <ProgramCard
            key={program.id}
            program={program}
            language={language}
            index={index}
          />
        ))}
      </motion.div>

      {/* رابط عرض الكل */}
      {showViewAll && limit && programs.length > limit && (
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild variant="university" size="lg">
            <Link to="/programs">
              عرض جميع البرامج الأكاديمية
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};