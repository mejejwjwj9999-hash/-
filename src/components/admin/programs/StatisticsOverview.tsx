import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, GraduationCap, Users, TrendingUp } from 'lucide-react';
import { useDepartmentStatistics } from '@/hooks/useDepartmentPrograms';
import { Skeleton } from '@/components/ui/skeleton';

export const StatisticsOverview: React.FC = () => {
  const { data: stats, isLoading } = useDepartmentStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statisticsCards = [
    {
      title: "إجمالي الأقسام",
      value: stats?.totalDepartments || 0,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "إجمالي البرامج",
      value: stats?.totalPrograms || 0,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "البرامج النشطة",
      value: stats?.totalPrograms || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "متوسط البرامج/قسم",
      value: stats?.totalDepartments 
        ? Math.round((stats.totalPrograms / stats.totalDepartments) * 10) / 10 
        : 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
