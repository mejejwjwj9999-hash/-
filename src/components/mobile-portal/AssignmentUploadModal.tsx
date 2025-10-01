import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadDropzone } from '@/components/course-files/FileUploadDropzone';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  X,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSubmitAssignment } from '@/hooks/useAssignmentsManagement';

interface AssignmentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onUploadSuccess?: () => void;
}

const AssignmentUploadModal = ({ isOpen, onClose, assignment, onUploadSuccess }: AssignmentUploadModalProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const submitAssignmentMutation = useSubmitAssignment();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError('');
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 && !submissionText.trim()) {
      setError('يرجى رفع ملف أو كتابة نص التسليم');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // رفع الملف إلى التخزين إذا كان موجود
      let filePath = null;
      let fileName = null;
      
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0]; // أخذ أول ملف
        fileName = file.name;
        
        // رفع الملف إلى Supabase Storage
        const fileExt = file.name.split('.').pop();
        const filePath_temp = `assignments/${assignment.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('course-files')
          .upload(filePath_temp, file);
        
        if (uploadError) {
          throw new Error('فشل في رفع الملف: ' + uploadError.message);
        }
        
        filePath = filePath_temp;
      }
      
      // استخدام الـ hook لتسليم الواجب
      await submitAssignmentMutation.mutateAsync({
        assignmentId: assignment.id,
        submissionText: submissionText || undefined,
        filePath: filePath || undefined,
        fileName: fileName || undefined
      });
      
      // إعادة تعيين النموذج
      setSelectedFiles([]);
      setSubmissionText('');
      onUploadSuccess?.();
      onClose();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'حدث خطأ أثناء رفع الواجب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-screen overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-primary" />
            تسليم الواجب
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات الواجب */}
          {assignment && (
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {assignment.title}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>المقرر: {assignment.courses?.course_name_ar}</p>
                <p>الدرجة: {assignment.max_grade || 100} درجة</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>آخر موعد: {format(new Date(assignment.due_date), 'dd/MM/yyyy HH:mm', { locale: ar })}</span>
                </div>
              </div>
              {assignment.instructions && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>التعليمات:</strong> {assignment.instructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* قسم رفع الملفات */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                رفع الملفات
              </h4>
              <FileUploadDropzone
                onFileSelect={handleFilesSelected}
                accept={acceptedFileTypes}
                maxFiles={5}
                maxSize={50 * 1024 * 1024} // 50MB
                className="min-h-[120px]"
              />
            </div>

            {/* قائمة الملفات المحددة */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 text-sm">الملفات المحددة:</h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التسليم النصي */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">أو اكتب الإجابة مباشرة</h4>
              <Textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="اكتب إجابتك هنا..."
                className="min-h-[100px] resize-none"
                maxLength={5000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {submissionText.length}/5000 حرف
              </p>
            </div>
          </div>

          {/* عرض الخطأ */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* أزرار العمل */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isUploading}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || (selectedFiles.length === 0 && !submissionText.trim())}
              className="flex-1 gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري التسليم...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  تسليم الواجب
                </>
              )}
            </Button>
          </div>

          {/* معلومات إضافية */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">
              <strong>ملاحظة:</strong> بمجرد تسليم الواجب، لن تتمكن من تعديله.
            </p>
            <p>
              الملفات المدعومة: PDF, Word, PowerPoint, الصور, النصوص (حتى 50 ميجابايت لكل ملف)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentUploadModal;