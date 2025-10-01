import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  X,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ImportPreview } from './ImportPreview';
import { ImportValidation } from './ImportValidation';
import { ImportResults } from './ImportResults';

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

interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

type ImportStep = 'upload' | 'preview' | 'validate' | 'import' | 'results';

const BulkStudentImporter: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [parsedData, setParsedData] = useState<StudentRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const students: StudentRecord[] = jsonData.map((row: any, index) => ({
          student_id: String(row['رقم الطالب'] || row['Student ID'] || '').trim(),
          first_name: String(row['الاسم الأول'] || row['First Name'] || '').trim(),
          last_name: String(row['الاسم الأخير'] || row['Last Name'] || '').trim(),
          email: String(row['البريد الإلكتروني'] || row['Email'] || '').trim(),
          phone: String(row['الهاتف'] || row['Phone'] || '').trim() || undefined,
          college: String(row['الكلية'] || row['College'] || '').trim(),
          department: String(row['القسم'] || row['Department'] || '').trim(),
          academic_year: Number(row['السنة الأكاديمية'] || row['Academic Year']) || 1,
          semester: Number(row['الفصل'] || row['Semester']) || 1,
          admission_date: row['تاريخ القبول'] || row['Admission Date'] || new Date().toISOString().split('T')[0],
          status: String(row['الحالة'] || row['Status'] || 'active').toLowerCase(),
        }));

        setParsedData(students);
        setCurrentStep('preview');
      } catch (error) {
        toast({
          title: 'خطأ في تحليل الملف',
          description: 'تأكد من أن الملف بصيغة Excel أو CSV صحيحة.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const validateData = async () => {
    const errors: ValidationError[] = [];
    const emails = new Set();
    const studentIds = new Set();

    // Check existing records in database
    const { data: existingStudents } = await supabase
      .from('student_profiles')
      .select('student_id, email');

    const existingEmails = new Set(existingStudents?.map(s => s.email.toLowerCase()) || []);
    const existingStudentIds = new Set(existingStudents?.map(s => s.student_id) || []);

    parsedData.forEach((student, index) => {
      const rowNum = index + 1;

      // Required fields validation
      if (!student.student_id) {
        errors.push({
          row: rowNum,
          field: 'student_id',
          message: 'رقم الطالب مطلوب',
          severity: 'error'
        });
      }

      if (!student.first_name) {
        errors.push({
          row: rowNum,
          field: 'first_name',
          message: 'الاسم الأول مطلوب',
          severity: 'error'
        });
      }

      if (!student.last_name) {
        errors.push({
          row: rowNum,
          field: 'last_name',
          message: 'الاسم الأخير مطلوب',
          severity: 'error'
        });
      }

      if (!student.email) {
        errors.push({
          row: rowNum,
          field: 'email',
          message: 'البريد الإلكتروني مطلوب',
          severity: 'error'
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        errors.push({
          row: rowNum,
          field: 'email',
          message: 'تنسيق البريد الإلكتروني غير صحيح',
          severity: 'error'
        });
      }

      // College and Department validation
      if (!student.college) {
        errors.push({
          row: rowNum,
          field: 'college',
          message: 'الكلية مطلوبة',
          severity: 'error'
        });
      }

      if (!student.department) {
        errors.push({
          row: rowNum,
          field: 'department',
          message: 'القسم مطلوب',
          severity: 'error'
        });
      }

      // Duplicate validation within file
      if (student.email && emails.has(student.email.toLowerCase())) {
        errors.push({
          row: rowNum,
          field: 'email',
          message: 'البريد الإلكتروني مكرر في الملف',
          severity: 'error'
        });
      } else if (student.email) {
        emails.add(student.email.toLowerCase());
      }

      if (student.student_id && studentIds.has(student.student_id)) {
        errors.push({
          row: rowNum,
          field: 'student_id',
          message: 'رقم الطالب مكرر في الملف',
          severity: 'error'
        });
      } else if (student.student_id) {
        studentIds.add(student.student_id);
      }

      // Database duplicate validation
      if (student.email && existingEmails.has(student.email.toLowerCase())) {
        errors.push({
          row: rowNum,
          field: 'email',
          message: 'البريد الإلكتروني موجود بالفعل في قاعدة البيانات',
          severity: 'error'
        });
      }

      if (student.student_id && existingStudentIds.has(student.student_id)) {
        errors.push({
          row: rowNum,
          field: 'student_id',
          message: 'رقم الطالب موجود بالفعل في قاعدة البيانات',
          severity: 'error'
        });
      }

      // Status validation
      if (!['active', 'inactive', 'suspended', 'graduated'].includes(student.status)) {
        errors.push({
          row: rowNum,
          field: 'status',
          message: 'حالة الطالب غير صحيحة (active, inactive, suspended, graduated)',
          severity: 'warning'
        });
      }

      // Academic year validation
      if (student.academic_year < 1 || student.academic_year > 6) {
        errors.push({
          row: rowNum,
          field: 'academic_year',
          message: 'السنة الأكاديمية يجب أن تكون بين 1 و 6',
          severity: 'warning'
        });
      }

      // Semester validation
      if (student.semester < 1 || student.semester > 2) {
        errors.push({
          row: rowNum,
          field: 'semester',
          message: 'الفصل يجب أن يكون 1 أو 2',
          severity: 'warning'
        });
      }

      // Phone validation (if provided)
      if (student.phone && !/^[0-9+\-\s()]{10,15}$/.test(student.phone)) {
        errors.push({
          row: rowNum,
          field: 'phone',
          message: 'تنسيق رقم الهاتف غير صحيح',
          severity: 'warning'
        });
      }
    });

    setValidationErrors(errors);
    setCurrentStep('validate');
  };

  const importStudents = useMutation({
    mutationFn: async () => {
      const validStudents = parsedData.filter((_, index) => {
        const rowErrors = validationErrors.filter(
          error => error.row === index + 1 && error.severity === 'error'
        );
        return rowErrors.length === 0;
      });

      const successful = [];
      const failed = [];
      const errorMessages = [];

      for (let i = 0; i < validStudents.length; i++) {
        const student = validStudents[i];
        setImportProgress(((i + 1) / validStudents.length) * 100);

        try {
          const { error } = await supabase
            .from('student_profiles')
            .insert({
              student_id: student.student_id,
              first_name: student.first_name,
              last_name: student.last_name,
              email: student.email,
              phone: student.phone,
              college: student.college,
              department: student.department,
              academic_year: student.academic_year,
              semester: student.semester,
              admission_date: student.admission_date,
              status: student.status,
            });

          if (error) {
            failed.push(student);
            errorMessages.push(`صف ${i + 1}: ${error.message}`);
          } else {
            successful.push(student);
          }
        } catch (error) {
          failed.push(student);
          errorMessages.push(`صف ${i + 1}: خطأ غير متوقع`);
        }
      }

      return {
        successful: successful.length,
        failed: failed.length,
        errors: errorMessages,
      };
    },
    onSuccess: (results) => {
      setImportResults(results);
      setCurrentStep('results');
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      
      if (results.successful > 0) {
        toast({
          title: 'تم الاستيراد بنجاح',
          description: `تم استيراد ${results.successful} طالب بنجاح.`,
        });
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في الاستيراد',
        description: 'حدث خطأ أثناء استيراد البيانات.',
        variant: 'destructive',
      });
    },
  });

  const downloadTemplate = () => {
    const template = [
      {
        'رقم الطالب': '2024001',
        'الاسم الأول': 'أحمد',
        'الاسم الأخير': 'محمد',
        'البريد الإلكتروني': 'ahmed@example.com',
        'الهاتف': '0501234567',
        'الكلية': 'كلية الهندسة',
        'القسم': 'هندسة الحاسوب',
        'السنة الأكاديمية': 1,
        'الفصل': 1,
        'تاريخ القبول': '2024-01-15',
        'الحالة': 'active',
      },
      {
        'رقم الطالب': '2024002',
        'الاسم الأول': 'فاطمة',
        'الاسم الأخير': 'علي',
        'البريد الإلكتروني': 'fatima@example.com',
        'الهاتف': '0509876543',
        'الكلية': 'كلية الطب',
        'القسم': 'الطب العام',
        'السنة الأكاديمية': 2,
        'الفصل': 2,
        'تاريخ القبول': '2023-09-01',
        'الحالة': 'active',
      },
      {
        'رقم الطالب': 'ملاحظات',
        'الاسم الأول': 'مطلوب',
        'الاسم الأخير': 'مطلوب',
        'البريد الإلكتروني': 'مطلوب - يجب أن يكون صحيح',
        'الهاتف': 'اختياري',
        'الكلية': 'مطلوب',
        'القسم': 'مطلوب',
        'السنة الأكاديمية': '1-6',
        'الفصل': '1 أو 2',
        'تاريخ القبول': 'YYYY-MM-DD',
        'الحالة': 'active/inactive/suspended/graduated',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students Template');
    XLSX.writeFile(wb, 'نموذج_استيراد_الطلاب.xlsx');

    toast({
      title: 'تم تحميل النموذج',
      description: 'تم تحميل نموذج Excel مع أمثلة وإرشادات.',
    });
  };

  const resetImporter = () => {
    setCurrentStep('upload');
    setParsedData([]);
    setValidationErrors([]);
    setImportProgress(0);
    setImportResults(null);
  };

  const hasErrors = validationErrors.filter(e => e.severity === 'error').length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4" />
          استيراد مجمع
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            استيراد الطلاب بشكل مجمع
          </DialogTitle>
          <DialogDescription>
            استيراد بيانات الطلاب من ملف Excel أو CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { step: 'upload', label: 'رفع الملف', icon: Upload },
              { step: 'preview', label: 'معاينة', icon: FileText },
              { step: 'validate', label: 'التحقق', icon: AlertTriangle },
              { step: 'import', label: 'الاستيراد', icon: CheckCircle },
              { step: 'results', label: 'النتائج', icon: CheckCircle },
            ].map(({ step, label, icon: Icon }, index) => (
              <div
                key={step}
                className={`flex items-center gap-2 ${
                  currentStep === step ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
                {index < 4 && <div className="w-8 h-px bg-border mx-2" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 'upload' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadTemplate} className="flex-1">
                  <Download className="h-4 w-4" />
                  تحميل النموذج
                </Button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'أفلت الملف هنا' : 'اسحب وأفلت ملف Excel أو CSV'}
                </p>
                <p className="text-sm text-muted-foreground">
                  أو انقر للاختيار من جهازك
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  الصيغ المدعومة: .xlsx, .xls, .csv
                </p>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <ImportPreview 
              data={parsedData}
              onNext={validateData}
              onBack={() => setCurrentStep('upload')}
            />
          )}

          {currentStep === 'validate' && (
            <ImportValidation
              errors={validationErrors}
              data={parsedData}
              onNext={() => {
                setCurrentStep('import');
                importStudents.mutate();
              }}
              onBack={() => setCurrentStep('preview')}
              hasErrors={hasErrors}
            />
          )}

          {currentStep === 'import' && (
            <div className="space-y-4 text-center">
              <div className="text-lg font-medium">جاري الاستيراد...</div>
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {Math.round(importProgress)}% مكتمل
              </p>
            </div>
          )}

          {currentStep === 'results' && importResults && (
            <ImportResults
              results={importResults}
              onFinish={() => {
                setIsOpen(false);
                resetImporter();
              }}
              onReset={resetImporter}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetImporter}>
              إعادة تعيين
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkStudentImporter;