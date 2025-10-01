import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ImageUploadOptions {
  bucket?: string;
  folder?: string;
  maxSize?: number; // بالبايت
  allowedTypes?: string[];
  compress?: boolean;
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageEditOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
  filters?: string[];
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  resize?: {
    width: number;
    height: number;
    maintainAspectRatio?: boolean;
  };
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  bucket: 'site-media',
  folder: 'content-images',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  compress: true,
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080
};

export const useImageManagement = (options: ImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editedImages, setEditedImages] = useState<Map<string, string>>(new Map());
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // ضغط الصورة
  const compressImage = useCallback((file: File, quality: number = mergedOptions.quality!): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const { maxWidth, maxHeight } = mergedOptions;
        let { width, height } = img;

        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        if (width > maxWidth! || height > maxHeight!) {
          const ratio = Math.min(maxWidth! / width, maxHeight! / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, [mergedOptions]);

  // التحقق من صحة الملف
  const validateFile = useCallback((file: File): string | null => {
    if (!mergedOptions.allowedTypes!.includes(file.type)) {
      return 'نوع الملف غير مدعوم. يرجى اختيار صورة صالحة.';
    }

    if (file.size > mergedOptions.maxSize!) {
      const maxSizeMB = mergedOptions.maxSize! / (1024 * 1024);
      return `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB}MB.`;
    }

    return null;
  }, [mergedOptions]);

  // رفع الصورة
  const uploadImage = useCallback(async (file: File, customPath?: string): Promise<{ url: string; path: string } | null> => {
    const validation = validateFile(file);
    if (validation) {
      toast({
        title: 'خطأ في الملف',
        description: validation,
        variant: 'destructive'
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // ضغط الصورة إذا كان مطلوباً
      let processedFile = file;
      if (mergedOptions.compress) {
        processedFile = await compressImage(file);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = customPath || `${mergedOptions.folder}/${fileName}`;

      // محاكاة التقدم (Supabase لا يدعم progress callbacks بعد)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from(mergedOptions.bucket!)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(mergedOptions.bucket!)
        .getPublicUrl(filePath);

      // حفظ في مكتبة الوسائط
      await supabase.from('admin_media_library').insert({
        file_name: fileName,
        original_name: file.name,
        file_path: filePath,
        mime_type: file.type,
        file_size: processedFile.size,
        media_type: 'image',
        dimensions: { width: 0, height: 0 }, // TODO: استخراج الأبعاد الفعلية
        alt_text_ar: '',
        alt_text_en: '',
        tags: []
      });

      toast({
        title: 'تم رفع الصورة بنجاح',
        description: `تم رفع ${file.name} بنجاح`
      });

      return { url: publicUrl, path: filePath };
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'فشل رفع الصورة',
        description: error.message || 'حدث خطأ أثناء رفع الصورة',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [mergedOptions, validateFile, compressImage]);

  // تحرير الصورة
  const editImage = useCallback(async (imageSrc: string, editOptions: ImageEditOptions): Promise<string | null> => {
    setIsEditing(true);

    try {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let { width, height } = img;

          // تطبيق تغيير الحجم إذا كان مطلوباً
          if (editOptions.resize) {
            const { width: newWidth, height: newHeight, maintainAspectRatio } = editOptions.resize;
            if (maintainAspectRatio) {
              const ratio = Math.min(newWidth / width, newHeight / height);
              width = width * ratio;
              height = height * ratio;
            } else {
              width = newWidth;
              height = newHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // تطبيق الفلاتر
          let filterString = '';
          if (editOptions.brightness !== undefined) {
            filterString += `brightness(${editOptions.brightness}%) `;
          }
          if (editOptions.contrast !== undefined) {
            filterString += `contrast(${editOptions.contrast}%) `;
          }
          if (editOptions.saturation !== undefined) {
            filterString += `saturate(${editOptions.saturation}%) `;
          }
          if (editOptions.blur !== undefined) {
            filterString += `blur(${editOptions.blur}px) `;
          }

          ctx.filter = filterString;

          // تطبيق القص إذا كان مطلوباً
          if (editOptions.crop) {
            const { x, y, width: cropWidth, height: cropHeight } = editOptions.crop;
            ctx.drawImage(img, x, y, cropWidth, cropHeight, 0, 0, width, height);
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // تحويل إلى blob ورفع
          canvas.toBlob(async (blob) => {
            if (blob) {
              const editedFile = new File([blob], 'edited-image.png', {
                type: 'image/png',
                lastModified: Date.now(),
              });

              const result = await uploadImage(editedFile, `edited-images/${Date.now()}.png`);
              if (result) {
                setEditedImages(prev => new Map(prev.set(imageSrc, result.url)));
                resolve(result.url);
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }, 'image/png', 0.9);
        };

        img.onerror = () => {
          toast({
            title: 'خطأ في تحميل الصورة',
            description: 'لا يمكن تحميل الصورة للتحرير',
            variant: 'destructive'
          });
          resolve(null);
        };

        img.src = imageSrc;
      });
    } catch (error: any) {
      console.error('Image editing failed:', error);
      toast({
        title: 'فشل تحرير الصورة',
        description: error.message || 'حدث خطأ أثناء تحرير الصورة',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsEditing(false);
    }
  }, [uploadImage]);

  // حذف الصورة
  const deleteImage = useCallback(async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(mergedOptions.bucket!)
        .remove([path]);

      if (error) {
        throw error;
      }

      // حذف من مكتبة الوسائط
      await supabase
        .from('admin_media_library')
        .delete()
        .eq('file_path', path);

      toast({
        title: 'تم حذف الصورة',
        description: 'تم حذف الصورة بنجاح'
      });

      return true;
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast({
        title: 'فشل حذف الصورة',
        description: error.message || 'حدث خطأ أثناء حذف الصورة',
        variant: 'destructive'
      });
      return false;
    }
  }, [mergedOptions.bucket]);

  // رفع متعدد
  const uploadMultiple = useCallback(async (files: File[]): Promise<Array<{ url: string; path: string } | null>> => {
    const results = await Promise.all(
      files.map(file => uploadImage(file))
    );
    return results;
  }, [uploadImage]);

  // استخراج معلومات الصورة
  const getImageInfo = useCallback((file: File): Promise<{ width: number; height: number; size: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  return {
    // الحالة
    isUploading,
    isEditing,
    uploadProgress,
    editedImages,

    // الوظائف
    uploadImage,
    editImage,
    deleteImage,
    uploadMultiple,
    getImageInfo,
    compressImage,
    validateFile,

    // المساعدات
    canvasRef
  };
};