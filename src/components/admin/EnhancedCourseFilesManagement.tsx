import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  MoreHorizontal,
  FileText,
  Filter,
  Copy,
  FolderOpen,
  RefreshCw,
  Calendar,
  HardDrive,
  Files,
  Grid,
  List
} from 'lucide-react';
import { 
  useAdminCourseFiles, 
  useDeleteCourseFile, 
  useCourseFilesStatistics,
  useDownloadCourseFile
} from '@/hooks/useCourseFilesManagement';
import { CourseFile } from '@/types/course';
import { FileUploadButton } from '@/components/course-files/FileUploadButton';
import { FilePreviewModal } from '@/components/course-files/FilePreviewModal';
import { formatBytes, getFileIcon } from '@/lib/file-utils';

const EnhancedCourseFilesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Hooks
  const { data: files = [], isLoading, error, refetch } = useAdminCourseFiles();
  const { data: statistics } = useCourseFilesStatistics();
  const deleteFileMutation = useDeleteCourseFile();
  const downloadFileMutation = useDownloadCourseFile();

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = searchQuery === '' || 
        file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourse = selectedCourse === '' || file.course_id === selectedCourse;
      const matchesCategory = selectedCategory === '' || file.category === selectedCategory;
      const matchesType = selectedFileType === '' || file.file_type === selectedFileType;

      return matchesSearch && matchesCourse && matchesCategory && matchesType;
    });
  }, [files, searchQuery, selectedCourse, selectedCategory, selectedFileType]);

  // Get unique values for filters
  const { uniqueCourses, uniqueCategories, uniqueFileTypes } = useMemo(() => {
    const courses = files.map(f => ({ id: f.course_id, name: f.courses?.course_name_ar }))
      .filter((course, index, self) => 
        course.id && course.name && 
        index === self.findIndex(c => c.id === course.id)
      );
    
    const categories = [...new Set(files.map(f => f.category).filter(Boolean))];
    const fileTypes = [...new Set(files.map(f => f.file_type).filter(Boolean))];

    return { 
      uniqueCourses: courses, 
      uniqueCategories: categories, 
      uniqueFileTypes: fileTypes 
    };
  }, [files]);

  // Handlers
  const handleDeleteFile = useCallback(async (fileId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      try {
        await deleteFileMutation.mutateAsync(fileId);
        toast.success('تم حذف الملف بنجاح');
      } catch (error) {
        toast.error('فشل في حذف الملف');
      }
    }
  }, [deleteFileMutation]);

  const handleDownloadFile = useCallback(async (file: CourseFile) => {
    try {
      await downloadFileMutation.mutateAsync(file.file_path);
      toast.success('جاري تحميل الملف...');
    } catch (error) {
      toast.error('فشل في تحميل الملف');
    }
  }, [downloadFileMutation]);

  const handleCopyLink = useCallback((file: CourseFile) => {
    navigator.clipboard.writeText(file.file_path);
    toast.success('تم نسخ رابط الملف');
  }, []);

  const handlePreviewFile = useCallback((file: CourseFile) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('');
    setSelectedCategory('');
    setSelectedFileType('');
  };

  // File list component without virtualization
  const FilesList = () => (
    <ScrollArea className="h-96">
      <div className="space-y-3 p-3">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.file_type);
          
          return (
            <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{file.file_name}</h3>
                    <Badge variant="secondary" className="text-xs">
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
                      <span>{new Date(file.created_at).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                  
                  {file.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {file.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {file.is_public ? (
                  <Badge variant="default" className="text-xs">عام</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">خاص</Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePreviewFile(file)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadFile(file)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyLink(file)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          حدث خطأ في تحميل ملفات المقررات. يرجى المحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ملفات المقررات</h1>
          <p className="text-muted-foreground">إدارة وتنظيم ملفات المقررات الدراسية</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <FileUploadButton>
            رفع ملف جديد
          </FileUploadButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الملفات</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{statistics?.recentFiles || 0} هذا الأسبوع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحجم الإجمالي</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : formatBytes(statistics?.totalSize || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              للجميع المقررات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الملفات العامة</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.publicFiles || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.privateFiles || 0} خاص
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أكثر الأنواع</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                Object.keys(statistics?.byType || {}).length > 0 
                  ? Object.entries(statistics.byType).sort(([,a], [,b]) => b - a)[0][0].toUpperCase()
                  : 'N/A'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.keys(statistics?.byType || {}).length} نوع مختلف
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في أسماء الملفات والوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="المقرر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المقررات</SelectItem>
                  {uniqueCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع التصنيفات</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="نوع الملف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأنواع</SelectItem>
                  {uniqueFileTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery || selectedCourse || selectedCategory || selectedFileType) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  مسح الفلاتر
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>عرض {filteredFiles.length} من {files.length} ملف</span>
            {(searchQuery || selectedCourse || selectedCategory || selectedFileType) && (
              <span>تم تطبيق فلاتر</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الملفات</CardTitle>
          <CardDescription>
            جميع ملفات المقررات المرفوعة في النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                لا توجد ملفات
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedCourse || selectedCategory || selectedFileType
                  ? 'لم يتم العثور على ملفات تطابق المعايير المحددة'
                  : 'لم يتم رفع أي ملفات بعد'}
              </p>
              {(searchQuery || selectedCourse || selectedCategory || selectedFileType) ? (
                <Button variant="outline" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              ) : (
                <FileUploadButton>
                  رفع أول ملف
                </FileUploadButton>
              )}
            </div>
          ) : (
            <FilesList />
          )}
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          open={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedCourseFilesManagement;