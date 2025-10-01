import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Upload,
  Filter,
  Search,
  FolderOpen,
  File,
  Video,
  Image,
  Archive,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  Calendar
} from 'lucide-react';
import { useAllCourseFiles, useUploadCourseFile } from '@/hooks/useCourseFiles';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface MobileCourseFilesProps {
  onBack?: () => void;
}

const MobileCourseFiles = ({ onBack }: MobileCourseFilesProps) => {
  const { profile } = useAuth();
  const { data: files, isLoading, error } = useAllCourseFiles();
  const uploadFile = useUploadCourseFile();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('video') || fileType.includes('mp4')) return Video;
    if (fileType.includes('image')) return Image;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return File;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'bg-red-500';
    if (fileType.includes('video') || fileType.includes('mp4')) return 'bg-purple-500';
    if (fileType.includes('image')) return 'bg-green-500';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lecture': return 'محاضرة';
      case 'assignment': return 'واجب';
      case 'reference': return 'مرجع';
      default: return 'عام';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      case 'reference': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files?.filter(file => {
    const matchesFilter = filter === 'all' || file.category === filter;
    const matchesSearch = !searchTerm || 
      file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.courses?.course_name_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'video/mp4',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('نوع الملف غير مدعوم. يُرجى اختيار ملف PDF, DOC, PPT أو MP4');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // In a real implementation, you would upload to storage first
      // For now, we'll simulate the upload
      const filePath = `course-files/${Date.now()}-${selectedFile.name}`;
      
      await uploadFile.mutateAsync({
        course_id: 'demo-course-id', // This should come from course selection
        file_name: selectedFile.name,
        file_path: filePath,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        category: 'general',
        description: 'ملف مرفوع من التطبيق المحمول'
      });
      
      setSelectedFile(null);
      alert('تم رفع الملف بنجاح');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('فشل في رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (file: any) => {
    // In a real implementation, this would download from storage
    alert(`تم بدء تحميل الملف: ${file.file_name}`);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-university-blue" />
          <span>جاري تحميل الملفات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <Card className="border-0 shadow-md bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-3 text-red-300" />
            <h3 className="font-medium text-red-800 mb-1">خطأ في تحميل الملفات</h3>
            <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">ملفات المقررات</h1>
          <p className="text-sm text-gray-600">تصفح وحمّل ملفات مقرراتك الدراسية</p>
        </div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <Card className="border-0 shadow-md bg-gradient-to-l from-university-blue/10 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-university-blue flex items-center gap-2">
            <Upload className="h-5 w-5" />
            رفع ملف جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-2 border-dashed border-university-blue/30 rounded-lg p-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer block text-center">
              <Upload className="h-8 w-8 text-university-blue mx-auto mb-2" />
              <p className="text-sm font-medium text-university-blue mb-1">
                {selectedFile ? selectedFile.name : 'اضغط لاختيار ملف'}
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, PPT, MP4 (حتى 10 ميجابايت)
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                size="sm" 
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    رفع الملف
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedFile(null)}
              >
                إلغاء
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الملفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">التصنيف:</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الملفات</SelectItem>
                  <SelectItem value="lecture">محاضرات</SelectItem>
                  <SelectItem value="assignment">واجبات</SelectItem>
                  <SelectItem value="reference">مراجع</SelectItem>
                  <SelectItem value="general">عام</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                <Filter className="h-3 w-3 ml-1" />
                تصفية
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Statistics */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'المجموع', count: files?.length || 0, icon: FolderOpen, color: 'bg-blue-500' },
          { label: 'محاضرات', count: files?.filter(f => f.category === 'lecture').length || 0, icon: FileText, color: 'bg-purple-500' },
          { label: 'واجبات', count: files?.filter(f => f.category === 'assignment').length || 0, icon: Upload, color: 'bg-orange-500' },
          { label: 'مراجع', count: files?.filter(f => f.category === 'reference').length || 0, icon: Archive, color: 'bg-green-500' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-800">{stat.count}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-600 mb-2">لا توجد ملفات</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'ستظهر ملفات مقرراتك هنا'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            
            return (
              <Card key={file.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 ${getFileTypeColor(file.file_type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <FileIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 truncate">{file.file_name}</h3>
                          <p className="text-sm text-gray-600">
                            {file.courses?.course_name_ar} • {file.courses?.course_code}
                          </p>
                        </div>
                        <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
                          {getCategoryLabel(file.category)}
                        </Badge>
                      </div>
                      
                      {file.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{file.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{file.file_size ? formatFileSize(file.file_size) : 'غير محدد'}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(file.created_at), 'MMM dd', { locale: ar })}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(file)}
                            className="h-7 px-2 text-xs"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => alert('معاينة الملف')}
                            className="h-7 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileCourseFiles;