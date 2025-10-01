import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Eye, 
  Edit2, 
  ImageIcon, 
  Move,
  Download,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface GalleryImage {
  id: string;
  url: string;
  altAr: string;
  altEn: string;
  captionAr: string;
  captionEn: string;
  order: number;
}

interface ImageGalleryEditorProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export const ImageGalleryEditor: React.FC<ImageGalleryEditorProps> = ({ 
  images, 
  onChange 
}) => {
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          url: reader.result as string,
          altAr: '',
          altEn: '',
          captionAr: '',
          captionEn: '',
          order: images.length
        };
        onChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id));
    if (editingImage === id) setEditingImage(null);
    if (previewImage === id) setPreviewImage(null);
  };

  const updateImage = (id: string, field: keyof GalleryImage, value: string | number) => {
    onChange(images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const reorderImages = (newOrder: GalleryImage[]) => {
    const reorderedImages = newOrder.map((img, index) => ({
      ...img,
      order: index
    }));
    onChange(reorderedImages);
  };

  const duplicateImage = (image: GalleryImage) => {
    const newImage: GalleryImage = {
      ...image,
      id: `img-${Date.now()}-${Math.random()}`,
      order: images.length
    };
    onChange([...images, newImage]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          معرض صور الكلية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'اسحب الصور هنا...' : 'رفع صور جديدة'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            اسحب وأفلت الصور هنا، أو انقر لاختيار الملفات
          </p>
          <p className="text-xs text-muted-foreground">
            يدعم: JPG, PNG, WebP, GIF (حد أقصى 10 صور في المرة الواحدة)
          </p>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">الصور المرفوعة ({images.length})</h4>
              <Badge variant="outline" className="flex items-center gap-1">
                <Move className="w-3 h-3" />
                يمكن إعادة الترتيب بالسحب
              </Badge>
            </div>

            <Reorder.Group
              axis="y"
              values={images}
              onReorder={reorderImages}
              className="space-y-3"
            >
              <AnimatePresence>
                {images.map((image) => (
                  <Reorder.Item
                    key={image.id}
                    value={image}
                    className="bg-card border rounded-lg p-4 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.altAr}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-600 text-white hover:bg-red-700 rounded-full"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex-1 space-y-3">
                        {editingImage === image.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">النص البديل (عربي)</Label>
                                <Input
                                  value={image.altAr}
                                  onChange={(e) => updateImage(image.id, 'altAr', e.target.value)}
                                  placeholder="وصف الصورة..."
                                  className="text-right text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">النص البديل (إنجليزي)</Label>
                                <Input
                                  value={image.altEn}
                                  onChange={(e) => updateImage(image.id, 'altEn', e.target.value)}
                                  placeholder="Image description..."
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">التعليق (عربي)</Label>
                                <Textarea
                                  value={image.captionAr}
                                  onChange={(e) => updateImage(image.id, 'captionAr', e.target.value)}
                                  placeholder="تعليق على الصورة..."
                                  className="text-right text-sm"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">التعليق (إنجليزي)</Label>
                                <Textarea
                                  value={image.captionEn}
                                  onChange={(e) => updateImage(image.id, 'captionEn', e.target.value)}
                                  placeholder="Image caption..."
                                  className="text-sm"
                                  rows={2}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setEditingImage(null)}
                              >
                                حفظ
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingImage(null)}
                              >
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm mb-1">
                                  {image.altAr || 'بدون وصف'}
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {image.captionAr || 'بدون تعليق'}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  الترتيب: {image.order + 1}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPreviewImage(image.url)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingImage(image.id)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateImage(image)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لم يتم رفع أي صور بعد</p>
          </div>
        )}

        {/* Preview Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={previewImage}
                alt="معاينة الصورة"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};