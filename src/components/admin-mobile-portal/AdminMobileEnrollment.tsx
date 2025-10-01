import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, 
  Search, 
  Users, 
  BookOpen, 
  Calendar,
  Check,
  X,
  Clock
} from 'lucide-react';

const AdminMobileEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['student-enrollments-mobile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          student_profiles!inner (
            id,
            student_id,
            first_name,
            last_name
          )
        `)
        .order('enrollment_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredEnrollments = enrollments.filter(enrollment =>
    (enrollment.student_profiles?.first_name + ' ' + enrollment.student_profiles?.last_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student_profiles?.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    active: enrollments.filter(e => e.status === 'enrolled').length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    total: enrollments.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge className="bg-green-500 text-white">مسجل</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">في الانتظار</Badge>;
      case 'dropped':
        return <Badge variant="outline" className="border-red-500 text-red-600">منسحب</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 pb-20">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-academic-gray">جاري تحميل بيانات التسجيل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <UserPlus className="h-6 w-6 text-university-blue" />
          <h1 className="text-2xl font-bold text-university-blue">إدارة التسجيل</h1>
        </div>
        <p className="text-muted-foreground">إدارة طلبات تسجيل الطلاب في المقررات</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="البحث عن تسجيل (اسم الطالب، رقم الطالب، المقرر...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 text-right"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-medium">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-university-blue">{statusCounts.total}</div>
            <div className="text-xs text-muted-foreground">إجمالي</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-medium">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-600">{statusCounts.active}</div>
            <div className="text-xs text-muted-foreground">مسجل</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-medium">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-orange-600">{statusCounts.pending}</div>
            <div className="text-xs text-muted-foreground">في الانتظار</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments List */}
      <div className="space-y-4">
        {filteredEnrollments.length === 0 ? (
          <Card className="border-0 shadow-medium">
            <CardContent className="p-8 text-center">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد طلبات تسجيل'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="border-0 shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-university-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-university-blue font-bold text-lg">
                        {enrollment.student_profiles?.first_name?.charAt(0) || 'ط'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-university-blue">
                        {enrollment.student_profiles?.first_name} {enrollment.student_profiles?.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        رقم الطالب: {enrollment.student_profiles?.student_id || 'غير محدد'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(enrollment.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-university-blue" />
                    <span className="text-muted-foreground">المقرر:</span>
                    <span className="text-university-blue font-medium">
                      مقرر رقم: {enrollment.course_id || 'غير محدد'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-university-blue" />
                    <span className="text-muted-foreground">تاريخ التسجيل:</span>
                    <span className="text-university-blue">
                      {enrollment.enrollment_date ? 
                        new Date(enrollment.enrollment_date).toLocaleDateString('ar-SA') : 
                        'غير محدد'
                      }
                    </span>
                  </div>
                </div>

                {enrollment.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Check className="h-4 w-4 ml-1" />
                      قبول
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-red-500 text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4 ml-1" />
                      رفض
                    </Button>
                  </div>
                )}

                {enrollment.status === 'enrolled' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-red-500 text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4 ml-1" />
                      إلغاء التسجيل
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMobileEnrollment;