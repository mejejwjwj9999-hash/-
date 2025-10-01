import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepartmentCardProps {
  department: {
    id: string;
    title: string;
    titleEn: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgGradient: string;
    href: string;
    programsCount: number;
    programs: string[];
    description: string;
    features?: string[];
  };
  language?: 'ar' | 'en';
  variant?: 'default' | 'featured';
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  language = 'ar',
  variant = 'default'
}) => {
  const IconComponent = department.icon;

  return (
    <Card className="group relative overflow-hidden bg-card border-border/60 hover:border-primary/20 transition-all duration-500 hover:shadow-university">
      {/* خلفية متدرجة للتأثير */}
      <div className={`absolute inset-0 bg-gradient-to-br ${department.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* نمط هندسي للخلفية */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full border-2 border-primary/20 rounded-full transform translate-x-8 -translate-y-8"></div>
      </div>
      
      <CardHeader className="relative z-10 pb-4">
        {/* أيقونة القسم */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${department.color} group-hover:scale-110 transition-all duration-300 shadow-soft`}>
          <IconComponent className="w-8 h-8" />
        </div>

        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 mb-2">
          {department.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground font-medium">
          {department.titleEn}
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* وصف القسم */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {department.description}
        </p>

        {/* إحصائيات القسم */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            <span>{department.programsCount} برنامج</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <span>متاح للتسجيل</span>
          </Badge>
        </div>

        {/* قائمة البرامج */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            {language === 'ar' ? 'البرامج المتاحة:' : 'Available Programs:'}
          </h4>
          <div className="space-y-2">
            {department.programs.slice(0, 3).map((program, index) => (
              <div key={index} className="flex items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-primary rounded-full ml-3 flex-shrink-0"></div>
                <span className="line-clamp-1">{program}</span>
              </div>
            ))}
            {department.programs.length > 3 && (
              <div className="text-xs text-primary font-medium">
                + {department.programs.length - 3} برامج أخرى
              </div>
            )}
          </div>
        </div>

        {/* مميزات القسم - إذا توفرت */}
        {department.features && variant === 'featured' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">مميزات القسم:</h4>
            <div className="grid grid-cols-1 gap-1.5">
              {department.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full ml-2"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زر الاستكشاف */}
        <Button
          asChild
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mt-6"
          variant="outline"
        >
          <Link to={department.href}>
            <span>{language === 'ar' ? 'استكشف القسم' : 'Explore Department'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};