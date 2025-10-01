import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload, Search, Filter, Grid, List, Play, Pause,
  Image as ImageIcon, Video, Music, FileText, Download,
  Edit, Trash2, Eye, Link2, Copy, Folder, Star,
  Clock, Hash, Tag
} from 'lucide-react';
import { useImages } from '@/hooks/useMediaLibrary';
import { toast } from '@/hooks/use-toast';
import ImageEditor from './ImageEditor';

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: MediaItem) => void;
  allowMultiple?: boolean;
  mediaType?: 'image' | 'video' | 'audio' | 'document' | 'all';
}

interface MediaItem {
  id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  media_type: 'image' | 'video' | 'audio' | 'document';
  alt_text_ar?: string;
  alt_text_en?: string;
  description_ar?: string;
  description_en?: string;
  tags: string[];
  dimensions?: any;
  created_at: string;
  usage_count: number;
  last_used_at?: string;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = false,
  mediaType = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'usage'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: mediaItems = [], isLoading, refetch } = useImages();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        // محاكاة رفع الملف
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({ title: "نجح الرفع", description: `تم رفع ${acceptedFiles.length} ملف بنجاح` });
      refetch();
    } catch (error) {
      toast({ 
        title: "خطأ في الرفع", 
        description: "فشل في رفع بعض الملفات", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const filteredMedia = mediaItems.filter(item => {
    if (mediaType !== 'all' && item.media_type !== mediaType) return false;
    if (searchTerm && !item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.original_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => item.tags.includes(tag))) return false;
    return true;
  });

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.file_name.localeCompare(b.file_name);
        break;
      case 'size':
        comparison = a.file_size - b.file_size;
        break;
      case 'usage':
        comparison = a.usage_count - b.usage_count;
        break;
      case 'date':
      default:
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleSelect = (item: MediaItem) => {
    if (allowMultiple) {
      setSelectedItems(prev => 
        prev.find(i => i.id === item.id)
          ? prev.filter(i => i.id !== item.id)
          : [...prev, item]
      );
    } else {
      onSelect?.(item);
      onClose();
    }
  };

  const confirmSelection = () => {
    if (selectedItems.length > 0) {
      selectedItems.forEach(item => onSelect?.(item));
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "تم النسخ", description: "تم نسخ الرابط إلى الحافظة" });
  };

  const deleteItem = async (item: MediaItem) => {
    if (confirm(`هل أنت متأكد من حذف ${item.original_name}؟`)) {
      try {
        // محاكاة حذف الملف
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({ title: "تم الحذف", description: "تم حذف الملف بنجاح" });
        refetch();
      } catch (error) {
        toast({ 
          title: "خطأ", 
          description: "فشل في حذف الملف", 
          variant: "destructive" 
        });
      }
    }
  };

  const availableTags = Array.from(
    new Set(mediaItems.flatMap(item => item.tags))
  ).sort();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>مدير الوسائط المتعددة</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              {allowMultiple && selectedItems.length > 0 && (
                <Button onClick={confirmSelection}>
                  تحديد ({selectedItems.length})
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* الشريط الجانبي */}
          <div className="w-64 space-y-4">
            {/* رفع الملفات */}
            <Card>
              <CardContent className="p-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    اسحب الملفات هنا أو انقر للاختيار
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    الحد الأقصى: 50MB
                  </p>
                </div>
                {uploading && (
                  <div className="mt-2 text-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">جاري الرفع...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* البحث والفلترة */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>البحث</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الملفات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>الترتيب</Label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field as any);
                      setSortOrder(order as any);
                    }}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="date-desc">الأحدث أولاً</option>
                    <option value="date-asc">الأقدم أولاً</option>
                    <option value="name-asc">الاسم (أ-ي)</option>
                    <option value="name-desc">الاسم (ي-أ)</option>
                    <option value="size-desc">الأكبر حجماً</option>
                    <option value="size-asc">الأصغر حجماً</option>
                    <option value="usage-desc">الأكثر استخداماً</option>
                  </select>
                </div>

                {availableTags.length > 0 && (
                  <div>
                    <Label>العلامات</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {availableTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* منطقة العرض الرئيسية */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="mr-2">جاري التحميل...</span>
                </div>
              ) : sortedMedia.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد ملفات مطابقة للبحث</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                  {sortedMedia.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedItems.find(i => i.id === item.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square bg-muted rounded-lg mb-2 relative overflow-hidden">
                          {item.media_type === 'image' ? (
                            <img
                              src={item.file_path}
                              alt={item.alt_text_ar || item.original_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {getMediaIcon(item.media_type)}
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.media_type}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm font-medium truncate mb-1">
                          {item.original_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.file_size)}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewItem(item);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {item.media_type === 'image' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingImage(item.file_path);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.file_path);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  {sortedMedia.map((item) => (
                    <Card
                      key={item.id}
                      className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedItems.find(i => i.id === item.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.media_type === 'image' ? (
                              <img
                                src={item.file_path}
                                alt={item.alt_text_ar || item.original_name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              getMediaIcon(item.media_type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.original_name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{formatFileSize(item.file_size)}</span>
                              <span>{new Date(item.created_at).toLocaleDateString('ar-SA')}</span>
                              {item.usage_count > 0 && (
                                <span>استخدم {item.usage_count} مرة</span>
                              )}
                            </div>
                            {item.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {item.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.media_type === 'image' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingImage(item.file_path);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.file_path);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* معاينة الملف */}
        {previewItem && (
          <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{previewItem.original_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {previewItem.media_type === 'image' && (
                  <img
                    src={previewItem.file_path}
                    alt={previewItem.alt_text_ar || previewItem.original_name}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                )}
                {previewItem.media_type === 'video' && (
                  <video controls className="w-full max-h-96 rounded-lg">
                    <source src={previewItem.file_path} type={previewItem.mime_type} />
                  </video>
                )}
                {previewItem.media_type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={previewItem.file_path} type={previewItem.mime_type} />
                  </audio>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>الحجم</Label>
                    <p>{formatFileSize(previewItem.file_size)}</p>
                  </div>
                  <div>
                    <Label>النوع</Label>
                    <p>{previewItem.mime_type}</p>
                  </div>
                  <div>
                    <Label>تاريخ الإنشاء</Label>
                    <p>{new Date(previewItem.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <Label>مرات الاستخدام</Label>
                    <p>{previewItem.usage_count}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* محرر الصور */}
        {editingImage && (
          <ImageEditor
            isOpen={!!editingImage}
            onClose={() => setEditingImage(null)}
            imageSrc={editingImage}
            onSave={(editedUrl) => {
              // حفظ الصورة المحررة
              toast({ title: "تم الحفظ", description: "تم حفظ الصورة المحررة" });
              refetch();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaManager;