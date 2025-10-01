import React, { memo, useMemo } from 'react';
// @ts-ignore - react-window types issue
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Download, 
  Eye, 
  Copy, 
  Trash2,
  Calendar,
  HardDrive,
  User
} from 'lucide-react';
import { CourseFile } from '@/types/course';
import { formatBytes, getFileIcon } from '@/lib/file-utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface VirtualizedFilesListProps {
  files: CourseFile[];
  onPreview: (file: CourseFile) => void;
  onDownload: (file: CourseFile) => void;
  onDelete: (fileId: string) => void;
  onCopyLink: (file: CourseFile) => void;
}

interface FileItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    files: CourseFile[];
    onPreview: (file: CourseFile) => void;
    onDownload: (file: CourseFile) => void;
    onDelete: (fileId: string) => void;
    onCopyLink: (file: CourseFile) => void;
  };
}

const FileItem = memo<FileItemProps>(({ index, style, data }) => {
  const { files, onPreview, onDownload, onDelete, onCopyLink } = data;
  const file = files[index];

  const FileIcon = getFileIcon(file.file_type);

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

  const formatFileDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ar });
    } catch {
      return 'تاريخ غير صحيح';
    }
  };

  return (
    <div style={style} className="px-6">
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
        {/* File Icon & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{file.file_name}</h3>
              <Badge variant="secondary" className={cn("text-xs", getFileTypeColor(file.file_type))}>
                {file.file_type.split('/')[1]?.toUpperCase() || 'Unknown'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {file.courses && (
                <span className="truncate max-w-40">
                  {file.courses.course_name_ar}
                </span>
              )}
              
              {file.category && (
                <Badge variant="outline" className="text-xs">
                  {file.category}
                </Badge>
              )}
              
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                <span>{file.file_size ? formatBytes(file.file_size) : 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatFileDate(file.created_at)}</span>
              </div>
            </div>
            
            {file.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {file.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {file.is_public ? (
            <Badge variant="default" className="text-xs">عام</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">خاص</Badge>
          )}
        </div>

        {/* Actions Menu */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onPreview(file)}>
                <Eye className="h-4 w-4 ml-2" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopyLink(file)}>
                <Copy className="h-4 w-4 ml-2" />
                نسخ الرابط
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(file.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});

FileItem.displayName = 'FileItem';

export const VirtualizedFilesList: React.FC<VirtualizedFilesListProps> = memo(({
  files,
  onPreview,
  onDownload,
  onDelete,
  onCopyLink,
}) => {
  const itemData = useMemo(() => ({
    files,
    onPreview,
    onDownload,
    onDelete,
    onCopyLink,
  }), [files, onPreview, onDownload, onDelete, onCopyLink]);

  // Calculate item height based on screen size
  const getItemSize = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 100 : 80; // Smaller height on mobile
    }
    return 80;
  };

  return (
    <div className="h-96">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={files.length}
            itemSize={getItemSize()}
            itemData={itemData}
            overscanCount={5}
          >
            {FileItem}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});

VirtualizedFilesList.displayName = 'VirtualizedFilesList';