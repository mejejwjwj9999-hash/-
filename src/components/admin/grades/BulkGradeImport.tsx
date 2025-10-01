import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface BulkGradeImportProps {
  onSuccess?: () => void;
}

interface ImportedGrade {
  student_id: string;
  course_code: string;
  coursework_grade: number;
  midterm_grade: number;
  final_grade: number;
  academic_year: string;
  semester: string;
  notes?: string;
}

export const BulkGradeImport: React.FC<BulkGradeImportProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportedGrade[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // رفع وتحليل الملف
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setErrors([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedData: ImportedGrade[] = [];
      const newErrors: string[] = [];

      jsonData.forEach((row: any, index: number) => {
        const rowNumber = index + 2; // Excel rows start from 1, and we skip header

        try {
          // التحقق من وجود البيانات المطلوبة
          if (!row['رقم الطالب'] || !row['رمز المقرر']) {
            newErrors.push(`الصف ${rowNumber}: رقم الطالب ورمز المقرر مطلوبان`);
            return;
          }

          const grade: ImportedGrade = {
            student_id: String(row['رقم الطالب']).trim(),
            course_code: String(row['رمز المقرر']).trim(),
            coursework_grade: parseFloat(row['أعمال السنة']) || 0,
            midterm_grade: parseFloat(row['النصفي']) || 0,
            final_grade: parseFloat(row['النهائي']) || 0,
            academic_year: String(row['السنة الأكاديمية']).trim(),
            semester: String(row['الفصل']).trim(),
            notes: row['ملاحظات'] ? String(row['ملاحظات']).trim() : undefined
          };

          // التحقق من صحة الدرجات
          if (grade.coursework_grade < 0 || grade.coursework_grade > 40) {
            newErrors.push(`الصف ${rowNumber}: أعمال السنة يجب أن تكون بين 0 و 40`);
          }
          if (grade.midterm_grade < 0 || grade.midterm_grade > 20) {
            newErrors.push(`الصف ${rowNumber}: النصفي يجب أن يكون بين 0 و 20`);
          }
          if (grade.final_grade < 0 || grade.final_grade > 40) {
            newErrors.push(`الصف ${rowNumber}: النهائي يجب أن يكون بين 0 و 40`);
          }

          if (newErrors.length === 0 || newErrors.filter(e => e.includes(`الصف ${rowNumber}`)).length === 0) {
            processedData.push(grade);
          }
        } catch (error) {
          newErrors.push(`الصف ${rowNumber}: خطأ في تحليل البيانات`);
        }
      });

      setImportData(processedData);
      setErrors(newErrors);
    } catch (error) {
      setErrors(['خطأ في قراءة الملف. تأكد من أن الملف بصيغة Excel صحيحة.']);
    } finally {
      setIsProcessing(false);
    }
  };

  // تحميل قالب Excel
  const downloadTemplate = () => {
    const templateData = [
      {
        'رقم الطالب': '2021001',
        'رمز المقرر': 'CS101',
        'أعمال السنة': 35,
        'النصفي': 18,
        'النهائي': 38,
        'السنة الأكاديمية': '2024-2025',
        'الفصل': 'الأول',
        'ملاحظات': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الدرجات');
    
    XLSX.writeFile(workbook, 'قالب_الدرجات.xlsx');
  };

  // تنفيذ الاستيراد الجماعي
  const bulkImportMutation = useMutation({
    mutationFn: async (grades: ImportedGrade[]) => {
      const results = [];
      const processingErrors = [];

      for (const grade of grades) {
        try {
          // البحث عن معرف الطالب
          const { data: student, error: studentError } = await supabase
            .from('student_profiles')
            .select('id')
            .eq('student_id', grade.student_id)
            .single();

          if (studentError || !student) {
            processingErrors.push(`طالب غير موجود: ${grade.student_id}`);
            continue;
          }

          // البحث عن معرف المقرر
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id')
            .eq('course_code', grade.course_code)
            .single();

          if (courseError || !course) {
            processingErrors.push(`مقرر غير موجود: ${grade.course_code}`);
            continue;
          }

          // حساب الدرجة الإجمالية والتقدير
          const totalGrade = grade.coursework_grade + grade.midterm_grade + grade.final_grade;
          
          let letterGrade = 'F';
          let gpaPoints = 0;
          
          if (totalGrade >= 95) { letterGrade = 'A+'; gpaPoints = 4.0; }
          else if (totalGrade >= 90) { letterGrade = 'A'; gpaPoints = 3.7; }
          else if (totalGrade >= 85) { letterGrade = 'B+'; gpaPoints = 3.3; }
          else if (totalGrade >= 80) { letterGrade = 'B'; gpaPoints = 3.0; }
          else if (totalGrade >= 75) { letterGrade = 'C+'; gpaPoints = 2.7; }
          else if (totalGrade >= 70) { letterGrade = 'C'; gpaPoints = 2.3; }
          else if (totalGrade >= 65) { letterGrade = 'D+'; gpaPoints = 2.0; }
          else if (totalGrade >= 60) { letterGrade = 'D'; gpaPoints = 1.7; }

          // إدراج الدرجة
          const { data, error } = await supabase
            .from('grades')
            .insert([{
              student_id: student.id,
              course_id: course.id,
              coursework_grade: grade.coursework_grade,
              midterm_grade: grade.midterm_grade,
              final_grade: grade.final_grade,
              total_grade: totalGrade,
              letter_grade: letterGrade,
              gpa_points: gpaPoints,
              academic_year: grade.academic_year,
              semester: grade.semester,
              notes: grade.notes
            }])
            .select()
            .single();

          if (error) {
            processingErrors.push(`خطأ في حفظ درجة الطالب ${grade.student_id}: ${error.message}`);
          } else {
            results.push(data);
          }
        } catch (error) {
          processingErrors.push(`خطأ غير متوقع للطالب ${grade.student_id}`);
        }
      }

      return { results, errors: processingErrors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-mobile-quick-stats'] });
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      
      if (result.errors.length > 0) {
        setErrors(result.errors);
        toast({
          title: "تم الاستيراد مع بعض الأخطاء",
          description: `تم إضافة ${result.results.length} درجة بنجاح، مع ${result.errors.length} خطأ`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم الاستيراد بنجاح",
          description: `تم إضافة ${result.results.length} درجة بنجاح`,
        });
        setOpen(false);
        setSelectedFile(null);
        setImportData([]);
        setErrors([]);
      }
      
      onSuccess?.();
    },
    onError: (error) => {
      console.error('خطأ في الاستيراد الجماعي:', error);
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد الدرجات",
        variant: "destructive",
      });
    }
  });

  const handleImport = () => {
    if (importData.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "يرجى رفع ملف يحتوي على بيانات صحيحة",
        variant: "destructive",
      });
      return;
    }

    bulkImportMutation.mutate(importData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          استيراد جماعي
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-university-blue" />
            استيراد الدرجات الجماعي
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* تحميل القالب */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">تحميل قالب Excel</h4>
              <p className="text-sm text-blue-700">حمل القالب لمعرفة التنسيق المطلوب</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              تحميل القالب
            </Button>
          </div>

          {/* رفع الملف */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">اختر ملف Excel</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isProcessing || bulkImportMutation.isPending}
            />
            {selectedFile && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {selectedFile.name}
              </p>
            )}
          </div>

          {/* حالة المعالجة */}
          {isProcessing && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                جاري تحليل الملف...
              </AlertDescription>
            </Alert>
          )}

          {/* عرض الأخطاء */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">تم العثور على أخطاء:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li>... و {errors.length - 10} أخطاء أخرى</li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* عرض البيانات المستوردة */}
          {importData.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                تم تحليل {importData.length} درجة بنجاح وجاهزة للاستيراد
              </AlertDescription>
            </Alert>
          )}

          {/* أزرار التحكم */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleImport}
              disabled={importData.length === 0 || bulkImportMutation.isPending}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {bulkImportMutation.isPending ? 'جاري الاستيراد...' : `استيراد ${importData.length} درجة`}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={bulkImportMutation.isPending}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};