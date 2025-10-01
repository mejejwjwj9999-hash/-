import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Search, Image as ImageIcon } from 'lucide-react';
import { useImages } from '@/hooks/useMediaLibrary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MediaPickerProps {
  onSelect: (imageUrl: string, imageData?: any) => void;
  onCancel: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onCancel }) => {
  const { data: images, isLoading } = useImages();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const filteredImages = images?.filter(image => 
    image.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (image.alt_text_ar && image.alt_text_ar.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `content-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-media')
        .getPublicUrl(filePath);

      // Save to media library
      const { data: mediaData, error: mediaError } = await supabase
        .from('admin_media_library')
        .insert({
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          mime_type: file.type,
          file_size: file.size,
          media_type: 'image',
          alt_text_ar: file.name.replace(/\.[^/.]+$/, ''),
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      onSelect(publicUrl, mediaData);
      toast({ title: 'تم رفع الصورة بنجاح' });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'خطأ في رفع الصورة',
        description: 'حدث خطأ أثناء رفع الصورة',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">اختيار صورة</h3>
        <Button variant="ghost" onClick={onCancel}>
          إلغاء
        </Button>
      </div>

      {/* Upload New Image */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          disabled={uploadingImage}
          className="hidden"
          id="image-upload"
        />
        <Label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-lg font-medium">رفع صورة جديدة</p>
          <p className="text-sm text-muted-foreground">اختر صورة من جهازك</p>
        </Label>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث في الصور..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Images Grid */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">جاري تحميل الصور...</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredImages.map((image) => {
              const imageUrl = supabase.storage
                .from('site-media')
                .getPublicUrl(image.file_path).data.publicUrl;

              return (
                <div
                  key={image.id}
                  className="relative cursor-pointer group aspect-square"
                  onClick={() => onSelect(imageUrl, image)}
                >
                  <img
                    src={imageUrl}
                    alt={image.alt_text_ar || image.original_name}
                    className="w-full h-full object-cover rounded border-2 border-transparent group-hover:border-primary transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>لا توجد صور متاحة</p>
            {searchQuery && (
              <p className="text-sm mt-2">لم يتم العثور على صور تطابق "{searchQuery}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};