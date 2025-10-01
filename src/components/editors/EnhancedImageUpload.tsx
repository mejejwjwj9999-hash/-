import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, Image as ImageIcon, Search, Grid, Link2, 
  Download, Edit, Trash2, Eye, Copy, Filter 
} from 'lucide-react';
import { useImages } from '@/hooks/useMediaLibrary';
import { useImageManagement } from '@/hooks/useImageManagement';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedImageUploadProps {
  onImageSelect: (url: string, altText?: string, metadata?: any) => void;
  trigger?: React.ReactNode;
  title?: string;
  allowEdit?: boolean;
  maxImages?: number;
  className?: string;
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImageSelect,
  trigger,
  title = "إدراج صورة",
  allowEdit = false,
  maxImages = 1,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  const { data: images = [], isLoading } = useImages();
  const imageManager = useImageManagement();

  const filteredImages = images.filter(image => 
    image.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.alt_text_ar && image.alt_text_ar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const results = await imageManager.uploadMultiple(Array.from(files));
    const successfulUploads = results.filter(result => result !== null);

    if (successfulUploads.length > 0) {
      successfulUploads.forEach(result => {
        if (result) {
          onImageSelect(result.url, altText || files[0]?.name);
        }
      });
      setIsOpen(false);
      toast({
        title: 'تم رفع الصور بنجاح',
        description: `تم رفع ${successfulUploads.length} صورة`
      });
    }
  };

  const handleImageSelect = (image: any) => {
    if (maxImages === 1) {
      onImageSelect(
        supabase.storage.from('site-media').getPublicUrl(image.file_path).data.publicUrl,
        image.alt_text_ar || image.original_name,
        image
      );
      setIsOpen(false);
    } else {
      const isSelected = selectedImages.find(img => img.id === image.id);
      if (isSelected) {
        setSelectedImages(prev => prev.filter(img => img.id !== image.id));
      } else if (selectedImages.length < maxImages) {
        setSelectedImages(prev => [...prev, image]);
      } else {
        toast({
          title: 'تحذير',
          description: `يمكنك اختيار ${maxImages} صور كحد أقصى`,
          variant: 'destructive'
        });
      }
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      onImageSelect(imageUrl, altText);
      setIsOpen(false);
      setImageUrl('');
      setAltText('');
    }
  };

  const confirmMultipleSelection = () => {
    selectedImages.forEach(image => {
      onImageSelect(
        supabase.storage.from('site-media').getPublicUrl(image.file_path).data.publicUrl,
        image.alt_text_ar || image.original_name,
        image
      );
    });
    setIsOpen(false);
    setSelectedImages([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            {title}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            {maxImages > 1 && selectedImages.length > 0 && (
              <Button onClick={confirmMultipleSelection}>
                اختيار ({selectedImages.length})
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">رفع جديد</TabsTrigger>
            <TabsTrigger value="library">مكتبة الصور</TabsTrigger>
            <TabsTrigger value="url">رابط خارجي</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Input
                type="file"
                accept="image/*"
                multiple={maxImages > 1}
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
                disabled={imageManager.isUploading}
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">اختر الصور للرفع</p>
                <p className="text-sm text-muted-foreground">
                  {maxImages > 1 ? `يمكنك اختيار حتى ${maxImages} صور` : 'اختر صورة واحدة'}
                </p>
              </Label>
              {imageManager.isUploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
                  {imageManager.uploadProgress > 0 && (
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${imageManager.uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">جاري الرفع...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الصور..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                فلترة
              </Button>
            </div>

            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="mr-3">جاري التحميل...</span>
                </div>
              ) : filteredImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredImages.map((image) => {
                    const imageUrl = supabase.storage
                      .from('site-media')
                      .getPublicUrl(image.file_path).data.publicUrl;
                    
                    const isSelected = selectedImages.find(img => img.id === image.id);

                    return (
                      <Card
                        key={image.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleImageSelect(image)}
                      >
                        <CardContent className="p-2">
                          <div className="aspect-square bg-muted rounded overflow-hidden mb-2 relative">
                            <img
                              src={imageUrl}
                              alt={image.alt_text_ar || image.original_name}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <Badge>محدد</Badge>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium truncate">
                            {image.original_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(image.file_size / 1024)} KB
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>لا توجد صور متاحة</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">لم يتم العثور على صور تطابق "{searchTerm}"</p>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">رابط الصورة</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              
              <div>
                <Label htmlFor="alt-text">النص البديل (اختياري)</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="وصف الصورة"
                />
              </div>

              {imageUrl && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">معاينة:</p>
                  <img 
                    src={imageUrl} 
                    alt={altText}
                    className="max-w-full h-auto max-h-48 rounded"
                    onError={() => toast({
                      title: 'خطأ',
                      description: 'لا يمكن تحميل الصورة من هذا الرابط',
                      variant: 'destructive'
                    })}
                  />
                </div>
              )}

              <Button 
                onClick={handleUrlSubmit} 
                disabled={!imageUrl}
                className="w-full"
              >
                إدراج الصورة
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedImageUpload;