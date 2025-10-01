import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Video, FileText, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateMedia, MediaFormData } from '@/hooks/useAdminMediaLibrary';

interface MediaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
}

export const MediaEditModal = ({ isOpen, onClose, editingItem }: MediaEditModalProps) => {
  const [formData, setFormData] = useState({
    alt_text_ar: '',
    alt_text_en: '',
    description_ar: '',
    description_en: '',
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');

  const updateMedia = useUpdateMedia();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        alt_text_ar: editingItem.alt_text_ar || '',
        alt_text_en: editingItem.alt_text_en || '',
        description_ar: editingItem.description_ar || '',
        description_en: editingItem.description_en || '',
        tags: editingItem.tags || []
      });
    }
  }, [editingItem]);

  const getMediaIcon = (mediaType: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      image: ImageIcon,
      video: Video,
      document: FileText,
      audio: Music
    };
    const IconComponent = icons[mediaType] || FileText;
    return <IconComponent className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem) return;

    try {
      await updateMedia.mutateAsync({
        id: editingItem.id,
        data: formData
      });
      onClose();
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!editingItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">تعديل تفاصيل الملف</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-right flex items-center">
                {getMediaIcon(editingItem.media_type)}
                <span className="mr-2">معلومات الملف</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview */}
                <div>
                  <Label>معاينة</Label>
                  <div className="mt-2 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {editingItem.media_type === 'image' ? (
                      <img 
                        src={editingItem.file_path} 
                        alt={editingItem.alt_text_ar || editingItem.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : editingItem.media_type === 'video' ? (
                      <div className="w-full h-full relative">
                        <video 
                          src={editingItem.file_path}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {getMediaIcon(editingItem.media_type)}
                        <span className="text-xs text-academic-gray mt-2">
                          {editingItem.file_name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>اسم الملف</Label>
                      <p className="text-academic-gray">{editingItem.file_name}</p>
                    </div>
                    <div>
                      <Label>حجم الملف</Label>
                      <p className="text-academic-gray">{formatFileSize(editingItem.file_size)}</p>
                    </div>
                    <div>
                      <Label>نوع الملف</Label>
                      <p className="text-academic-gray">{editingItem.mime_type}</p>
                    </div>
                    <div>
                      <Label>تاريخ الرفع</Label>
                      <p className="text-academic-gray">
                        {new Date(editingItem.created_at).toLocaleDateString('ar-YE')}
                      </p>
                    </div>
                    <div>
                      <Label>عدد الاستخدامات</Label>
                      <p className="text-academic-gray">{editingItem.usage_count || 0} مرة</p>
                    </div>
                    {editingItem.dimensions && (
                      <div>
                        <Label>الأبعاد</Label>
                        <p className="text-academic-gray">
                          {editingItem.dimensions.width} × {editingItem.dimensions.height}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-right">البيانات الوصفية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alt_text_ar">النص البديل (عربي)</Label>
                  <Input
                    id="alt_text_ar"
                    value={formData.alt_text_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text_ar: e.target.value }))}
                    className="text-right"
                    placeholder="وصف الملف باللغة العربية"
                  />
                </div>

                <div>
                  <Label htmlFor="alt_text_en">النص البديل (إنجليزي)</Label>
                  <Input
                    id="alt_text_en"
                    value={formData.alt_text_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text_en: e.target.value }))}
                    placeholder="File description in English"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ar">الوصف (عربي)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  className="text-right min-h-[100px]"
                  placeholder="وصف تفصيلي للملف باللغة العربية"
                />
              </div>

              <div>
                <Label htmlFor="description_en">الوصف (إنجليزي)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  className="min-h-[100px]"
                  placeholder="Detailed file description in English"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-right">العلامات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="أضف علامة جديدة"
                  className="text-right"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  إضافة
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-university-blue-light bg-opacity-20 text-university-blue px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="bg-university-blue hover:bg-university-blue-light"
              disabled={updateMedia.isPending}
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};