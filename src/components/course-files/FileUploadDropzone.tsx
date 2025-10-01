import React, { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Upload, FileText, AlertCircle, Check } from 'lucide-react';

interface FileUploadDropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  accept,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className,
}) => {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        const error = file.errors[0];
        if (error.code === 'file-too-large') {
          return `${file.file.name}: الملف كبير جداً (الحد الأقصى ${formatBytes(maxSize)})`;
        }
        if (error.code === 'file-invalid-type') {
          return `${file.file.name}: نوع الملف غير مدعوم`;
        }
        if (error.code === 'too-many-files') {
          return `عدد الملفات يتجاوز الحد المسموح (${maxFiles})`;
        }
        return `${file.file.name}: ${error.message}`;
      });
      setError(errors.join('\n'));
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect, maxSize, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedFileTypes = () => {
    if (!accept) return 'جميع أنواع الملفات';
    const types = Object.keys(accept);
    const typeNames = types.map(type => {
      if (type.startsWith('image/')) return 'الصور';
      if (type.includes('pdf')) return 'PDF';
      if (type.includes('word') || type.includes('document')) return 'Word';
      if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
      if (type.includes('presentation')) return 'PowerPoint';
      if (type.startsWith('video/')) return 'الفيديو';
      if (type.startsWith('audio/')) return 'الصوت';
      if (type.startsWith('text/')) return 'النصوص';
      return type.split('/')[1]?.toUpperCase() || type;
    });
    return typeNames.join(', ');
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          'hover:bg-muted/50',
          isDragActive && 'border-primary bg-primary/5',
          isDragAccept && 'border-green-500 bg-green-50',
          isDragReject && 'border-destructive bg-destructive/5'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isDragActive ? (
            <>
              {isDragAccept ? (
                <Check className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-destructive" />
              )}
              <div className="text-lg font-medium">
                {isDragAccept ? 'أفلت الملفات هنا' : 'نوع الملف غير مدعوم'}
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div className="text-lg font-medium">
                اسحب الملفات هنا أو انقر للاختيار
              </div>
            </>
          )}
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>الأنواع المدعومة: {getAcceptedFileTypes()}</p>
            <p>الحد الأقصى: {formatBytes(maxSize)} لكل ملف</p>
            {maxFiles > 1 && (
              <p>يمكن رفع حتى {maxFiles} ملف في المرة الواحدة</p>
            )}
          </div>

          <Button variant="outline" type="button" className="mt-4">
            <FileText className="h-4 w-4 ml-2" />
            اختيار ملفات
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};