import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Download } from 'lucide-react';

interface ImportResultsProps {
  results: {
    successful: number;
    failed: number;
    errors: string[];
  };
  onFinish: () => void;
  onReset: () => void;
}

export const ImportResults: React.FC<ImportResultsProps> = ({
  results,
  onFinish,
  onReset,
}) => {
  const { successful, failed, errors } = results;
  const total = successful + failed;
  const successRate = total > 0 ? (successful / total) * 100 : 0;

  const exportErrorReport = () => {
    if (errors.length === 0) return;
    
    const reportContent = [
      'تقرير أخطاء استيراد الطلاب',
      `التاريخ: ${new Date().toLocaleString('ar-SA')}`,
      `عدد الأخطاء: ${errors.length}`,
      '',
      'تفاصيل الأخطاء:',
      ...errors.map((error, index) => `${index + 1}. ${error}`)
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `تقرير_أخطاء_الاستيراد_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Alert */}
      {successful > 0 && failed === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            تم استيراد جميع البيانات بنجاح! استُورد {successful} طالب بدون أي أخطاء.
          </AlertDescription>
        </Alert>
      )}

      {successful > 0 && failed > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            تم استيراد {successful} طالب بنجاح، وفشل استيراد {failed} طالب.
          </AlertDescription>
        </Alert>
      )}

      {successful === 0 && failed > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            فشل في استيراد جميع البيانات. لم يتم استيراد أي طالب.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-muted-foreground">إجمالي المعالج</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{successful}</div>
            <div className="text-sm text-muted-foreground">استيراد ناجح</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <div className="text-sm text-muted-foreground">فشل الاستيراد</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">معدل النجاح</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج الاستيراد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">نجح: {successful}</span>
              <span className="text-red-600">فشل: {failed}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Details */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                تفاصيل الأخطاء
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportErrorReport}
                className="text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800"
                >
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Message */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص العملية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>تاريخ الاستيراد:</strong> {new Date().toLocaleString('ar-SA')}
            </p>
            <p>
              <strong>عدد السجلات المعالجة:</strong> {total}
            </p>
            <p>
              <strong>النجاح:</strong> {successful} طالب
            </p>
            <p>
              <strong>الفشل:</strong> {failed} طالب
            </p>
            <p>
              <strong>معدل النجاح:</strong> {successRate.toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          استيراد آخر
        </Button>
        <Button onClick={onFinish}>
          <CheckCircle className="h-4 w-4" />
          إنهاء
        </Button>
      </div>
    </div>
  );
};