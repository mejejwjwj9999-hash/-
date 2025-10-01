import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateResource, useUpdateResource, DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, FileText, X } from 'lucide-react';

const resourceSchema = z.object({
  title_ar: z.string().min(1, 'العنوان بالعربية مطلوب'),
  title_en: z.string().optional(),
  author_ar: z.string().optional(),
  author_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  resource_type: z.enum(['book', 'journal', 'thesis', 'database', 'article', 'document']),
  category: z.enum(['pharmacy', 'nursing', 'it', 'business', 'midwifery', 'general']),
  subject_area: z.string().optional(),
  language: z.enum(['ar', 'en', 'both']).default('ar'),
  publication_year: z.number().optional(),
  isbn: z.string().optional(),
  doi: z.string().optional(),
  access_level: z.enum(['public', 'students', 'faculty', 'admin']).default('public'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
  resource?: DigitalLibraryResource | null;
  onSuccess: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
      author_ar: '',
      author_en: '',
      description_ar: '',
      description_en: '',
      resource_type: 'book',
      category: 'general',
      subject_area: '',
      language: 'ar',
      publication_year: undefined,
      isbn: '',
      doi: '',
      access_level: 'public',
      status: 'draft',
      is_featured: false,
      tags: [],
    },
  });

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const { uploadFile, isUploading } = useFileUpload();

  // Populate form when editing
  useEffect(() => {
    if (resource) {
      form.reset({
        title_ar: resource.title_ar,
        title_en: resource.title_en || '',
        author_ar: resource.author_ar || '',
        author_en: resource.author_en || '',
        description_ar: resource.description_ar || '',
        description_en: resource.description_en || '',
        resource_type: resource.resource_type,
        category: resource.category,
        subject_area: resource.subject_area || '',
        language: resource.language,
        publication_year: resource.publication_year,
        isbn: resource.isbn || '',
        doi: resource.doi || '',
        access_level: resource.access_level,
        status: resource.status,
        is_featured: resource.is_featured,
        tags: resource.tags,
      });
      setTagsInput(resource.tags.join(', '));
    }
  }, [resource, form]);

  const onSubmit = async (data: ResourceFormData) => {
    try {
      let fileUrl = resource?.file_url;
      let thumbnailUrl = resource?.thumbnail_url;
      let fileSize = resource?.file_size;
      let fileType = resource?.file_type;

      // Upload main file if selected
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile, 'digital-library');
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      }

      // Upload thumbnail if selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'digital-library/thumbnails');
      }

      // Parse tags
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const resourceData: Omit<DigitalLibraryResource, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'downloads_count'> = {
        title_ar: data.title_ar,
        title_en: data.title_en,
        author_ar: data.author_ar,
        author_en: data.author_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        resource_type: data.resource_type,
        category: data.category,
        subject_area: data.subject_area,
        language: data.language,
        publication_year: data.publication_year,
        isbn: data.isbn,
        doi: data.doi,
        access_level: data.access_level,
        status: data.status,
        is_featured: data.is_featured,
        tags,
        file_url: fileUrl,
        file_size: fileSize,
        file_type: fileType,
        thumbnail_url: thumbnailUrl,
        metadata: {},
        published_at: undefined,
        created_by: undefined,
        updated_by: undefined,
      };

      if (resource) {
        await updateResource.mutateAsync({ id: resource.id, ...resourceData });
      } else {
        await createResource.mutateAsync(resourceData);
      }

      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'file') {
        setSelectedFile(file);
      } else {
        setThumbnailFile(file);
      }
    }
  };

  const removeFile = (type: 'file' | 'thumbnail') => {
    if (type === 'file') {
      setSelectedFile(null);
    } else {
      setThumbnailFile(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
            
            <FormField
              control={form.control}
              name="title_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان بالعربية *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان بالإنجليزية</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤلف بالعربية</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤلف بالإنجليزية</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف بالعربية</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">التصنيف</h3>
            
            <FormField
              control={form.control}
              name="resource_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المصدر</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="book">كتاب</SelectItem>
                      <SelectItem value="journal">مجلة علمية</SelectItem>
                      <SelectItem value="thesis">رسالة جامعية</SelectItem>
                      <SelectItem value="database">قاعدة بيانات</SelectItem>
                      <SelectItem value="article">مقال</SelectItem>
                      <SelectItem value="document">وثيقة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التخصص</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pharmacy">الصيدلة</SelectItem>
                      <SelectItem value="nursing">التمريض</SelectItem>
                      <SelectItem value="it">تكنولوجيا المعلومات</SelectItem>
                      <SelectItem value="business">إدارة الأعمال</SelectItem>
                      <SelectItem value="midwifery">القبالة</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>لغة المصدر</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                      <SelectItem value="both">ثنائي اللغة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="access_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مستوى الوصول</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">عام</SelectItem>
                      <SelectItem value="students">طلاب</SelectItem>
                      <SelectItem value="faculty">أعضاء هيئة التدريس</SelectItem>
                      <SelectItem value="admin">إداريين</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publication_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سنة النشر</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>الكلمات المفتاحية</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="فصل الكلمات بفاصلة"
              />
            </div>
          </div>
        </div>

        {/* Files Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">الملفات</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main File */}
            <div>
              <Label>الملف الرئيسي</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                {selectedFile || resource?.file_url ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">
                        {selectedFile?.name || 'ملف موجود'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('file')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 mt-2">اختر ملف أو اسحبه هنا</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      onChange={(e) => handleFileSelect(e, 'file')}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <Label>صورة مصغرة</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                {thumbnailFile || resource?.thumbnail_url ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">
                        {thumbnailFile?.name || 'صورة موجودة'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('thumbnail')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 mt-2">اختر صورة</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'thumbnail')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">خيارات إضافية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حالة النشر</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>مصدر مميز</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            إلغاء
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || createResource.isPending || updateResource.isPending}
          >
            {isUploading ? 'جاري رفع الملفات...' : 
             createResource.isPending || updateResource.isPending ? 'جاري الحفظ...' :
             resource ? 'تحديث المصدر' : 'إضافة المصدر'}
          </Button>
        </div>
      </form>
    </Form>
  );
};