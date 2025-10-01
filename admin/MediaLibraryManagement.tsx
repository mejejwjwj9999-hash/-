import React, { useState, useCallback } from 'react';
import { Upload, Edit, Trash2, Search, Filter, Image as ImageIcon, Video, FileText, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminMediaLibrary, useDeleteMedia } from '@/hooks/useAdminMediaLibrary';
import { MediaUploadModal } from './modals/MediaUploadModal';
import { MediaEditModal } from './modals/MediaEditModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export const MediaLibraryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: mediaItems = [], isLoading } = useAdminMediaLibrary(filterType === 'all' ? undefined : filterType as any);
  const deleteMedia = useDeleteMedia();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles);
    setIsUploadModalOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: true
  });

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt_text_ar?.includes(searchTerm) ||
                         item.description_ar?.includes(searchTerm);
    return matchesSearch;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMedia.mutateAsync(id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaIcon = (mediaType: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      image: ImageIcon,
      video: Video,
      document: FileText,
      audio: Music
    };
    const IconComponent = icons[mediaType] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getMediaTypeBadge = (mediaType: string) => {
    const labels: Record<string, string> = {
      image: 'صورة',
      video: 'فيديو',
      document: 'مستند',
      audio: 'صوت'
    };
    
    const colors: Record<string, string> = {
      image: 'bg-green-100 text-green-800',
      video: 'bg-blue-100 text-blue-800',
      document: 'bg-orange-100 text-orange-800',
      audio: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[mediaType] || 'bg-gray-100 text-gray-800'}>
        {getMediaIcon(mediaType)}
        <span className="mr-1">{labels[mediaType] || mediaType}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-academic-gray">جاري تحميل المكتبة الإعلامية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">المكتبة الإعلامية</h2>
          <p className="text-academic-gray">إدارة الصور والفيديوهات والملفات</p>
        </div>
        <Button 
          onClick={() => setIsUploadModalOpen(true)} 
          className="bg-university-blue hover:bg-university-blue-light"
        >
          <Upload className="w-4 h-4 ml-2" />
          رفع ملفات جديدة
        </Button>
      </div>

      {/* Drag & Drop Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-university-blue bg-university-blue/5' 
                : 'border-gray-300 hover:border-university-blue'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-academic-gray" />
            {isDragActive ? (
              <p className="text-university-blue font-medium">اترك الملفات هنا لرفعها...</p>
            ) : (
              <div>
                <p className="text-academic-gray mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                <p className="text-sm text-academic-gray">يدعم: الصور، الفيديوهات، PDF، الملفات الصوتية</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray w-4 h-4" />
              <Input
                placeholder="البحث في الملفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الملف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="image">صور</SelectItem>
                <SelectItem value="video">فيديوهات</SelectItem>
                <SelectItem value="document">مستندات</SelectItem>
                <SelectItem value="audio">ملفات صوتية</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-academic-gray flex items-center">
              <Filter className="w-4 h-4 ml-1" />
              {filteredItems.length} من {mediaItems.length} ملف
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                {item.media_type === 'image' ? (
                  <img 
                    src={item.file_path} 
                    alt={item.alt_text_ar || item.file_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                ) : item.media_type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video 
                      src={item.file_path}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getMediaIcon(item.media_type)}
                    <span className="text-xs text-academic-gray mt-2">
                      {item.file_name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  {getMediaTypeBadge(item.media_type)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h4 className="font-medium text-sm line-clamp-2 text-right">
                  {item.alt_text_ar || item.file_name}
                </h4>
                {item.description_ar && (
                  <p className="text-xs text-academic-gray mt-1 line-clamp-2 text-right">
                    {item.description_ar}
                  </p>
                )}
              </div>

              <div className="text-xs text-academic-gray space-y-1">
                <div>الحجم: {formatFileSize(item.file_size)}</div>
                <div>رفع في: {new Date(item.created_at).toLocaleDateString('ar-YE')}</div>
                <div>الاستخدام: {item.usage_count || 0} مرة</div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 ml-1" />
                  تعديل
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا الملف؟ سيتم حذفه نهائياً من الخادم.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-academic-gray">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">لا توجد ملفات</h3>
            <p className="text-sm">لم يتم العثور على أي ملفات تطابق المعايير المحددة</p>
          </div>
        </div>
      )}

      {/* Modals */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFiles([]);
        }}
        preselectedFiles={selectedFiles}
      />

      <MediaEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </div>
  );
};