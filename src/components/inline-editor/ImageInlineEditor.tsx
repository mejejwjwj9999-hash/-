import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { MediaPicker } from './MediaPicker';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageInlineEditorProps {
  contentAr: string;
  contentEn: string;
  metadata: any;
  onContentArChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
  onMetadataChange: (metadata: any) => void;
  activeTab: string;
}

export const ImageInlineEditor: React.FC<ImageInlineEditorProps> = ({
  contentAr,
  contentEn,
  metadata = {},
  onContentArChange,
  onContentEnChange,
  onMetadataChange,
  activeTab
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleImageSelect = (imageUrl: string, imageData?: any) => {
    if (activeTab === 'ar') {
      onContentArChange(imageUrl);
    } else {
      onContentEnChange(imageUrl);
    }
    
    if (imageData) {
      onMetadataChange({
        ...metadata,
        url: imageUrl,
        alt: imageData.alt_text_ar || imageData.alt_text_en || '',
        width: imageData.dimensions?.width,
        height: imageData.dimensions?.height
      });
    }
    
    setIsPickerOpen(false);
  };

  const currentImageUrl = activeTab === 'ar' ? contentAr : contentEn;
  const altText = metadata?.alt || '';

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      {currentImageUrl && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <Label className="block mb-2">معاينة الصورة:</Label>
          <img 
            src={currentImageUrl} 
            alt={altText}
            className="max-w-full h-auto max-h-48 rounded border object-cover"
          />
        </div>
      )}

      {/* Image Selection */}
      <div className="space-y-2">
        <Label>اختيار الصورة:</Label>
        <div className="flex gap-2">
          <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <ImageIcon className="h-4 w-4 mr-2" />
                اختر من المكتبة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <MediaPicker 
                onSelect={handleImageSelect}
                onCancel={() => setIsPickerOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Image URL Input */}
      <div className="space-y-2">
        <Label htmlFor="image-url">رابط الصورة:</Label>
        <Input
          id="image-url"
          value={currentImageUrl}
          onChange={(e) => {
            if (activeTab === 'ar') {
              onContentArChange(e.target.value);
            } else {
              onContentEnChange(e.target.value);
            }
          }}
          placeholder="https://example.com/image.jpg"
          className={activeTab === 'ar' ? 'text-right' : 'text-left'}
        />
      </div>

      {/* Alt Text */}
      <div className="space-y-2">
        <Label htmlFor="alt-text">النص البديل للصورة:</Label>
        <Input
          id="alt-text"
          value={altText}
          onChange={(e) => onMetadataChange({ ...metadata, alt: e.target.value })}
          placeholder="وصف الصورة..."
          className="text-right"
        />
      </div>

      {/* Image Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">العرض (px):</Label>
          <Input
            id="width"
            type="number"
            value={metadata?.width || ''}
            onChange={(e) => onMetadataChange({ 
              ...metadata, 
              width: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="تلقائي"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">الارتفاع (px):</Label>
          <Input
            id="height"
            type="number"
            value={metadata?.height || ''}
            onChange={(e) => onMetadataChange({ 
              ...metadata, 
              height: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="تلقائي"
          />
        </div>
      </div>
    </div>
  );
};