import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  GraduationCap,
  Calendar,
  DollarSign,
  Bell,
  FileText,
  Settings,
  Database,
  BarChart3,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface AdminMobileQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const AdminMobileQuickActions = ({ onTabChange }: AdminMobileQuickActionsProps) => {
  const quickActions = [
    {
      category: "إدارة الأشخاص",
      color: "university-blue",
      actions: [
        { id: 'view-students', label: 'عرض الطلاب', icon: Eye, tab: 'students', count: '1,245' },
        { id: 'add-student', label: 'إضافة طالب', icon: Plus, tab: 'students' },
        { id: 'view-teachers', label: 'عرض المعلمين', icon: UserCheck, tab: 'teachers', count: '89' },
        { id: 'add-teacher', label: 'إضافة معلم', icon: Plus, tab: 'teachers' }
      ]
    },
    {
      category: "إدارة الأكاديميات",
      color: "green",
      actions: [
        { id: 'view-courses', label: 'عرض المقررات', icon: BookOpen, tab: 'courses', count: '156' },
        { id: 'add-course', label: 'إضافة مقرر', icon: Plus, tab: 'courses' },
        { id: 'manage-schedules', label: 'إدارة الجداول', icon: Calendar, tab: 'schedules' },
        { id: 'manage-grades', label: 'إدارة الدرجات', icon: GraduationCap, tab: 'grades' }
      ]
    },
    {
      category: "المالية والإدارة",
      color: "purple",
      actions: [
        { id: 'view-payments', label: 'عرض المدفوعات', icon: DollarSign, tab: 'payments', count: '₹2.5M' },
        { id: 'financial-reports', label: 'التقارير المالية', icon: BarChart3, tab: 'reports' },
        { id: 'send-notifications', label: 'إرسال إشعارات', icon: Bell, tab: 'notifications' },
        { id: 'system-settings', label: 'إعدادات النظام', icon: Settings, tab: 'settings' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, any> = {
      'university-blue': {
        border: 'border-university-blue/20',
        bg: 'bg-university-blue/5',
        text: 'text-university-blue',
        hover: 'hover:bg-university-blue/10'
      },
      'green': {
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-600',
        hover: 'hover:bg-green-100'
      },
      'purple': {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      }
    };
    return colorMap[color] || colorMap['university-blue'];
  };

  return (
    <div className="space-y-4">
      {quickActions.map((category) => {
        const colors = getColorClasses(category.color);
        
        return (
          <Card key={category.category} className="border-0 shadow-lg overflow-hidden">
            <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
              <CardTitle className={`text-sm font-semibold ${colors.text} text-right`}>
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {category.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    onClick={() => onTabChange(action.tab)}
                    className={`h-auto p-3 ${colors.border} ${colors.hover} border transition-all duration-200 rounded-lg`}
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      <div className={`p-2 ${colors.bg} rounded-lg mb-2`}>
                        <action.icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <span className={`text-xs font-medium ${colors.text} mb-1`}>
                        {action.label}
                      </span>
                      {action.count && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs px-1.5 py-0.5 ${colors.bg} ${colors.text} border-0`}
                        >
                          {action.count}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* System Overview Quick Access */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
          <CardTitle className="text-sm font-semibold text-orange-600 text-right">
            أدوات سريعة للنظام
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              onClick={() => onTabChange('reports')}
              className="h-auto p-2 border border-orange-200 hover:bg-orange-50 transition-all duration-200 rounded-lg"
            >
              <div className="flex flex-col items-center text-center w-full">
                <Search className="h-4 w-4 text-orange-600 mb-1" />
                <span className="text-xs font-medium text-orange-600">بحث</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onTabChange('reports')}
              className="h-auto p-2 border border-orange-200 hover:bg-orange-50 transition-all duration-200 rounded-lg"
            >
              <div className="flex flex-col items-center text-center w-full">
                <Filter className="h-4 w-4 text-orange-600 mb-1" />
                <span className="text-xs font-medium text-orange-600">فلترة</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onTabChange('reports')}
              className="h-auto p-2 border border-orange-200 hover:bg-orange-50 transition-all duration-200 rounded-lg"
            >
              <div className="flex flex-col items-center text-center w-full">
                <Download className="h-4 w-4 text-orange-600 mb-1" />
                <span className="text-xs font-medium text-orange-600">تصدير</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMobileQuickActions;