import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  XCircle
} from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

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

interface ImportValidationProps {
  errors: ValidationError[];
  data: StudentRecord[];
  onNext: () => void;
  onBack: () => void;
  hasErrors: boolean;
}

export const ImportValidation: React.FC<ImportValidationProps> = ({
  errors,
  data,
  onNext,
  onBack,
  hasErrors,
}) => {
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const validRecords = data.length - new Set(errors.filter(e => e.severity === 'error').map(e => e.row)).size;

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  const getFieldName = (field: string) => {
    const fieldNames: Record<string, string> = {
      student_id: 'رقم الطالب',
      first_name: 'الاسم الأول',
      last_name: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      college: 'الكلية',
      department: 'القسم',
      academic_year: 'السنة الأكاديمية',
      semester: 'الفصل',
      admission_date: 'تاريخ القبول',
      status: 'الحالة',
    };
    return fieldNames[field] || field;
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validRecords}</div>
            <div className="text-sm text-muted-foreground">سجلات صحيحة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-muted-foreground">أخطاء</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
            <div className="text-sm text-muted-foreground">تحذيرات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي السجلات</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      {hasErrors ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            يوجد {errorCount} خطأ يجب إصلاحه قبل المتابعة. لن يتم استيراد السجلات التي تحتوي على أخطاء.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            جميع البيانات صحيحة! يمكنك المتابعة للاستيراد.
            {warningCount > 0 && ` يوجد ${warningCount} تحذير لكن يمكن المتابعة.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Errors and Warnings */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              الأخطاء والتحذيرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصف</TableHead>
                    <TableHead>الحقل</TableHead>
                    <TableHead>الرسالة</TableHead>
                    <TableHead>النوع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.slice(0, 50).map((error, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {error.row}
                      </TableCell>
                      <TableCell>
                        {getFieldName(error.field)}
                      </TableCell>
                      <TableCell>
                        {error.message}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={error.severity === 'error' ? 'destructive' : 'secondary'}
                          className={
                            error.severity === 'error' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-orange-100 text-orange-800'
                          }
                        >
                          {error.severity === 'error' ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {error.severity === 'error' ? 'خطأ' : 'تحذير'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {errors.length > 50 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                ... و {errors.length - 50} خطأ/تحذير آخر
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Guidance */}
      {hasErrors && (
        <Card>
          <CardHeader>
            <CardTitle>كيفية إصلاح الأخطاء</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • تأكد من أن جميع الحقول المطلوبة مملوءة (رقم الطالب، الاسم، البريد الإلكتروني، الكلية، القسم)
            </p>
            <p className="text-sm text-muted-foreground">
              • تحقق من صحة تنسيق البريد الإلكتروني
            </p>
            <p className="text-sm text-muted-foreground">
              • تأكد من عدم وجود تكرار في أرقام الطلاب أو البريد الإلكتروني (في الملف أو قاعدة البيانات)
            </p>
            <p className="text-sm text-muted-foreground">
              • تحقق من أن حالة الطالب صحيحة (active, inactive, suspended, graduated)
            </p>
            <p className="text-sm text-muted-foreground">
              • تأكد من أن السنة الأكاديمية بين 1-6 والفصل 1 أو 2
            </p>
            <p className="text-sm text-muted-foreground">
              • تحقق من صحة تنسيق رقم الهاتف إذا تم توفيره
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>
        <Button 
          onClick={onNext} 
          disabled={hasErrors}
          className={hasErrors ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {hasErrors ? 'يجب إصلاح الأخطاء أولاً' : 'المتابعة للاستيراد'}
          {!hasErrors && <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};