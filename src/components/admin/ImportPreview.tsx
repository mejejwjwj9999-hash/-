import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface StudentRecord {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  admission_date: string;
  status: string;
}

interface ImportPreviewProps {
  data: StudentRecord[];
  onNext: () => void;
  onBack: () => void;
}

export const ImportPreview: React.FC<ImportPreviewProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const previewData = data.slice(0, 10); // عرض أول 10 صفوف فقط

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'معلق', className: 'bg-red-100 text-red-800' },
      graduated: { label: 'متخرج', className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            معاينة البيانات المستوردة
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>إجمالي السجلات: <strong>{data.length}</strong></span>
            <span>معاينة: <strong>{Math.min(10, data.length)}</strong> سجل</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطالب</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الكلية</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>السنة</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {student.student_id || <span className="text-red-500">مفقود</span>}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {student.first_name || <span className="text-red-500">مفقود</span>} {student.last_name || <span className="text-red-500">مفقود</span>}
                        </div>
                        {student.phone && (
                          <div className="text-xs text-muted-foreground">{student.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.email || <span className="text-red-500">مفقود</span>}
                    </TableCell>
                    <TableCell>
                      {student.college || <span className="text-red-500">مفقود</span>}
                    </TableCell>
                    <TableCell>
                      {student.department || <span className="text-red-500">مفقود</span>}
                    </TableCell>
                    <TableCell>
                      {student.academic_year} - الفصل {student.semester}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {data.length > 10 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              ... و {data.length - 10} سجل آخر
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي السجلات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.filter(s => s.first_name && s.last_name && s.email && s.student_id).length}
            </div>
            <div className="text-sm text-muted-foreground">سجلات مكتملة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.filter(s => !s.first_name || !s.last_name || !s.email || !s.student_id).length}
            </div>
            <div className="text-sm text-muted-foreground">سجلات ناقصة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(data.map(s => s.college)).size}
            </div>
            <div className="text-sm text-muted-foreground">عدد الكليات</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>
        <Button onClick={onNext} disabled={data.length === 0}>
          التالي: التحقق من البيانات
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};