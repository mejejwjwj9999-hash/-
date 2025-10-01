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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateResource, useUpdateResource, DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAdminMediaLibrary } from '@/hooks/useAdminMediaLibrary';
import { Upload, FileText, X, Image, Link, Database, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

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
  external_url: z.string().url().optional().or(z.literal('')),
  page_count: z.number().optional(),
  duration: z.string().optional(),
  publisher: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
  resource?: DigitalLibraryResource | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedMediaLibraryFile, setSelectedMediaLibraryFile] = useState<string>('');
  const [selectedThumbnailFromLibrary, setSelectedThumbnailFromLibrary] = useState<string>('');
  const [uploadType, setUploadType] = useState<'file' | 'url' | 'media-library'>('file');
  const [thumbnailType, setThumbnailType] = useState<'upload' | 'media-library'>('upload');
  const [tagsInput, setTagsInput] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

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
      external_url: '',
      page_count: undefined,
      duration: '',
      publisher: '',
    },
  });

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const { uploadFile, isUploading } = useFileUpload();
  const { data: mediaItems = [] } = useAdminMediaLibrary();

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
        external_url: (resource.metadata as any)?.external_url || '',
        page_count: (resource.metadata as any)?.page_count,
        duration: (resource.metadata as any)?.duration || '',
        publisher: (resource.metadata as any)?.publisher || '',
      });
      setTagsInput(resource.tags.join(', '));
      setExternalUrl((resource.metadata as any)?.external_url || '');
    }
  }, [resource, form]);

  const onSubmit = async (data: ResourceFormData) => {
    try {
      let fileUrl = resource?.file_url;
      let thumbnailUrl = resource?.thumbnail_url;
      let fileSize = resource?.file_size;
      let fileType = resource?.file_type;

      // Handle main file upload based on type
      if (uploadType === 'file' && selectedFile) {
        fileUrl = await uploadFile(selectedFile, 'digital-library');
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      } else if (uploadType === 'url' && externalUrl) {
        fileUrl = externalUrl;
        fileSize = undefined;
        fileType = 'external';
      } else if (uploadType === 'media-library' && selectedMediaLibraryFile) {
        const mediaItem = mediaItems.find(item => item.id === selectedMediaLibraryFile);
        if (mediaItem) {
          fileUrl = mediaItem.file_path;
          fileSize = mediaItem.file_size;
          fileType = mediaItem.mime_type;
        }
      }

      // Handle thumbnail upload
      if (thumbnailType === 'upload' && thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'digital-library/thumbnails');
      } else if (thumbnailType === 'media-library' && selectedThumbnailFromLibrary) {
        const mediaItem = mediaItems.find(item => item.id === selectedThumbnailFromLibrary);
        if (mediaItem) {
          thumbnailUrl = mediaItem.file_path;
        }
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
        metadata: {
          external_url: data.external_url,
          page_count: data.page_count,
          duration: data.duration,
          publisher: data.publisher,
          upload_type: uploadType,
          thumbnail_type: thumbnailType,
        },
        published_at: data.status === 'published' ? new Date().toISOString() : undefined,
        created_by: undefined,
        updated_by: undefined,
      };

      if (resource) {
        await updateResource.mutateAsync({ id: resource.id, ...resourceData });
      } else {
        await createResource.mutateAsync(resourceData);
      }

      toast.success(resource ? 'تم تحديث المصدر بنجاح' : 'تم إنشاء المصدر بنجاح');
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('فشل في حفظ المصدر');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'file') {
        setSelectedFile(file);
        setUploadType('file');
      } else {
        setThumbnailFile(file);
        setThumbnailType('upload');
      }
    }
  };

  const removeFile = (type: 'file' | 'thumbnail') => {
    if (type === 'file') {
      setSelectedFile(null);
      setSelectedMediaLibraryFile('');
      setExternalUrl('');
    } else {
      setThumbnailFile(null);
      setSelectedThumbnailFromLibrary('');
    }
  };

  const previewFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return FileText;
    return FileText;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان بالعربية *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل العنوان بالعربية" />
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
                      <Input {...field} placeholder="Enter English title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المؤلف بالعربية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="اسم المؤلف" />
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
                        <Input {...field} placeholder="Author name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالعربية</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="وصف تفصيلي للمصدر" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف بالإنجليزية</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Detailed description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>التصنيف والخصائص</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <FormField
                control={form.control}
                name="subject_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المجال الموضوعي</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: علم الأدوية، كيمياء حيوية" />
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
                  placeholder="فصل الكلمات بفاصلة (مثال: صيدلة، أدوية، بحث)"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>رفع الملفات والمرفقات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main File Upload */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">الملف الرئيسي</Label>
              
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={uploadType === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadType('file')}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  رفع ملف
                </Button>
                <Button
                  type="button"
                  variant={uploadType === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadType('url')}
                >
                  <Link className="w-4 h-4 ml-2" />
                  رابط خارجي
                </Button>
                <Button
                  type="button"
                  variant={uploadType === 'media-library' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadType('media-library')}
                >
                  <Database className="w-4 h-4 ml-2" />
                  من المكتبة الإعلامية
                </Button>
              </div>

              {uploadType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {selectedFile || resource?.file_url ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedFile && previewFile(selectedFile) ? (
                            <img src={previewFile(selectedFile)!} alt="Preview" className="w-16 h-16 object-cover rounded" />
                          ) : (
                            React.createElement(getFileIcon(selectedFile?.type || resource?.file_type || ''), { className: "w-8 h-8 text-primary" })
                          )}
                          <div>
                            <p className="font-medium">{selectedFile?.name || 'ملف موجود'}</p>
                            {selectedFile && (
                              <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {(selectedFile || resource?.file_url) && (
                            <Button type="button" variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile('file')}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-medium mb-2">اختر ملف أو اسحبه هنا</p>
                        <p className="text-sm text-gray-500">PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP4, MP3 (حتى 100MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.avi,.mov,.wav"
                        onChange={(e) => handleFileSelect(e, 'file')}
                      />
                    </label>
                  )}
                </div>
              )}

              {uploadType === 'url' && (
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/resource.pdf"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    أدخل رابط المصدر الخارجي (مثل: Google Drive, Dropbox, موقع ويب)
                  </p>
                </div>
              )}

              {uploadType === 'media-library' && (
                <div className="space-y-4">
                  <Select value={selectedMediaLibraryFile} onValueChange={setSelectedMediaLibraryFile}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر ملف من المكتبة الإعلامية" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {mediaItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{item.original_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.media_type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedMediaLibraryFile && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {(() => {
                        const selectedItem = mediaItems.find(item => item.id === selectedMediaLibraryFile);
                        return selectedItem ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {selectedItem.media_type === 'image' ? (
                                <img src={selectedItem.file_path} alt={selectedItem.alt_text_ar || selectedItem.original_name} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <FileText className="w-8 h-8 text-primary" />
                              )}
                              <div>
                                <p className="font-medium">{selectedItem.original_name}</p>
                                <p className="text-sm text-gray-500">{(selectedItem.file_size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => window.open(selectedItem.file_path, '_blank')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4 border-t pt-6">
              <Label className="text-base font-semibold">صورة مصغرة / غلاف</Label>
              
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={thumbnailType === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThumbnailType('upload')}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  رفع صورة
                </Button>
                <Button
                  type="button"
                  variant={thumbnailType === 'media-library' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThumbnailType('media-library')}
                >
                  <Database className="w-4 h-4 ml-2" />
                  من المكتبة الإعلامية
                </Button>
              </div>

              {thumbnailType === 'upload' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {thumbnailFile || resource?.thumbnail_url ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {thumbnailFile ? (
                          <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail" className="w-16 h-16 object-cover rounded" />
                        ) : resource?.thumbnail_url ? (
                          <img src={resource.thumbnail_url} alt="Current thumbnail" className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <Image className="w-8 h-8 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{thumbnailFile?.name || 'صورة موجودة'}</p>
                          {thumbnailFile && (
                            <p className="text-sm text-gray-500">{(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile('thumbnail')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="text-center">
                        <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium mb-1">اختر صورة</p>
                        <p className="text-sm text-gray-500">PNG, JPG, WEBP (حتى 5MB)</p>
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
              )}

              {thumbnailType === 'media-library' && (
                <div className="space-y-4">
                  <Select value={selectedThumbnailFromLibrary} onValueChange={setSelectedThumbnailFromLibrary}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر صورة من المكتبة الإعلامية" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {mediaItems.filter(item => item.media_type === 'image').map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            <span>{item.original_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedThumbnailFromLibrary && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {(() => {
                        const selectedItem = mediaItems.find(item => item.id === selectedThumbnailFromLibrary);
                        return selectedItem ? (
                          <div className="flex items-center gap-3">
                            <img src={selectedItem.file_path} alt={selectedItem.alt_text_ar || selectedItem.original_name} className="w-16 h-16 object-cover rounded" />
                            <div>
                              <p className="font-medium">{selectedItem.original_name}</p>
                              <p className="text-sm text-gray-500">{(selectedItem.file_size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <FormField
                control={form.control}
                name="page_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الصفحات</FormLabel>
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

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدة (للفيديو/الصوت)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: 02:30:00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="978-..." />
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
                      <Input {...field} placeholder="10.1000/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الناشر</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="دار النشر" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات النشر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex items-center space-x-2 pt-8">
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
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || createResource.isPending || updateResource.isPending}
            className="w-full sm:w-auto sm:min-w-32"
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