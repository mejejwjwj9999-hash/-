import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface QuickStatsProps {
  className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ className }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['grades-quick-stats'],
    queryFn: async () => {
      // عدد الطلاب الإجمالي
      const { count: totalStudents } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

      // عدد المقررات
      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // عدد الدرجات المسجلة
      const { count: totalGrades } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true });

      // متوسط الدرجات العام
      const { data: gradesData } = await supabase
        .from('grades')
        .select('total_grade')
        .not('total_grade', 'is', null);

      const averageGrade = gradesData && gradesData.length > 0
        ? gradesData.reduce((sum, g) => sum + (g.total_grade || 0), 0) / gradesData.length
        : 0;

      // الطلاب المتفوقين (درجة أعلى من 85)
      const { count: excellentStudents } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true })
        .gte('total_grade', 85);

      // الطلاب المحتاجين متابعة (درجة أقل من 60)
      const { count: needsAttention } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true })
        .lt('total_grade', 60);

      return {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalGrades: totalGrades || 0,
        averageGrade: averageGrade,
        excellentStudents: excellentStudents || 0,
        needsAttention: needsAttention || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      value: stats?.totalStudents || 0,
      label: 'إجمالي الطلاب',
      color: 'text-university-blue',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BookOpen,
      value: stats?.totalCourses || 0,
      label: 'إجمالي المقررات',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: GraduationCap,
      value: stats?.totalGrades || 0,
      label: 'الدرجات المسجلة',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Award,
      value: (stats?.averageGrade || 0).toFixed(1),
      label: 'متوسط الدرجات',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: TrendingUp,
      value: stats?.excellentStudents || 0,
      label: 'الطلاب المتفوقين',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: AlertTriangle,
      value: stats?.needsAttention || 0,
      label: 'يحتاج متابعة',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-academic-gray">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};