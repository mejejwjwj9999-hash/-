import React, { useState, useCallback, useMemo } from 'react';
import { Search, Upload, Download, Trash2, Edit, Eye, Star, FolderPlus, Grid3X3, List, Filter, MoreVertical, Copy, Share, Image, FileText, Music, Video, Package, Palette, Code, Archive, Settings, File } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import MediaLibrary from './MediaLibrary';
import IconLibrary from './IconLibrary';

// أنواع الأصول
const ASSET_TYPES = {
  images: {
    label: 'الصور',
    icon: Image,
    description: 'صور وملفات رسومية',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  },
  videos: {
    label: 'الفيديوهات',
    icon: Video,
    description: 'ملفات الفيديو',
    extensions: ['.mp4', '.webm', '.ogg', '.avi', '.mov']
  },
  audio: {
    label: 'الصوتيات',
    icon: Music,
    description: 'ملفات الصوت',
    extensions: ['.mp3', '.wav', '.ogg', '.m4a']
  },
  documents: {
    label: 'المستندات',
    icon: FileText,
    description: 'ملفات PDF والمستندات',
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf']
  },
  icons: {
    label: 'الأيقونات',
    icon: Palette,
    description: 'مكتبة الأيقونات والرموز',
    extensions: []
  },
  fonts: {
    label: 'الخطوط',
    icon: Code,
    description: 'ملفات الخطوط',
    extensions: ['.woff', '.woff2', '.ttf', '.otf']
  },
  templates: {
    label: 'القوالب',
    icon: Package,
    description: 'قوالب جاهزة للمحتوى',
    extensions: []
  },
  archives: {
    label: 'الأرشيف',
    icon: Archive,
    description: 'الملفات المؤرشفة والمضغوطة',
    extensions: ['.zip', '.rar', '.7z']
  }
};

interface Asset {
  id: string;
  name: string;
  type: keyof typeof ASSET_TYPES;
  file_path?: string;
  file_size?: number;
  thumbnail?: string;
  metadata: any;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  usage_count: number;
  folder_id?: string;
}

interface AssetManagerProps {
  onAssetSelect?: (asset: Asset) => void;
  selectedAssets?: Asset[];
  multiSelect?: boolean;
  allowedTypes?: Array<keyof typeof ASSET_TYPES>;
  showUpload?: boolean;
  showSearch?: boolean;
  className?: string;
}

export const AssetManager = ({
  onAssetSelect,
  selectedAssets = [],
  multiSelect = false,
  allowedTypes = Object.keys(ASSET_TYPES) as Array<keyof typeof ASSET_TYPES>,
  showUpload = true,
  showSearch = true,
  className = ''
}: AssetManagerProps) => {
  const [activeTab, setActiveTab] = useState<keyof typeof ASSET_TYPES>('images');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // بيانات وهمية للأصول
  const assets: Asset[] = [
    {
      id: '1',
      name: 'شعار الشركة',
      type: 'images',
      file_path: '/assets/logo.png',
      file_size: 145678,
      thumbnail: '/assets/logo-thumb.png',
      metadata: { width: 200, height: 100, format: 'PNG' },
      tags: ['شعار', 'هوية', 'براند'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      is_favorite: true,
      usage_count: 25
    },
    {
      id: '2',
      name: 'فيديو تعريفي',
      type: 'videos',
      file_path: '/assets/intro.mp4',
      file_size: 15728640,
      thumbnail: '/assets/intro-thumb.jpg',
      metadata: { duration: 120, width: 1920, height: 1080, format: 'MP4' },
      tags: ['تعريفي', 'مؤسسي', 'فيديو'],
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z',
      is_favorite: false,
      usage_count: 12
    },
    {
      id: '3',
      name: 'خط عربي مخصص',
      type: 'fonts',
      file_path: '/assets/fonts/custom-arabic.woff2',
      file_size: 256789,
      metadata: { family: 'CustomArabic', weight: 400, style: 'normal' },
      tags: ['خط', 'عربي', 'مخصص'],
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z',
      is_favorite: true,
      usage_count: 8
    }
  ];

  // تصفية الأصول
  const filteredAssets = useMemo(() => {
    let items = assets.filter(asset => 
      allowedTypes.includes(asset.type) &&
      (searchTerm === '' || 
       asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       asset.tags.some(tag => tag.includes(searchTerm)))
    );

    return items;
  }, [allowedTypes, searchTerm]);

  // أصول التبويب النشط
  const currentTabAssets = useMemo(() => {
    return filteredAssets.filter(asset => asset.type === activeTab);
  }, [filteredAssets, activeTab]);

  // اختيار أصل
  const handleAssetSelect = useCallback((asset: Asset) => {
    if (multiSelect) {
      setSelectedItems(prev => 
        prev.includes(asset.id)
          ? prev.filter(id => id !== asset.id)
          : [...prev, asset.id]
      );
    } else {
      onAssetSelect?.(asset);
    }
  }, [multiSelect, onAssetSelect]);

  // رفع الملفات
  const handleFileUpload = useCallback(async (files: FileList, type: keyof typeof ASSET_TYPES) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // التحقق من نوع الملف
        const allowedExtensions = ASSET_TYPES[type].extensions;
        if (allowedExtensions.length > 0) {
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          if (!allowedExtensions.includes(fileExtension)) {
            throw new Error(`نوع الملف ${file.name} غير مدعوم لهذا القسم`);
          }
        }

        // محاكاة رفع الملف
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUploadProgress(((index + 1) / files.length) * 100);
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: 'تم الرفع بنجاح',
        description: `تم رفع ${files.length} ملف إلى ${ASSET_TYPES[type].label}`
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
  }, []);

  // تنسيق حجم الملف
  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // رندر بطاقة الأصل
  const renderAssetCard = (asset: Asset) => {
    const isSelected = selectedItems.includes(asset.id);
    const TypeIcon = ASSET_TYPES[asset.type].icon;

    return (
      <Card 
        key={asset.id}
        className={`
          group cursor-pointer transition-all hover:shadow-md
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
        onClick={() => handleAssetSelect(asset)}
      >
        <CardContent className="p-3">
          {viewMode === 'grid' ? (
            <div className="space-y-3">
              {/* معاينة الأصل */}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {asset.thumbnail ? (
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <TypeIcon className="h-8 w-8 text-muted-foreground" />
                )}
                
                {/* علامة المفضلة */}
                {asset.is_favorite && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  </div>
                )}
                
                {/* شارة الاستخدام */}
                {asset.usage_count > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {asset.usage_count} استخدام
                    </Badge>
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
              </div>
              
              {/* معلومات الأصل */}
              <div className="space-y-1">
                <div className="font-medium text-sm truncate" title={asset.name}>
                  {asset.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {asset.file_size && formatFileSize(asset.file_size)}
                </div>
                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{asset.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // عرض القائمة
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {asset.thumbnail ? (
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <TypeIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="font-medium truncate">{asset.name}</div>
                  {asset.is_favorite && (
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {asset.file_size && formatFileSize(asset.file_size)} • {ASSET_TYPES[asset.type].label}
                </div>
                <div className="text-xs text-muted-foreground flex items-center space-x-2 space-x-reverse">
                  <span>{asset.usage_count} استخدام</span>
                  <span>•</span>
                  <span>{asset.tags.join('، ')}</span>
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

  // رندر منطقة رفع الملفات
  const renderUploadArea = (type: keyof typeof ASSET_TYPES) => {
    const typeConfig = ASSET_TYPES[type];
    const IconComponent = typeConfig.icon;
    
    return (
      <div className="relative">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
          <IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">رفع {typeConfig.label}</h3>
          <p className="text-muted-foreground mb-4">{typeConfig.description}</p>
          <Button>
            <Upload className="h-4 w-4 ml-2" />
            اختر الملفات
          </Button>
          {typeConfig.extensions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              الأنواع المدعومة: {typeConfig.extensions.join('، ')}
            </p>
          )}
        </div>
        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, type)}
          accept={typeConfig.extensions.join(',')}
        />
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-background ${className}`}>
      {/* شريط الأدوات العلوي */}
      <div className="p-4 border-b space-y-3">
        {/* شريط البحث */}
        {showSearch && (
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في جميع الأصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
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
          </div>
        )}

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

        {/* معلومات التحديد */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between">
            <Badge>
              {selectedItems.length} عنصر محدد
            </Badge>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* تبويبات الأصول */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof ASSET_TYPES)} className="h-full flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start">
            {allowedTypes.map((type) => {
              const typeConfig = ASSET_TYPES[type];
              const typeAssets = filteredAssets.filter(asset => asset.type === type);
              
              return (
                <TabsTrigger key={type} value={type} className="flex items-center space-x-2 space-x-reverse">
                  <typeConfig.icon className="h-4 w-4" />
                  <span>{typeConfig.label}</span>
                  <Badge variant="secondary">{typeAssets.length}</Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {allowedTypes.map((type) => (
            <TabsContent key={type} value={type} className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {/* محتوى خاص لكل نوع */}
                  {type === 'icons' ? (
                    <IconLibrary onIconSelect={(iconName) => console.log('Selected icon:', iconName)} />
                  ) : type === 'images' || type === 'videos' || type === 'audio' || type === 'documents' ? (
                    <MediaLibrary 
                      allowedTypes={[type === 'images' ? 'image' : type === 'videos' ? 'video' : type === 'documents' ? 'document' : type]} 
                      onMediaSelect={(media) => console.log('Selected media:', media)}
                    />
                  ) : currentTabAssets.length > 0 ? (
                    // عرض الأصول العادية
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {currentTabAssets.map(renderAssetCard)}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentTabAssets.map(renderAssetCard)}
                      </div>
                    )
                  ) : (
                    // منطقة فارغة مع إمكانية الرفع
                    <div className="text-center py-12">
                      {showUpload ? (
                        renderUploadArea(type)
                      ) : (
                        <div>
                          <div className="h-12 w-12 text-muted-foreground mx-auto mb-4 flex items-center justify-center">
                            <File className="h-8 w-8" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">لا توجد ملفات</h3>
                          <p className="text-muted-foreground">
                            {searchTerm 
                              ? 'لم يتم العثور على أصول تطابق معايير البحث'
                              : 'لم يتم رفع أي ملفات بعد'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default AssetManager;