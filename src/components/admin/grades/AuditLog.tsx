import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, Search, Filter, Download, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AuditEntry {
  id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  user_id: string;
  user_email: string;
  user_name: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [tableFilter, setTableFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // جلب سجل العمليات (محاكاة - يجب إنشاء جدول audit_logs في قاعدة البيانات)
  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', searchTerm, actionFilter, tableFilter, userFilter, dateRange],
    queryFn: async () => {
      // في التطبيق الفعلي، يجب إنشاء جدول audit_logs
      // const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
      
      // محاكاة بيانات سجل العمليات
      const mockData: AuditEntry[] = [
        {
          id: '1',
          action: 'INSERT',
          table_name: 'grades',
          record_id: 'grade_123',
          old_values: null,
          new_values: {
            student_id: 'student_456',
            course_id: 'course_789',
            total_grade: 85,
            letter_grade: 'B+',
            gpa_points: 3.3
          },
          user_id: 'admin_1',
          user_email: 'admin@university.edu',
          user_name: 'مدير النظام',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          action: 'UPDATE',
          table_name: 'grades',
          record_id: 'grade_124',
          old_values: {
            total_grade: 80,
            letter_grade: 'B',
            gpa_points: 3.0
          },
          new_values: {
            total_grade: 88,
            letter_grade: 'B+',
            gpa_points: 3.3
          },
          user_id: 'registrar_1',
          user_email: 'registrar@university.edu',
          user_name: 'مسجل الجامعة',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ip_address: '192.168.1.101'
        },
        {
          id: '3',
          action: 'DELETE',
          table_name: 'grades',
          record_id: 'grade_125',
          old_values: {
            student_id: 'student_457',
            course_id: 'course_790',
            total_grade: 45,
            letter_grade: 'F',
            gpa_points: 0.0
          },
          new_values: null,
          user_id: 'admin_1',
          user_email: 'admin@university.edu',
          user_name: 'مدير النظام',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ip_address: '192.168.1.100'
        },
        {
          id: '4',
          action: 'BULK_INSERT',
          table_name: 'grades',
          record_id: 'bulk_operation_1',
          old_values: null,
          new_values: {
            records_count: 45,
            course_code: 'CS101',
            semester: 'الأول',
            academic_year: '2024-2025'
          },
          user_id: 'registrar_1',
          user_email: 'registrar@university.edu',
          user_name: 'مسجل الجامعة',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          ip_address: '192.168.1.101'
        }
      ];

      // تطبيق الفلاتر
      let filteredData = mockData;

      if (searchTerm) {
        filteredData = filteredData.filter(entry => 
          entry.user_name.includes(searchTerm) ||
          entry.user_email.includes(searchTerm) ||
          entry.record_id.includes(searchTerm)
        );
      }

      if (actionFilter) {
        filteredData = filteredData.filter(entry => entry.action === actionFilter);
      }

      if (tableFilter) {
        filteredData = filteredData.filter(entry => entry.table_name === tableFilter);
      }

      if (userFilter) {
        filteredData = filteredData.filter(entry => entry.user_id === userFilter);
      }

      return filteredData;
    },
    staleTime: 2 * 60 * 1000,
  });

  const getActionDisplayName = (action: string) => {
    const actions: Record<string, { name: string; color: string }> = {
      'INSERT': { name: 'إضافة', color: 'bg-green-100 text-green-800' },
      'UPDATE': { name: 'تعديل', color: 'bg-blue-100 text-blue-800' },
      'DELETE': { name: 'حذف', color: 'bg-red-100 text-red-800' },
      'BULK_INSERT': { name: 'إضافة جماعية', color: 'bg-purple-100 text-purple-800' },
      'BULK_UPDATE': { name: 'تعديل جماعي', color: 'bg-orange-100 text-orange-800' },
      'LOGIN': { name: 'تسجيل دخول', color: 'bg-gray-100 text-gray-800' },
      'LOGOUT': { name: 'تسجيل خروج', color: 'bg-gray-100 text-gray-800' }
    };
    return actions[action] || { name: action, color: 'bg-gray-100 text-gray-800' };
  };

  const getTableDisplayName = (tableName: string) => {
    const tables: Record<string, string> = {
      'grades': 'الدرجات',
      'students': 'الطلاب',
      'courses': 'المقررات',
      'admin_users': 'المسؤولين',
      'audit_logs': 'سجل العمليات'
    };
    return tables[tableName] || tableName;
  };

  const exportAuditLog = () => {
    // تصدير سجل العمليات (يمكن تطويره لاحقاً)
    console.log('تصدير سجل العمليات...');
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue flex items-center gap-2">
            <FileText className="h-6 w-6" />
            سجل العمليات
          </h2>
          <p className="text-academic-gray">تتبع جميع العمليات والتغييرات في النظام</p>
        </div>
        
        <Button onClick={exportAuditLog} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          تصدير السجل
        </Button>
      </div>

      {/* أدوات البحث والفلترة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في أسماء المستخدمين أو معرفات السجلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* الفلاتر */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>نوع العملية</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع العمليات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع العمليات</SelectItem>
                  <SelectItem value="INSERT">إضافة</SelectItem>
                  <SelectItem value="UPDATE">تعديل</SelectItem>
                  <SelectItem value="DELETE">حذف</SelectItem>
                  <SelectItem value="BULK_INSERT">إضافة جماعية</SelectItem>
                  <SelectItem value="BULK_UPDATE">تعديل جماعي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الجدول</Label>
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الجداول" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الجداول</SelectItem>
                  <SelectItem value="grades">الدرجات</SelectItem>
                  <SelectItem value="students">الطلاب</SelectItem>
                  <SelectItem value="courses">المقررات</SelectItem>
                  <SelectItem value="admin_users">المسؤولين</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>

          {/* إحصائيات البحث */}
          <div className="text-sm text-gray-600">
            عرض {auditLogs.length} عملية
          </div>
        </CardContent>
      </Card>

      {/* قائمة سجل العمليات */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-university-blue mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">جاري التحميل...</p>
            </CardContent>
          </Card>
        ) : auditLogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">لا توجد عمليات مطابقة للبحث</p>
            </CardContent>
          </Card>
        ) : (
          auditLogs.map((entry) => {
            const actionInfo = getActionDisplayName(entry.action);
            return (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={actionInfo.color}>
                        {actionInfo.name}
                      </Badge>
                      <Badge variant="outline">
                        {getTableDisplayName(entry.table_name)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm', { locale: ar })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{entry.user_name}</span>
                      </div>
                      <div className="text-sm text-gray-600">{entry.user_email}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">معرف السجل: </span>
                        <span className="font-mono">{entry.record_id}</span>
                      </div>
                      {entry.ip_address && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">عنوان IP: </span>
                          {entry.ip_address}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل التغييرات */}
                  {(entry.old_values || entry.new_values) && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">تفاصيل التغييرات:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {entry.old_values && (
                          <div>
                            <div className="font-medium text-red-600 mb-1">القيم السابقة:</div>
                            <div className="bg-red-50 p-2 rounded border">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(entry.old_values, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {entry.new_values && (
                          <div>
                            <div className="font-medium text-green-600 mb-1">القيم الجديدة:</div>
                            <div className="bg-green-50 p-2 rounded border">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(entry.new_values, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};