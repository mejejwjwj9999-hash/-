import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';

interface CoursesHeaderProps {
  totalCourses: number;
  totalStudents: number;
  totalHours: number;
  activeCoursesPercentage: number;
}

export const CoursesHeader: React.FC<CoursesHeaderProps> = ({
  totalCourses,
  totalStudents,
  totalHours,
  activeCoursesPercentage
}) => {
  const stats = [
    {
      id: 1,
      title: 'إجمالي المقررات',
      value: totalCourses,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'مقرر دراسي'
    },
    {
      id: 2,
      title: 'الطلاب المسجلون',
      value: totalStudents,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'طالب وطالبة'
    },
    {
      id: 3,
      title: 'الساعات المعتمدة',
      value: totalHours,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'ساعة معتمدة'
    },
    {
      id: 4,
      title: 'المقررات النشطة',
      value: `${activeCoursesPercentage}%`,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      description: 'من الإجمالي'
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* عنوان القسم */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary">إدارة المقررات الدراسية</h1>
        <p className="text-muted-foreground">نظام شامل لإدارة وتنظيم المقررات الدراسية</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.id} 
            className="relative overflow-hidden border-0 shadow-elegant hover:shadow-university transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
