import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, Link2, Upload, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useImages } from '@/hooks/useMediaLibrary';
import { toast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import IconPicker from '@/components/editors/IconPicker';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  language?: 'ar' | 'en';
  disabled?: boolean;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'اكتب المحتوى هنا...',
  height = '300px',
  language = 'ar',
  disabled = false
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { data: images } = useImages();

  // تكوين شريط الأدوات
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'direction': 'rtl' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'icon'],
        ['clean']
      ],
      handlers: {
        image: () => setIsImageModalOpen(true),
        link: () => setIsLinkModalOpen(true),
        icon: () => setIsIconModalOpen(true)
      }
    },
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        // Better RTL support
        'list autofill': {
          key: ' ',
          shiftKey: null,
          handler: function(range: any, context: any) {
            if (language === 'ar') {
              // Custom RTL list handling
              return true;
            }
            return true;
          }
        }
      }
    }
  }), [language]);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'direction', 'blockquote', 'code-block', 'link', 'image', 'icon'
  ];

  const handleChange = useCallback((content: string) => {
    const cleanContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3',
        'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel']
    });
    onChange(cleanContent);
  }, [onChange]);

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

      insertImage(publicUrl, file.name);
      setIsImageModalOpen(false);
      
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

  const insertImage = (url: string, alt: string = '') => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      quill.insertEmbed(range?.index || 0, 'image', url);
      quill.insertText((range?.index || 0) + 1, '\n');
    }
  };

  const insertIcon = (iconName: string, iconData: { size: number; color: string; strokeWidth: number }) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const iconHtml = `<i class="lucide-${iconName}" style="width: ${iconData.size}px; height: ${iconData.size}px; color: ${iconData.color}; stroke-width: ${iconData.strokeWidth};" data-icon="${iconName}"></i>`;
      quill.clipboard.dangerouslyPasteHTML(range?.index || 0, iconHtml);
    }
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;
    
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      quill.insertText(range?.index || 0, linkText, 'link', linkUrl);
    }
    
    setLinkText('');
    setLinkUrl('');
    setIsLinkModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        style={{
          direction: language === 'ar' ? 'rtl' : 'ltr',
          textAlign: language === 'ar' ? 'right' : 'left',
          height
        }}
        className={`
          bg-background text-foreground
          [&_.ql-toolbar]:bg-card [&_.ql-toolbar]:border-border
          [&_.ql-container]:bg-background [&_.ql-container]:border-border
          [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[${height}]
          ${language === 'ar' ? '[&_.ql-editor]:text-right [&_.ql-editor]:direction-rtl' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />

      {/* Enhanced Image Upload */}
      <EnhancedImageUpload
        onImageSelect={(url, altText) => {
          insertImage(url, altText);
          setIsImageModalOpen(false);
        }}
        trigger={
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogTrigger asChild>
              <div />
            </DialogTrigger>
          </Dialog>
        }
        title="إدراج صورة"
        allowEdit={true}
      />

      {/* Icon Picker */}
      <IconPicker
        onIconSelect={(iconName, iconData) => {
          insertIcon(iconName, iconData);
          setIsIconModalOpen(false);
        }}
        trigger={
          <Dialog open={isIconModalOpen} onOpenChange={setIsIconModalOpen}>
            <DialogTrigger asChild>
              <div />
            </DialogTrigger>
          </Dialog>
        }
        title="إدراج أيقونة"
      />

      {/* Link Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إدراج رابط</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-text">نص الرابط</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="اكتب النص المراد ربطه"
              />
            </div>
            
            <div>
              <Label htmlFor="link-url">عنوان الرابط</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsLinkModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={insertLink}
                disabled={!linkText || !linkUrl}
              >
                إدراج الرابط
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
