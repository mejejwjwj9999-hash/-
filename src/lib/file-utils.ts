import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode
} from 'lucide-react';

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 بايت';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo; 
  if (type.startsWith('audio/')) return FileAudio;
  if (type.includes('pdf')) return FileText;
  if (type.includes('word') || type.includes('document')) return FileText;
  if (type.includes('excel') || type.includes('spreadsheet')) return FileSpreadsheet;
  if (type.includes('presentation')) return FileText;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return Archive;
  if (type.includes('json') || type.includes('xml') || type.includes('javascript') || type.includes('typescript')) return FileCode;
  
  return File;
};

export const getFileTypeColor = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  if (type.startsWith('image/')) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
  if (type.startsWith('video/')) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
  if (type.startsWith('audio/')) return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
  if (type.includes('pdf')) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
  if (type.includes('word') || type.includes('document')) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
  if (type.includes('presentation')) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
  
  return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
};

export const isImageFile = (fileType: string): boolean => {
  return fileType.toLowerCase().startsWith('image/');
};

export const isVideoFile = (fileType: string): boolean => {
  return fileType.toLowerCase().startsWith('video/');
};

export const isAudioFile = (fileType: string): boolean => {
  return fileType.toLowerCase().startsWith('audio/');
};

export const isPdfFile = (fileType: string): boolean => {
  return fileType.toLowerCase().includes('pdf');
};

export const isTextFile = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  return type.startsWith('text/') || 
         type.includes('json') || 
         type.includes('xml') || 
         type.includes('csv');
};

export const getFileCategory = (fileName: string, fileType: string): string => {
  const name = fileName.toLowerCase();
  const type = fileType.toLowerCase();
  
  if (name.includes('lecture') || name.includes('محاضرة')) return 'lecture';
  if (name.includes('assignment') || name.includes('واجب') || name.includes('تكليف')) return 'assignment';
  if (name.includes('exam') || name.includes('امتحان') || name.includes('اختبار')) return 'exam';
  if (name.includes('lab') || name.includes('معمل') || name.includes('تجربة')) return 'lab';
  if (name.includes('project') || name.includes('مشروع')) return 'project';
  if (name.includes('reference') || name.includes('مرجع') || name.includes('كتاب')) return 'reference';
  
  // Fallback to file type
  if (type.startsWith('image/')) return 'media';
  if (type.startsWith('video/')) return 'media';
  if (type.startsWith('audio/')) return 'media';
  if (type.includes('pdf') || type.includes('document')) return 'document';
  
  return 'general';
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

export const sortFiles = (files: any[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
  return [...files].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.file_name?.toLowerCase() || '';
        bValue = b.file_name?.toLowerCase() || '';
        break;
      case 'size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      case 'type':
        aValue = a.file_type?.toLowerCase() || '';
        bValue = b.file_type?.toLowerCase() || '';
        break;
      case 'date':
      default:
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};