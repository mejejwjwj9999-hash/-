import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Video, FileText, Music, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { useUploadMedia, MediaFormData } from '@/hooks/useAdminMediaLibrary';
import { toast } from 'sonner';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFiles?: File[];
}

interface FileWithMetadata {
  file: File;
  id: string;
  preview?: string;
  mediaType: 'image' | 'video' | 'document' | 'audio';
  altText: string;
  description: string;
  tags: string[];
  uploaded?: boolean;
}

export const MediaUploadModal = ({ isOpen, onClose, preselectedFiles = [] }: MediaUploadModalProps) => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMedia = useUploadMedia();

  const getMediaType = (file: File): 'image' | 'video' | 'document' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      // Validate file before processing
      if (!file || !file.name || typeof file.name !== 'string') {
        console.error('Invalid dropped file:', file);
        return null;
      }
      
      const mediaType = getMediaType(file);
      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        mediaType,
        preview: mediaType === 'image' ? URL.createObjectURL(file) : undefined,
        altText: '',
        description: '',
        tags: [],
        uploaded: false
      } as FileWithMetadata;
    }).filter(Boolean); // Remove null entries
    
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      toast.error('لم يتم قبول أي ملفات صحيحة');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: true
  });

  useEffect(() => {
    if (preselectedFiles.length > 0) {
      onDrop(preselectedFiles);
    }
  }, [preselectedFiles, onDrop]);

  useEffect(() => {
    return () => {
      // Clean up previews
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const updateFileMetadata = (fileId: string, field: keyof FileWithMetadata, value: any) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, [field]: value }
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const addTag = (fileId: string, tag: string) => {
    if (tag.trim()) {
      updateFileMetadata(fileId, 'tags', 
        files.find(f => f.id === fileId)?.tags?.concat(tag.trim()) || [tag.trim()]
      );
    }
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      const newTags = [...file.tags];
      newTags.splice(tagIndex, 1);
      updateFileMetadata(fileId, 'tags', newTags);
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) {
      toast.error('لا توجد ملفات للرفع');
      return;
    }

    console.log('Starting upload process with files:', files);
    setUploading(true);
    setUploadProgress(0);
    
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.uploaded) {
          successCount++;
          continue;
        }
        
        // Validate file object
        if (!file?.file || !file.file.name || typeof file.file.name !== 'string') {
          console.error('Invalid file object:', file);
          toast.error(`ملف غير صحيح: ${file?.file?.name || 'مجهول'}`);
          errorCount++;
          continue;
        }

        try {
          // Prepare media data
          const mediaData: Omit<MediaFormData, 'file_name' | 'original_name' | 'file_path' | 'file_size' | 'mime_type' | 'uploaded_by'> = {
            media_type: file.mediaType,
            alt_text_ar: file.altText || file.file.name,
            description_ar: file.description || '',
            tags: file.tags || []
          };

          // Upload the file
          await uploadMedia.mutateAsync({ file: file.file, mediaData });
          
          // Mark as uploaded
          updateFileMetadata(file.id, 'uploaded', true);
          successCount++;
          
          // Update progress
          setUploadProgress(((i + 1) / files.length) * 100);
          
        } catch (fileError) {
          console.error(`Failed to upload file ${file.file.name}:`, fileError);
          toast.error(`فشل في رفع الملف: ${file.file.name}`);
          errorCount++;
        }
      }

      // Show final result
      if (successCount > 0 && errorCount === 0) {
        toast.success(`تم رفع جميع الملفات بنجاح (${successCount})`);
        // Only close modal if all files uploaded successfully
        setTimeout(() => {
          onClose();
        }, 1000);
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`تم رفع ${successCount} ملف، فشل ${errorCount} ملف`);
      } else if (errorCount > 0) {
        toast.error(`فشل في رفع جميع الملفات (${errorCount})`);
      }
      
    } catch (error) {
      console.error('Upload process failed:', error);
      toast.error('فشل في عملية الرفع');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">رفع ملفات جديدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-university-blue bg-university-blue/5' 
                    : 'border-gray-300 hover:border-university-blue'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-academic-gray" />
                {isDragActive ? (
                  <p className="text-university-blue font-medium">اترك الملفات هنا لرفعها...</p>
                ) : (
                  <div>
                    <p className="text-academic-gray mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                    <p className="text-sm text-academic-gray">يدعم: الصور، الفيديوهات، PDF، الملفات الصوتية</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {uploading && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>جاري الرفع...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">الملفات المحددة ({files.length})</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFiles([])}
                    disabled={uploading}
                  >
                    مسح الكل
                  </Button>
                  <Button 
                    onClick={handleUploadAll}
                    disabled={uploading || files.every(f => f.uploaded)}
                    className="bg-university-blue hover:bg-university-blue-light"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    رفع جميع الملفات
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {files.map((file) => (
                  <Card key={file.id} className={`${file.uploaded ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {getMediaIcon(file.mediaType)}
                          <div>
                            <h4 className="font-medium">{file.file.name}</h4>
                            <p className="text-sm text-academic-gray">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.file.type}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.uploaded && (
                            <div className="flex items-center text-green-600">
                              <Check className="w-4 h-4 ml-1" />
                              مرفوع
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            disabled={uploading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Preview */}
                        <div>
                          <Label>معاينة</Label>
                          <div className="mt-2 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {getMediaIcon(file.mediaType)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <Label htmlFor={`alt-${file.id}`}>النص البديل</Label>
                            <Input
                              id={`alt-${file.id}`}
                              value={file.altText}
                              onChange={(e) => updateFileMetadata(file.id, 'altText', e.target.value)}
                              placeholder="وصف الملف"
                              className="text-right"
                              disabled={uploading}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`desc-${file.id}`}>الوصف</Label>
                            <Textarea
                              id={`desc-${file.id}`}
                              value={file.description}
                              onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                              placeholder="وصف تفصيلي للملف"
                              className="text-right min-h-[80px]"
                              disabled={uploading}
                            />
                          </div>

                          {/* Tags */}
                          <div>
                            <Label>العلامات</Label>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="أضف علامة"
                                  className="text-right"
                                  disabled={uploading}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addTag(file.id, e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                              </div>
                              
                              {file.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {file.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="bg-university-blue-light bg-opacity-20 text-university-blue px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(file.id, index)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={uploading}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={uploading}
            >
              {uploading ? 'جاري الرفع...' : (files.some(f => f.uploaded) ? 'إغلاق' : 'إلغاء')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};