
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Download,
  Clock,
  BookOpen,
  GraduationCap,
  ClipboardList,
  FileCheck
} from 'lucide-react';

interface QuickActionsCardProps {
  onAction: (action: string) => void;
}

const QuickActionsCard = ({ onAction }: QuickActionsCardProps) => {
  const quickActions = [
    {
      id: 'requests',
      title: 'طلباتي',
      description: 'متابعة حالة الطلبات',
      icon: ClipboardList,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onAction('requests')
    },
    {
      id: 'documents',
      title: 'الوثائق والمستندات',
      description: 'عرض وتحميل الوثائق',
      icon: FileCheck,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => onAction('documents')
    },
    {
      id: 'new-document',
      title: 'طلب وثيقة جديدة',
      description: 'طلب شهادات ووثائق',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onAction('new-document')
    },
    {
      id: 'grades',
      title: 'كشف الدرجات',
      description: 'عرض وطباعة الدرجات',
      icon: GraduationCap,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onAction('grades')
    },
    {
      id: 'schedule',
      title: 'الجدول الدراسي',
      description: 'عرض الجدول الأسبوعي',
      icon: Calendar,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => onAction('schedule')
    },
    {
      id: 'payment',
      title: 'دفع الرسوم',
      description: 'دفع الرسوم المستحقة',
      icon: CreditCard,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => onAction('financial')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => {
                  console.log('تم النقر على الإجراء السريع:', action.id, action.title);
                  action.action();
                }}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
