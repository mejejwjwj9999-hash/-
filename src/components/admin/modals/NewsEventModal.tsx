import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Image as ImageIcon, Tag, Save, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedWysiwygEditor } from '../EnhancedWysiwygEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateNewsEvent, useUpdateNewsEvent, NewsEventFormData } from '@/hooks/useAdminNewsEvents';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface NewsEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
}

export const NewsEventModal = ({ isOpen, onClose, editingItem }: NewsEventModalProps) => {
  const [formData, setFormData] = useState<NewsEventFormData>({
    title_ar: '',
    title_en: '',
    summary_ar: '',
    summary_en: '',
    content_ar: '',
    content_en: '',
    type: 'news',
    featured_image: '',
    images: [],
    tags: [],
    event_date: '',
    event_location_ar: '',
    event_location_en: '',
    is_featured: false,
    is_breaking: false,
    status: 'draft'
  });
  
  const [newTag, setNewTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNewsEvent = useCreateNewsEvent();
  const updateNewsEvent = useUpdateNewsEvent();
  const { uploadImage, isUploading } = useImageUpload();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title_ar: editingItem.title_ar || '',
        title_en: editingItem.title_en || '',
        summary_ar: editingItem.summary_ar || '',
        summary_en: editingItem.summary_en || '',
        content_ar: editingItem.content_ar || '',
        content_en: editingItem.content_en || '',
        type: editingItem.type || 'news',
        featured_image: editingItem.featured_image || '',
        images: editingItem.images || [],
        tags: editingItem.tags || [],
        event_date: editingItem.event_date ? new Date(editingItem.event_date).toISOString().slice(0, 16) : '',
        event_location_ar: editingItem.event_location_ar || '',
        event_location_en: editingItem.event_location_en || '',
        is_featured: editingItem.is_featured || false,
        is_breaking: editingItem.is_breaking || false,
        status: editingItem.status || 'draft'
      });
      
      // Set image preview if there's an existing image
      if (editingItem.featured_image && !editingItem.featured_image.startsWith('data:')) {
        setImagePreview(editingItem.featured_image);
      }
    } else {
      setFormData({
        title_ar: '',
        title_en: '',
        summary_ar: '',
        summary_en: '',
        content_ar: '',
        content_en: '',
        type: 'news',
        featured_image: '',
        images: [],
        tags: [],
        event_date: '',
        event_location_ar: '',
        event_location_en: '',
        is_featured: false,
        is_breaking: false,
        status: 'draft'
      });
      setImagePreview('');
      setSelectedImage(null);
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ar.trim()) {
      toast.error('العنوان باللغة العربية مطلوب');
      return;
    }

    try {
      let finalImageUrl = formData.featured_image;

      // Upload new image if selected
      if (selectedImage) {
        toast.info('جاري رفع الصورة...');
        finalImageUrl = await uploadImage(selectedImage);
      }

      const submitData = {
        ...formData,
        featured_image: finalImageUrl,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : undefined
      };

      if (editingItem) {
        await updateNewsEvent.mutateAsync({
          id: editingItem.id,
          data: submitData
        });
      } else {
        await createNewsEvent.mutateAsync(submitData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving news/event:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    // Keep existing featured_image if editing, only clear if it was a preview
    if (!editingItem || selectedImage) {
      setFormData(prev => ({ ...prev, featured_image: '' }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-200 pb-4 mb-6">
          <DialogTitle className="flex items-center justify-between text-right bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {formData.type === 'news' ? (
                  <ImageIcon className="w-6 h-6 text-primary" />
                ) : (
                  <Calendar className="w-6 h-6 text-primary" />
                )}
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {editingItem ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-red-100 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent rounded-t-lg">
              <CardTitle className="text-xl font-bold text-right text-slate-800 flex items-center justify-end gap-3">
                <span>المعلومات الأساسية</span>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-primary" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">نوع المحتوى</Label>
                  <Select value={formData.type} onValueChange={(value: 'news' | 'event') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">خبر</SelectItem>
                      <SelectItem value="event">فعالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">حالة النشر</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title_ar">العنوان (عربي) *</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  className="text-right"
                  placeholder="أدخل العنوان باللغة العربية"
                  required
                />
              </div>

              <div>
                <Label htmlFor="title_en">العنوان (إنجليزي)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Enter title in English"
                />
              </div>

              <div>
                <Label htmlFor="summary_ar">الملخص (عربي)</Label>
                <Textarea
                  id="summary_ar"
                  value={formData.summary_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary_ar: e.target.value }))}
                  className="text-right min-h-[100px]"
                  placeholder="أدخل ملخص المحتوى باللغة العربية"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-l from-blue-50 to-transparent rounded-t-lg">
              <CardTitle className="text-xl font-bold text-right text-slate-800 flex items-center justify-end gap-3">
                <span>المحتوى</span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label htmlFor="content_ar" className="text-lg font-semibold text-slate-700">المحتوى الكامل (عربي)</Label>
                <EnhancedWysiwygEditor
                  value={formData.content_ar}
                  onChange={(value) => setFormData(prev => ({ ...prev, content_ar: value }))}
                  placeholder="أدخل المحتوى الكامل باللغة العربية..."
                  height="400px"
                  language="ar"
                  autoSave={false}
                  showAdvancedFeatures={true}
                  enableAI={true}
                  enableVersionHistory={false}
                  enableImageEditing={true}
                />
              </div>
              
              <div>
                <Label htmlFor="content_en" className="text-lg font-semibold text-slate-700">المحتوى الكامل (إنجليزي)</Label>
                <EnhancedWysiwygEditor
                  value={formData.content_en}
                  onChange={(value) => setFormData(prev => ({ ...prev, content_en: value }))}
                  placeholder="Enter full content in English..."
                  height="400px"
                  language="en"
                  autoSave={false}
                  showAdvancedFeatures={true}
                  enableAI={true}
                  enableVersionHistory={false}
                  enableImageEditing={true}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-slate-700">الصورة المميزة</Label>
                
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-700">
                          {isUploading ? 'جاري رفع الصورة...' : 'اضغط لرفع صورة'}
                        </p>
                        <p className="text-sm text-slate-500">أو اسحب الملف هنا</p>
                        <p className="text-xs text-slate-400 mt-2">
                          الأنواع المدعومة: JPG, PNG, GIF (الحد الأقصى: 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-primary/20">
                      <img 
                        src={imagePreview} 
                        alt="معاينة الصورة"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/90 hover:bg-white"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={removeImage}
                            className="bg-red-500/90 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 text-right">
                      <span className="font-medium">الملف:</span> {selectedImage?.name}
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          {formData.type === 'event' && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-l from-green-100/50 to-transparent rounded-t-lg">
                <CardTitle className="text-xl font-bold text-right text-slate-800 flex items-center justify-end gap-3">
                  <span>تفاصيل الفعالية</span>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="event_date" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    تاريخ ووقت الفعالية
                  </Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="border-2 border-slate-200 focus:border-green-500 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="event_location_ar" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    موقع الفعالية (عربي)
                  </Label>
                  <Input
                    id="event_location_ar"
                    value={formData.event_location_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_location_ar: e.target.value }))}
                    className="text-right border-2 border-slate-200 focus:border-green-500 rounded-xl"
                    placeholder="أدخل موقع الفعالية..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-l from-purple-100/50 to-transparent rounded-t-lg">
              <CardTitle className="text-xl font-bold text-right text-slate-800 flex items-center justify-end gap-3">
                <span>العلامات والكلمات المفتاحية</span>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex gap-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="أضف كلمة مفتاحية جديدة..."
                  className="text-right border-2 border-slate-200 focus:border-purple-500 rounded-xl flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button 
                  type="button" 
                  onClick={addTag} 
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6"
                >
                  <Tag className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm font-medium text-slate-600 mb-3 text-right">العلامات المضافة:</p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-l from-amber-100/50 to-transparent rounded-t-lg">
              <CardTitle className="text-xl font-bold text-right text-slate-800 flex items-center justify-end gap-3">
                <span>إعدادات النشر</span>
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Save className="w-4 h-4 text-amber-600" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="is_featured" className="text-lg font-medium text-slate-700">محتوى مميز</Label>
                    <p className="text-sm text-slate-500 mt-1">سيظهر في الصفحة الرئيسية</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </div>

              {formData.type === 'news' && (
                <div className="bg-white/60 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <Label htmlFor="is_breaking" className="text-lg font-medium text-slate-700 text-red-600">خبر عاجل</Label>
                      <p className="text-sm text-slate-500 mt-1">سيظهر بشكل بارز في أعلى الموقع</p>
                    </div>
                    <Switch
                      id="is_breaking"
                      checked={formData.is_breaking}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_breaking: checked }))}
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-6 pt-8 pb-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-8 py-3 border-2 border-slate-300 hover:border-slate-400 rounded-xl text-slate-600 hover:text-slate-700 font-medium"
            >
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              disabled={createNewsEvent.isPending || updateNewsEvent.isPending}
            >
              <Save className="w-4 h-4 ml-2" />
              {createNewsEvent.isPending || updateNewsEvent.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingItem ? 'جاري التحديث...' : 'جاري الحفظ...'}
                </span>
              ) : (
                editingItem ? 'تحديث المحتوى' : 'حفظ المحتوى'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};