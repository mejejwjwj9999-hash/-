import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';

interface FileUploadProgressProps {
  fileName: string;
  progress: number;
  isUploading: boolean;
  onCancel?: () => void;
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  fileName,
  progress,
  isUploading,
  onCancel
}) => {
  return (
    <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium truncate flex-1">{fileName}</span>
        {onCancel && isUploading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}%</span>
          <span>
            {isUploading ? 'جاري الرفع...' : progress === 100 ? 'تم الانتهاء' : 'متوقف'}
          </span>
        </div>
      </div>
    </div>
  );
};