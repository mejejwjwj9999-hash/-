import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, X, FileText, AlertCircle, Check } from 'lucide-react';
import { useUploadCourseFile } from '@/hooks/useCourseFilesManagement';
import { useCourses } from '@/hooks/useCourses';
import { FileUploadDropzone } from './FileUploadDropzone';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [courseId, setCourseId] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const { data: courses = [] } = useCourses();
  const uploadMutation = useUploadCourseFile();
  const { uploadProgress, uploadFile, cancelUpload, isUploading } = useFileUpload();

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !courseId) return;

    try {
      for (const file of selectedFiles) {
        // Simulate file upload to storage (this would be actual storage API call)
        const filePath = await uploadFile(file, `course-files/${courseId}/${file.name}`);
        
        await uploadMutation.mutateAsync({
          course_id: courseId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          category,
          description,
          is_public: isPublic,
        });
      }

      toast.success(`تم رفع ${selectedFiles.length} ملف بنجاح`);
      onClose();
      resetForm();
    } catch (error) {
      toast.error('فشل في رفع الملفات');
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setCourseId('');
    setCategory('general');
    setDescription('');
    setIsPublic(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (type.startsWith('video/')) return 'bg-blue-100 text-blue-800';
    if (type.startsWith('audio/')) return 'bg-purple-100 text-purple-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('word') || type.includes('document')) return 'bg-blue-100 text-blue-800';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'bg-green-100 text-green-800';
    if (type.includes('presentation')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          رفع ملفات جديدة
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label className="text-base font-medium">اختيار الملفات</Label>
          <FileUploadDropzone
            onFileSelect={handleFileSelect}
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
            accept={{
              'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-powerpoint': ['.ppt'],
              'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
              'text/*': ['.txt', '.csv'],
              'video/*': ['.mp4', '.avi', '.mov'],
              'audio/*': ['.mp3', '.wav', '.m4a'],
            }}
          />
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div>
            <Label className="text-base font-medium">الملفات المحددة ({selectedFiles.length})</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getFileTypeColor(file.type)}>
                        {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">جاري الرفع...</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
            <Button
              variant="outline"
              size="sm"
              onClick={cancelUpload}
              className="w-full"
            >
              إلغاء الرفع
            </Button>
          </div>
        )}

        {/* Course Selection */}
        <div>
          <Label htmlFor="course">المقرر الدراسي *</Label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المقرر الدراسي" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.course_code} - {course.course_name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="category">التصنيف</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">عام</SelectItem>
              <SelectItem value="lecture">محاضرات</SelectItem>
              <SelectItem value="assignment">واجبات</SelectItem>
              <SelectItem value="exam">امتحانات</SelectItem>
              <SelectItem value="reference">مراجع</SelectItem>
              <SelectItem value="lab">معمل</SelectItem>
              <SelectItem value="project">مشاريع</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">الوصف (اختياري)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للملفات..."
            rows={3}
          />
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="public">ملف عام</Label>
            <p className="text-sm text-muted-foreground">
              يمكن للطلاب المسجلين في المقرر رؤية هذا الملف
            </p>
          </div>
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {/* Validation Messages */}
        {selectedFiles.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              يرجى اختيار ملف واحد على الأقل للرفع
            </AlertDescription>
          </Alert>
        )}

        {!courseId && selectedFiles.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              يرجى اختيار المقرر الدراسي
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            إلغاء
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !courseId || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                رفع {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
    </Dialog>
  );
};