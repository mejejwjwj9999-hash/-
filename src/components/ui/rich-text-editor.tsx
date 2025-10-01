import React, { useCallback, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Label } from '@/components/ui/label';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  height?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'اكتب محتواك هنا...',
  label,
  required = false,
  error,
  className = '',
  height = '200px',
  disabled = false
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  // تكوين شريط الأدوات
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // تنسيقات مدعومة
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // معالج تغيير المحتوى
  const handleChange = useCallback((content: string, delta: any, source: string, editor: any) => {
    // تطهير المحتوى من العناصر الضارة
    const cleanContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div', 'pre', 'code'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'
      ]
    });
    
    onChange(cleanContent);
  }, [onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-right">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
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
            direction: 'rtl',
            textAlign: 'right',
            minHeight: height
          }}
          className={`
            bg-background text-foreground
            [&_.ql-toolbar]:bg-card [&_.ql-toolbar]:border-border
            [&_.ql-container]:bg-background [&_.ql-container]:border-border
            [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[${height}]
            [&_.ql-editor]:text-right [&_.ql-editor]:direction-rtl
            ${error ? '[&_.ql-container]:border-destructive' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive text-right">{error}</p>
      )}
    </div>
  );
};

// معاينة المحتوى المنسق
interface RichTextPreviewProps {
  content: string;
  className?: string;
}

export const RichTextPreview = ({ content, className = '' }: RichTextPreviewProps) => {
  // تطهير المحتوى قبل العرض
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div', 'pre', 'code'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'
    ]
  });

  return (
    <div 
      className={`prose prose-sm max-w-none text-right ${className}`}
      style={{ direction: 'rtl' }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};