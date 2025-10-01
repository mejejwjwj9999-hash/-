import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  X, 
  Save, 
  Eye,
  FileText,
  Globe,
  Info,
  Tag as TagIcon,
  Plus
} from 'lucide-react';
import { useCreateResource, useUpdateResource } from '@/hooks/useDigitalLibrary';
import type { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { toast } from 'sonner';

interface ResourceFormProps {
  resource?: DigitalLibraryResource | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    author_ar: '',
    author_en: '',
    description_ar: '',
    description_en: '',
    resource_type: 'document' as 'document' | 'book' | 'journal' | 'thesis' | 'database' | 'article',
    category: 'general' as 'pharmacy' | 'nursing' | 'it' | 'business' | 'midwifery' | 'general',
    subject_area: '',
    language: 'ar' as 'ar' | 'en' | 'both',
    publication_year: new Date().getFullYear(),
    isbn: '',
    doi: '',
    file_url: '',
    file_size: 0,
    file_type: '',
    thumbnail_url: '',
    access_level: 'public' as 'public' | 'students' | 'faculty' | 'admin',
    status: 'draft' as 'draft' | 'published' | 'archived',
    is_featured: false,
    tags: [] as string[],
    metadata: {}
  });

  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [fileUploading, setFileUploading] = useState(false);

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();

  useEffect(() => {
    if (resource) {
      setFormData({
        title_ar: resource.title_ar || '',
        title_en: resource.title_en || '',
        author_ar: resource.author_ar || '',
        author_en: resource.author_en || '',
        description_ar: resource.description_ar || '',
        description_en: resource.description_en || '',
        resource_type: resource.resource_type,
        category: resource.category,
        subject_area: resource.subject_area || '',
        language: resource.language,
        publication_year: resource.publication_year || new Date().getFullYear(),
        isbn: resource.isbn || '',
        doi: resource.doi || '',
        file_url: resource.file_url || '',
        file_size: resource.file_size || 0,
        file_type: resource.file_type || '',
        thumbnail_url: resource.thumbnail_url || '',
        access_level: resource.access_level,
        status: resource.status,
        is_featured: resource.is_featured,
        tags: resource.tags || [],
        metadata: resource.metadata || {}
      });
    }
  }, [resource]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = async (file: File) => {
    setFileUploading(true);
    try {
      // Here you would implement actual file upload logic
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        file_url: mockUrl,
        file_size: file.size,
        file_type: file.type
      }));
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      toast.error('فشل في رفع الملف');
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ar.trim()) {
      toast.error('يرجى إدخال عنوان المصدر');
      return;
    }

    try {
      if (resource) {
        await updateResource.mutateAsync({ 
          id: resource.id, 
          ...formData 
        });
      } else {
        await createResource.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isLoading = createResource.isPending || updateResource.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">أساسي</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">التفاصيل</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">الملف</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">الإعدادات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان (عربي) *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => handleInputChange('title_ar', e.target.value)}
                    placeholder="أدخل العنوان باللغة العربية"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">العنوان (إنجليزي)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleInputChange('title_en', e.target.value)}
                    placeholder="Enter title in English"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_ar">المؤلف (عربي)</Label>
                  <Input
                    id="author_ar"
                    value={formData.author_ar}
                    onChange={(e) => handleInputChange('author_ar', e.target.value)}
                    placeholder="اسم المؤلف باللغة العربية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_en">المؤلف (إنجليزي)</Label>
                  <Input
                    id="author_en"
                    value={formData.author_en}
                    onChange={(e) => handleInputChange('author_en', e.target.value)}
                    placeholder="Author name in English"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource_type">نوع المصدر</Label>
                  <Select value={formData.resource_type} onValueChange={(value) => handleInputChange('resource_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">كتاب</SelectItem>
                      <SelectItem value="journal">مجلة</SelectItem>
                      <SelectItem value="thesis">رسالة</SelectItem>
                      <SelectItem value="database">قاعدة بيانات</SelectItem>
                      <SelectItem value="article">مقال</SelectItem>
                      <SelectItem value="document">وثيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacy">صيدلة</SelectItem>
                      <SelectItem value="nursing">تمريض</SelectItem>
                      <SelectItem value="it">تكنولوجيا المعلومات</SelectItem>
                      <SelectItem value="business">إدارة أعمال</SelectItem>
                      <SelectItem value="midwifery">قبالة</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">عربي</SelectItem>
                      <SelectItem value="en">إنجليزي</SelectItem>
                      <SelectItem value="both">متعدد اللغات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (عربي)</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange('description_ar', e.target.value)}
                    placeholder="وصف المصدر باللغة العربية"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">الوصف (إنجليزي)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange('description_en', e.target.value)}
                    placeholder="Resource description in English"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publication_year">سنة النشر</Label>
                  <Input
                    id="publication_year"
                    type="number"
                    value={formData.publication_year}
                    onChange={(e) => handleInputChange('publication_year', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="978-3-16-148410-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => handleInputChange('doi', e.target.value)}
                    placeholder="10.1000/182"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject_area">المجال الموضوعي</Label>
                <Input
                  id="subject_area"
                  value={formData.subject_area}
                  onChange={(e) => handleInputChange('subject_area', e.target.value)}
                  placeholder="مثل: الكيمياء الطبية، علم الأدوية، إلخ"
                />
              </div>

              <div className="space-y-3">
                <Label>العلامات</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="أضف علامة جديدة"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>رفع الملف</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="mb-4">اختر ملف أو اسحبه هنا</p>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.epub"
                />
                <label htmlFor="file-upload">
                  <Button type="button" asChild>
                    <span>اختر ملف</span>
                  </Button>
                </label>
              </div>

              {formData.file_url && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">الملف المرفوع</p>
                      <p className="text-sm text-muted-foreground">
                        النوع: {formData.file_type} | 
                        الحجم: {(formData.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('file_url', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="file_url">رابط الملف (اختياري)</Label>
                <Input
                  id="file_url"
                  value={formData.file_url}
                  onChange={(e) => handleInputChange('file_url', e.target.value)}
                  placeholder="https://example.com/file.pdf"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النشر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="access_level">مستوى الوصول</Label>
                  <Select value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">عام</SelectItem>
                      <SelectItem value="students">طلاب</SelectItem>
                      <SelectItem value="faculty">أعضاء هيئة التدريس</SelectItem>
                      <SelectItem value="admin">إداريين فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">حالة النشر</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">مصدر مميز</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>جاري الحفظ...</>
          ) : (
            <>
              <Save className="h-4 w-4 ml-2" />
              {resource ? 'تحديث المصدر' : 'إنشاء المصدر'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};