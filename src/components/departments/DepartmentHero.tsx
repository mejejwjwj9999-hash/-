import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepartmentHeroProps {
  title: string;
  description: string;
  totalDepartments: number;
  totalPrograms: number;
  language?: 'ar' | 'en';
}

export const DepartmentHero: React.FC<DepartmentHeroProps> = ({
  title,
  description,
  totalDepartments,
  totalPrograms,
  language = 'ar'
}) => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 overflow-hidden">
      {/* خلفية تفاعلية */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 -translate-y-16"></div>
      </div>
      
      {/* نمط هندسي */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* أيقونة رئيسية */}
          <motion.div 
            className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h1>

          {/* الوصف */}
          <motion.p 
            className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>

          {/* الإحصائيات */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base">
              <Users className="w-5 h-5 ml-2" />
              {totalDepartments} أقسام أكاديمية
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base">
              <GraduationCap className="w-5 h-5 ml-2" />
              {totalPrograms} برامج متخصصة
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base">
              <BookOpen className="w-5 h-5 ml-2" />
              معتمدة أكاديمياً
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};