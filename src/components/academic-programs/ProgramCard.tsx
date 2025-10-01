import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, BookOpen, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgramCardProps {
  program: {
    id: string;
    program_key: string;
    title_ar: string;
    title_en?: string;
    summary_ar?: string;
    summary_en?: string;
    featured_image?: string;
    icon_color: string;
    background_color: string;
    duration_years: number;
    credit_hours: number;
    department_ar?: string;
    department_en?: string;
    college_ar?: string;
    college_en?: string;
    is_featured: boolean;
  };
  language?: 'ar' | 'en';
  index?: number;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  language = 'ar',
  index = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group h-full bg-card border-border/60 hover:border-primary/20 hover:shadow-university transition-all duration-500 overflow-hidden">
        {/* صورة البرنامج */}
        {program.featured_image && (
          <div className="relative overflow-hidden h-48">
            <img
              src={program.featured_image}
              alt={language === 'ar' ? program.title_ar : program.title_en || program.title_ar}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* شارة المميز */}
            {program.is_featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-secondary text-secondary-foreground shadow-soft">
                  <Star className="w-3 h-3 ml-1" />
                  مميز
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-6 space-y-4">
          {/* أيقونة البرنامج */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: program.background_color || '#f8fafc' }}
          >
            <GraduationCap
              className="w-7 h-7"
              style={{ color: program.icon_color || '#3b82f6' }}
            />
          </div>

          {/* عنوان البرنامج */}
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 line-clamp-2">
              {language === 'ar' ? program.title_ar : program.title_en || program.title_ar}
            </h3>
            
            {/* القسم والكلية */}
            {program.department_ar && (
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? program.department_ar : program.department_en || program.department_ar}
                {program.college_ar && (
                  <span className="before:content-['•'] before:mx-2">
                    {language === 'ar' ? program.college_ar : program.college_en || program.college_ar}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* وصف مختصر */}
          {(language === 'ar' ? program.summary_ar : program.summary_en) && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {language === 'ar' ? program.summary_ar : program.summary_en}
            </p>
          )}

          {/* معلومات البرنامج */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 ml-1" />
              {program.duration_years} سنوات
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <BookOpen className="w-3 h-3 ml-1" />
              {program.credit_hours} ساعة
            </Badge>
          </div>

          {/* زر التفاصيل */}
          <Button
            asChild
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mt-6"
            variant="outline"
          >
            <Link to={`/${program.program_key}`}>
              <span>عرض التفاصيل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};