import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileSpreadsheet,
  Eye,
  Save
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ImportData {
  row: number;
  student_id: string;
  coursework_grade?: number;
  midterm_grade?: number;
  final_grade?: number;
  errors: string[];
  isValid: boolean;
}

export const BulkOperationsTab: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<'import' | 'export'>('import');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [selectedSemester, setSelectedSemester] = useState('الفصل الأول');
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const { data: courses = [] } = useCourses();
  const { toast } = useToast();

  // معالجة ملفات الاستيراد
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!selectedCourse) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المقرر أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setProcessProgress(10);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setProcessProgress(30);

      // التحقق من صحة البيانات
      const validatedData: ImportData[] = [];
      const headers = jsonData[0] as string[];
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.length === 0) continue;

        const rowData: ImportData = {
          row: i + 1,
          student_id: row[0]?.toString() || '',
          coursework_grade: parseFloat(row[1]) || undefined,
          midterm_grade: parseFloat(row[2]) || undefined,
          final_grade: parseFloat(row[3]) || undefined,
          errors: [],
          isValid: true
        };

        // التحقق من صحة البيانات
        if (!rowData.student_id) {
          rowData.errors.push('رقم الطالب مطلوب');
          rowData.isValid = false;
        }

        if (rowData.coursework_grade !== undefined && (rowData.coursework_grade < 0 || rowData.coursework_grade > 30)) {
          rowData.errors.push('درجة الأعمال يجب أن تكون بين 0 و 30');
          rowData.isValid = false;
        }

        if (rowData.midterm_grade !== undefined && (rowData.midterm_grade < 0 || rowData.midterm_grade > 30)) {
          rowData.errors.push('درجة النصفي يجب أن تكون بين 0 و 30');
          rowData.isValid = false;
        }

        if (rowData.final_grade !== undefined && (rowData.final_grade < 0 || rowData.final_grade > 40)) {
          rowData.errors.push('درجة النهائي يجب أن تكون بين 0 و 40');
          rowData.isValid = false;
        }

        validatedData.push(rowData);
      }

      setProcessProgress(70);

      // التحقق من وجود الطلاب في قاعدة البيانات
      for (const data of validatedData) {
        if (data.student_id) {
          const { data: student } = await supabase
            .from('student_profiles')
            .select('id')
            .eq('student_id', data.student_id)
            .single();

          if (!student) {
            data.errors.push('الطالب غير موجود في النظام');
            data.isValid = false;
          }
        }
      }

      setImportData(validatedData);
      setShowPreview(true);
      setProcessProgress(100);

      toast({
        title: 'تم تحليل الملف',
        description: `تم تحليل ${validatedData.length} صف بنجاح`
      });

    } catch (error) {
      console.error('خطأ في معالجة الملف:', error);
      toast({
        title: 'خطأ في معالجة الملف',
        description: 'تأكد من أن الملف بصيغة Excel صحيحة',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedCourse, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  // حفظ البيانات
  const handleSaveImport = async () => {
    const validRows = importData.filter(row => row.isValid);
    if (validRows.length === 0) {
      toast({
        title: 'لا توجد بيانات صحيحة',
        description: 'يرجى التأكد من صحة البيانات',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    let savedCount = 0;

    try {
      for (const row of validRows) {
        // الحصول على معرف الطالب
        const { data: student } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('student_id', row.student_id)
          .single();

        if (!student) continue;

        // حساب الدرجة النهائية
        const coursework = row.coursework_grade || 0;
        const midterm = row.midterm_grade || 0;
        const final = row.final_grade || 0;
        const total = coursework + midterm + final;

        let letterGrade = '';
        let gpaPoints = 0;

        if (total >= 90) {
          letterGrade = 'A';
          gpaPoints = 4.0;
        } else if (total >= 80) {
          letterGrade = 'B';
          gpaPoints = 3.0;
        } else if (total >= 70) {
          letterGrade = 'C';
          gpaPoints = 2.0;
        } else if (total >= 60) {
          letterGrade = 'D';
          gpaPoints = 1.0;
        } else {
          letterGrade = 'F';
          gpaPoints = 0.0;
        }

        // التحقق من وجود درجة موجودة
        const { data: existingGrade } = await supabase
          .from('grades')
          .select('id')
          .eq('student_id', student.id)
          .eq('course_id', selectedCourse)
          .eq('academic_year', selectedAcademicYear)
          .eq('semester', selectedSemester)
          .single();

        const gradeData = {
          student_id: student.id,
          course_id: selectedCourse,
          coursework_grade: coursework,
          midterm_grade: midterm,
          final_grade: final,
          total_grade: total,
          letter_grade: letterGrade,
          gpa_points: gpaPoints,
          academic_year: selectedAcademicYear,
          semester: selectedSemester,
          status: 'enrolled'
        };

        if (existingGrade) {
          // تحديث الدرجة الموجودة
          await supabase
            .from('grades')
            .update(gradeData)
            .eq('id', existingGrade.id);
        } else {
          // إضافة درجة جديدة
          await supabase
            .from('grades')
            .insert(gradeData);
        }

        savedCount++;
        setProcessProgress((savedCount / validRows.length) * 100);
      }

      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم حفظ ${savedCount} درجة`
      });

      // إعادة تعيين النموذج
      setImportData([]);
      setShowPreview(false);
      setProcessProgress(0);

    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ البيانات',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // تصدير البيانات
  const handleExport = async () => {
    if (!selectedCourse) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المقرر أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: grades, error } = await supabase
        .from('grades')
        .select(`
          *,
          student_profiles!grades_student_id_fkey (student_id, first_name, last_name),
          courses!grades_course_id_fkey (course_code, course_name_ar)
        `)
        .eq('course_id', selectedCourse)
        .eq('academic_year', selectedAcademicYear)
        .eq('semester', selectedSemester)
        .order('student_profiles(student_id)');

      if (error) throw error;

      const exportData = grades.map(grade => ({
        'رقم الطالب': grade.student_profiles?.student_id,
        'اسم الطالب': `${grade.student_profiles?.first_name} ${grade.student_profiles?.last_name}`,
        'رمز المقرر': grade.courses?.course_code,
        'اسم المقرر': grade.courses?.course_name_ar,
        'درجة الأعمال': grade.coursework_grade || '',
        'درجة النصفي': grade.midterm_grade || '',
        'درجة النهائي': grade.final_grade || '',
        'المجموع': grade.total_grade || '',
        'التقدير': grade.letter_grade || '',
        'نقاط الجودة': grade.gpa_points || '',
        'السنة الأكاديمية': grade.academic_year,
        'الفصل': grade.semester
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'الدرجات');

      const courseCode = courses.find(c => c.id === selectedCourse)?.course_code || 'course';
      const fileName = `grades_${courseCode}_${selectedAcademicYear}_${selectedSemester}.xlsx`;
      
      XLSX.writeFile(wb, fileName);

      toast({
        title: 'تم التصدير',
        description: `تم تصدير ${exportData.length} درجة`
      });

    } catch (error) {
      console.error('خطأ في التصدير:', error);
      toast({
        title: 'خطأ في التصدير',
        description: 'حدث خطأ أثناء تصدير البيانات',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // تحميل النموذج
  const downloadTemplate = () => {
    const templateData = [
      ['رقم الطالب', 'درجة الأعمال (0-30)', 'درجة النصفي (0-30)', 'درجة النهائي (0-40)'],
      ['202301001', '25', '28', '35'],
      ['202301002', '30', '25', '38'],
      ['202301003', '28', '30', '40']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'نموذج الدرجات');
    
    XLSX.writeFile(wb, 'template_grades.xlsx');

    toast({
      title: 'تم تحميل النموذج',
      description: 'يمكنك الآن تعبئة البيانات في النموذج'
    });
  };

  const validRows = importData.filter(row => row.isValid).length;
  const invalidRows = importData.filter(row => !row.isValid).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* اختيار نوع العملية */}
      <Card>
        <CardHeader>
          <CardTitle>العمليات الجماعية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedOperation === 'import' ? 'default' : 'outline'}
              onClick={() => setSelectedOperation('import')}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              استيراد الدرجات
            </Button>
            <Button
              variant={selectedOperation === 'export' ? 'default' : 'outline'}
              onClick={() => setSelectedOperation('export')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير الدرجات
            </Button>
          </div>

          {/* الإعدادات المشتركة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="course">المقرر</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المقرر" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_code} - {course.course_name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="academic_year">السنة الأكاديمية</Label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">الفصل</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                  <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                  <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* استيراد الدرجات */}
      {selectedOperation === 'import' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  استيراد الدرجات
                </CardTitle>
                <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  تحميل النموذج
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-university-blue bg-university-blue/5' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                {isDragActive ? (
                  <p className="text-lg text-university-blue">اسقط الملف هنا...</p>
                ) : (
                  <div>
                    <p className="text-lg mb-2">اسحب وأسقط ملف Excel هنا، أو انقر للاختيار</p>
                    <p className="text-sm text-gray-500">
                      يدعم ملفات .xlsx, .xls, .csv
                    </p>
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">جاري المعالجة...</span>
                    <span className="text-sm text-gray-600">{Math.round(processProgress)}%</span>
                  </div>
                  <Progress value={processProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* معاينة البيانات */}
          {showPreview && importData.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    معاينة البيانات
                  </CardTitle>
                  <div className="flex gap-4">
                    <Badge className="bg-green-100 text-green-800 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      صحيح: {validRows}
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 gap-1">
                      <XCircle className="h-4 w-4" />
                      خطأ: {invalidRows}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-right py-2 px-4">الصف</th>
                        <th className="text-right py-2 px-4">رقم الطالب</th>
                        <th className="text-right py-2 px-4">الأعمال</th>
                        <th className="text-right py-2 px-4">النصفي</th>
                        <th className="text-right py-2 px-4">النهائي</th>
                        <th className="text-right py-2 px-4">الحالة</th>
                        <th className="text-right py-2 px-4">الأخطاء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importData.map((row, index) => (
                        <tr key={index} className={`border-b ${row.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                          <td className="py-2 px-4">{row.row}</td>
                          <td className="py-2 px-4">{row.student_id}</td>
                          <td className="py-2 px-4">{row.coursework_grade || '-'}</td>
                          <td className="py-2 px-4">{row.midterm_grade || '-'}</td>
                          <td className="py-2 px-4">{row.final_grade || '-'}</td>
                          <td className="py-2 px-4">
                            {row.isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {row.errors.length > 0 && (
                              <div className="text-xs text-red-600">
                                {row.errors.join(', ')}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button onClick={() => setShowPreview(false)} variant="outline">
                    إلغاء
                  </Button>
                  <Button 
                    onClick={handleSaveImport}
                    disabled={validRows === 0 || isProcessing}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    حفظ ({validRows} درجة)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* تصدير الدرجات */}
      {selectedOperation === 'export' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              تصدير الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">خيارات التصدير</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• سيتم تصدير جميع درجات المقرر المحدد</li>
                  <li>• يشمل التصدير: معلومات الطالب، الدرجات، التقديرات</li>
                  <li>• الملف سيكون بصيغة Excel (.xlsx)</li>
                </ul>
              </div>

              <Button 
                onClick={handleExport}
                disabled={!selectedCourse || isProcessing}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'جاري التصدير...' : 'تصدير الدرجات'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};