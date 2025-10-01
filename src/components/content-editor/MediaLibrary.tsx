import React, { useState, useCallback, useMemo } from 'react';
import { Search, Upload, Folder, Image, Video, FileText, Music, Grid3X3, List, Filter, Download, Trash2, Edit, Eye, Star, FolderPlus, SortAsc, SortDesc, MoreVertical, Copy, Share } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// أنواع الملفات المدعومة
const SUPPORTED_FILE_TYPES = {
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    icon: Image,
    label: 'صور'
  },
  video: {
    extensions: ['.mp4', '.webm', '.ogg', '.avi', '.mov'],
    icon: Video,
    label: 'فيديو'
  },
  audio: {
    extensions: ['.mp3', '.wav', '.ogg', '.m4a'],
    icon: Music,
    label: 'صوت'
  },
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    icon: FileText,
    label: 'مستندات'
  }
};

// حجم الملف المعروض
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  media_type: 'image' | 'video' | 'audio' | 'document';
  mime_type: string;
  metadata: any;
  folder_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}

interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  color?: string;
  created_at: string;
  item_count: number;
}

interface MediaLibraryProps {
  onMediaSelect?: (media: MediaItem) => void;
  selectedMedia?: MediaItem[];
  multiSelect?: boolean;
  allowedTypes?: Array<keyof typeof SUPPORTED_FILE_TYPES>;
  maxFileSize?: number;
  showUpload?: boolean;
  showFolders?: boolean;
  className?: string;
}

export const MediaLibrary = ({
  onMediaSelect,
  selectedMedia = [],
  multiSelect = false,
  allowedTypes = ['image', 'video', 'audio', 'document'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  showUpload = true,
  showFolders = true,
  className = ''
}: MediaLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // بيانات وهمية للمجلدات
  const folders: Folder[] = [
    { id: '1', name: 'الصور', item_count: 45, created_at: '2024-01-01' },
    { id: '2', name: 'الفيديوهات', item_count: 12, created_at: '2024-01-02', color: '#ef4444' },
    { id: '3', name: 'المستندات', item_count: 28, created_at: '2024-01-03', color: '#3b82f6' },
    { id: '4', name: 'المفضلة', item_count: 8, created_at: '2024-01-04', color: '#f59e0b' }
  ];

  // بيانات وهمية للوسائط
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      name: 'hero-image.jpg',
      file_path: '/media/hero-image.jpg',
      file_size: 2048000,
      media_type: 'image',
      mime_type: 'image/jpeg',
      metadata: { width: 1920, height: 1080 },
      tags: ['بانر', 'رئيسية'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      is_favorite: true
    },
    {
      id: '2',
      name: 'intro-video.mp4',
      file_path: '/media/intro-video.mp4',
      file_size: 15728640,
      media_type: 'video',
      mime_type: 'video/mp4',
      metadata: { duration: 120, width: 1280, height: 720 },
      tags: ['مقدمة', 'فيديو'],
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z'
    }
  ];

  const { data: libraryData, isLoading } = useMediaLibrary();

  // تصفية وترتيب الوسائط
  const filteredMedia = useMemo(() => {
    // تحويل بيانات المكتبة إلى تنسيق MediaItem
    const normalizedLibraryData = libraryData?.map(item => ({
      id: item.id,
      name: item.file_name,
      file_path: item.file_path,
      file_size: item.file_size,
      media_type: item.media_type as 'image' | 'video' | 'audio' | 'document',
      mime_type: item.mime_type,
      metadata: item.dimensions || {},
      folder_id: undefined,
      tags: item.tags || [],
      created_at: item.created_at,
      updated_at: item.updated_at,
      is_favorite: false
    })) || [];
    
    let items = normalizedLibraryData.length > 0 ? normalizedLibraryData : mediaItems;

    // تصفية حسب النوع
    if (filterType !== 'all') {
      items = items.filter(item => item.media_type === filterType);
    }

    // تصفية حسب الأنواع المسموحة
    items = items.filter(item => allowedTypes.includes(item.media_type));

    // تصفية حسب المجلد
    if (selectedFolder) {
      items = items.filter(item => item.folder_id === selectedFolder);
    }

    // تصفية حسب البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.includes(term))
      );
    }

    // ترتيب النتائج
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
        case 'type':
          comparison = a.media_type.localeCompare(b.media_type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [libraryData, filterType, allowedTypes, selectedFolder, searchTerm, sortBy, sortOrder]);

  // اختيار عنصر
  const handleItemSelect = useCallback((item: MediaItem) => {
    if (multiSelect) {
      setSelectedItems(prev => 
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      onMediaSelect?.(item);
    }
  }, [multiSelect, onMediaSelect]);

  // رفع الملفات
  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // التحقق من نوع الملف
        const fileType = Object.entries(SUPPORTED_FILE_TYPES).find(([_, config]) =>
          config.extensions.some(ext => file.name.toLowerCase().endsWith(ext))
        )?.[0];

        if (!fileType || !allowedTypes.includes(fileType as any)) {
          throw new Error(`نوع الملف ${file.name} غير مدعوم`);
        }

        // التحقق من حجم الملف
        if (file.size > maxFileSize) {
          throw new Error(`حجم الملف ${file.name} كبير جداً`);
        }

        // محاكاة رفع الملف
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUploadProgress(((index + 1) / files.length) * 100);
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: 'تم الرفع بنجاح',
        description: `تم رفع ${files.length} ملف بنجاح`
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في الرفع',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [allowedTypes, maxFileSize]);

  // رندر عنصر الوسائط
  const renderMediaItem = (item: MediaItem) => {
    const isSelected = selectedItems.includes(item.id);
    const TypeIcon = SUPPORTED_FILE_TYPES[item.media_type].icon;

    return (
      <Card 
        key={item.id}
        className={`
          group cursor-pointer transition-all hover:shadow-md
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
        onClick={() => handleItemSelect(item)}
      >
        <CardContent className="p-3">
          {viewMode === 'grid' ? (
            <div className="space-y-2">
              {/* معاينة الملف */}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {item.media_type === 'image' ? (
                  <img 
                    src={item.file_path} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <TypeIcon className="h-8 w-8 text-muted-foreground" />
                )}
                
                {/* علامة المفضلة */}
                {item.is_favorite && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  </div>
                )}
                
                {/* أزرار التحكم */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 space-x-reverse">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="secondary">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 ml-2" />
                        نسخ الرابط
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 ml-2" />
                        مشاركة
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* خانة الاختيار للوضع المتعدد */}
                {multiSelect && (
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
              
              {/* معلومات الملف */}
              <div className="space-y-1">
                <div className="font-medium text-sm truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{formatFileSize(item.file_size)}</span>
                  <Badge variant="outline" className="text-xs">
                    {SUPPORTED_FILE_TYPES[item.media_type].label}
                  </Badge>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // عرض القائمة
            <div className="flex items-center space-x-3 space-x-reverse">
              {multiSelect && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleItemSelect(item)}
                />
              )}
              
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {item.media_type === 'image' ? (
                  <img 
                    src={item.file_path} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <TypeIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="font-medium truncate">{item.name}</div>
                  {item.is_favorite && (
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatFileSize(item.file_size)} • {SUPPORTED_FILE_TYPES[item.media_type].label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(item.created_at), 'PPP', { locale: ar })}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 space-x-reverse">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 ml-2" />
                      نسخ الرابط
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 ml-2" />
                      مشاركة
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`w-full h-full bg-background ${className}`}>
      {/* شريط الأدوات */}
      <div className="p-4 border-b space-y-3">
        {/* شريط البحث والفلاتر */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في المكتبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          {showUpload && (
            <div className="relative">
              <Button>
                <Upload className="h-4 w-4 ml-2" />
                رفع ملفات
              </Button>
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept={allowedTypes.flatMap(type => SUPPORTED_FILE_TYPES[type].extensions).join(',')}
              />
            </div>
          )}
        </div>

        {/* أدوات العرض والترتيب */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {allowedTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {SUPPORTED_FILE_TYPES[type].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">التاريخ</SelectItem>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="size">الحجم</SelectItem>
                <SelectItem value="type">النوع</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Badge variant="secondary">
              {filteredMedia.length} عنصر
            </Badge>
            
            {selectedItems.length > 0 && (
              <Badge>
                {selectedItems.length} محدد
              </Badge>
            )}
          </div>
        </div>

        {/* شريط التقدم للرفع */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>جاري الرفع...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </div>

      <div className="flex h-full">
        {/* شريط المجلدات */}
        {showFolders && (
          <div className="w-64 border-l bg-muted/30">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">المجلدات</h3>
                <Button size="sm" variant="ghost">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-3 space-y-1">
                <Button
                  variant={selectedFolder === null ? 'default' : 'ghost'}
                  className="w-full justify-start text-right"
                  onClick={() => setSelectedFolder(null)}
                >
                  <Folder className="h-4 w-4 ml-2" />
                  جميع الملفات
                  <Badge variant="secondary" className="mr-auto">
                    {filteredMedia.length}
                  </Badge>
                </Button>
                
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-right"
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <Folder 
                      className="h-4 w-4 ml-2" 
                      style={{ color: folder.color }}
                    />
                    {folder.name}
                    <Badge variant="secondary" className="mr-auto">
                      {folder.item_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* منطقة عرض الوسائط */}
        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-4">
              {filteredMedia.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map(renderMediaItem)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMedia.map(renderMediaItem)}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد ملفات</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'لم يتم العثور على ملفات تطابق معايير البحث'
                      : 'ابدأ برفع الملفات إلى مكتبة الوسائط'
                    }
                  </p>
                  {showUpload && !searchTerm && (
                    <div className="relative inline-block">
                      <Button>
                        <Upload className="h-4 w-4 ml-2" />
                        رفع أول ملف
                      </Button>
                      <input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        accept={allowedTypes.flatMap(type => SUPPORTED_FILE_TYPES[type].extensions).join(',')}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;