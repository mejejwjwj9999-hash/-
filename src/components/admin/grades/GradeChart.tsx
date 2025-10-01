import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface GradeChartProps {
  type: 'distribution' | 'trends' | 'departments';
  title: string;
  className?: string;
}

export const GradeChart: React.FC<GradeChartProps> = ({ type, title, className }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['grade-chart', type],
    queryFn: async () => {
      switch (type) {
        case 'distribution':
          // توزيع الدرجات
          const { data: gradesData } = await supabase
            .from('grades')
            .select('total_grade')
            .not('total_grade', 'is', null);

          const grades = gradesData || [];
          const distribution = {
            'ممتاز (90-100)': grades.filter(g => g.total_grade >= 90).length,
            'جيد جداً (80-89)': grades.filter(g => g.total_grade >= 80 && g.total_grade < 90).length,
            'جيد (70-79)': grades.filter(g => g.total_grade >= 70 && g.total_grade < 80).length,
            'مقبول (60-69)': grades.filter(g => g.total_grade >= 60 && g.total_grade < 70).length,
            'راسب (أقل من 60)': grades.filter(g => g.total_grade < 60).length,
          };

          return Object.entries(distribution).map(([name, value]) => ({ name, value }));

        case 'trends':
          // اتجاهات الدرجات حسب الفصول
          const { data: trendsData } = await supabase
            .from('grades')
            .select('total_grade, academic_year, semester')
            .not('total_grade', 'is', null)
            .order('academic_year')
            .order('semester');

          const trendsByPeriod = (trendsData || []).reduce((acc: any, grade) => {
            const period = `${grade.academic_year} - ف${grade.semester}`;
            if (!acc[period]) {
              acc[period] = { period, total: 0, count: 0 };
            }
            acc[period].total += grade.total_grade;
            acc[period].count += 1;
            return acc;
          }, {});

          return Object.values(trendsByPeriod).map((item: any) => ({
            period: item.period,
            average: (item.total / item.count).toFixed(1)
          }));

        case 'departments':
          // الدرجات حسب الأقسام
          const { data: deptData } = await supabase
            .from('grades')
            .select(`
              total_grade,
              courses!grades_course_id_fkey (department)
            `)
            .not('total_grade', 'is', null);

          const deptGrades = (deptData || []).reduce((acc: any, grade) => {
            const dept = grade.courses?.department || 'غير محدد';
            if (!acc[dept]) {
              acc[dept] = { department: dept, total: 0, count: 0 };
            }
            acc[dept].total += grade.total_grade;
            acc[dept].count += 1;
            return acc;
          }, {});

          return Object.values(deptGrades).map((item: any) => ({
            department: item.department,
            average: (item.total / item.count).toFixed(1)
          }));

        default:
          return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'departments':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div>نوع الرسم البياني غير مدعوم</div>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-university-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          renderChart()
        ) : (
          <div className="h-64 flex items-center justify-center text-academic-gray">
            لا توجد بيانات لعرضها
          </div>
        )}
      </CardContent>
    </Card>
  );
};