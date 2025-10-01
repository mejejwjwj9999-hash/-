import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Download,
  Copy,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  Calendar,
  User,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { CourseFile } from '@/types/course';
import { formatBytes, getFileIcon } from '@/lib/file-utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface FilePreviewModalProps {
  file: CourseFile;
  open: boolean;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  open,
  onClose,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.file_path);
    toast.success('تم نسخ رابط الملف');
  };

  const handleDownload = () => {
    window.open(file.file_path, '_blank');
    toast.success('جاري تحميل الملف...');
  };

  const handleOpenInNewTab = () => {
    window.open(file.file_path, '_blank');
  };

  const renderPreview = () => {
    const fileType = file.file_type.toLowerCase();

    if (fileType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-64">
          <img
            src={file.file_path}
            alt={file.file_name}
            className="max-w-full max-h-64 object-contain rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden flex-col items-center text-muted-foreground">
            <ImageIcon className="h-16 w-16 mb-2" />
            <p>لا يمكن عرض الصورة</p>
          </div>
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <div className="bg-muted/30 rounded-lg p-4 min-h-64">
          <iframe
            src={`${file.file_path}#view=FitH`}
            className="w-full h-64 rounded"
            title={file.file_name}
          />
        </div>
      );
    }

    if (fileType.startsWith('video/')) {
      return (
        <div className="bg-muted/30 rounded-lg p-4 min-h-64">
          <video
            controls
            className="w-full max-h-64 rounded"
            preload="metadata"
          >
            <source src={file.file_path} type={file.file_type} />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        </div>
      );
    }

    if (fileType.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 min-h-64">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <audio controls className="w-full max-w-md">
            <source src={file.file_path} type={file.file_type} />
            متصفحك لا يدعم تشغيل الصوت
          </audio>
        </div>
      );
    }

    // Default preview for unsupported files
    const FileIcon = getFileIcon(file.file_type);
    return (
      <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 min-h-64">
        <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          معاينة غير متوفرة لهذا النوع من الملفات
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          انقر على "تحميل" لفتح الملف
        </p>
      </div>
    );
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (type.startsWith('video/')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (type.startsWith('audio/')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (type.includes('word') || type.includes('document')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (type.includes('presentation')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {React.createElement(getFileIcon(file.file_type), {
                className: "h-6 w-6 flex-shrink-0 mt-0.5"
              })}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">{file.file_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={getFileTypeColor(file.file_type)}>
                    {file.file_type.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </Badge>
                  {file.category && (
                    <Badge variant="outline">
                      {file.category}
                    </Badge>
                  )}
                  {file.is_public ? (
                    <Badge variant="default">عام</Badge>
                  ) : (
                    <Badge variant="secondary">خاص</Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div>
            {renderPreview()}
          </div>

          {/* File Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold">معلومات الملف</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">الحجم:</span>
                  <span className="text-sm font-medium">
                    {file.file_size ? formatBytes(file.file_size) : 'غير محدد'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">تاريخ الرفع:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(file.created_at), 'PPp', { locale: ar })}
                  </span>
                </div>

                {file.courses && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">المقرر:</span>
                    <span className="text-sm font-medium">
                      {file.courses.course_name_ar}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold">الإجراءات</h3>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  className="justify-start gap-2"
                  variant="default"
                >
                  <Download className="h-4 w-4" />
                  تحميل الملف
                </Button>

                <Button
                  onClick={handleCopyLink}
                  className="justify-start gap-2"
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                  نسخ الرابط
                </Button>

                <Button
                  onClick={handleOpenInNewTab}
                  className="justify-start gap-2"
                  variant="ghost"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح في نافذة جديدة
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          {file.description && (
            <div>
              <Separator className="mb-4" />
              <h3 className="text-base font-semibold mb-2">الوصف</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {file.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};