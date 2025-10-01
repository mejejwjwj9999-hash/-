import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RichTextEditor, RichTextPreview } from '@/components/ui/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Type, Image, List, Link, Eye } from 'lucide-react';

export const WYSIWYGGuide = () => {
  const [demoContent, setDemoContent] = useState(`
    <h2>مرحباً بك في محرر النصوص المتقدم</h2>
    <p>يمكنك استخدام هذا المحرر لإنشاء محتوى منسق وجميل. إليك بعض الأمثلة:</p>
    
    <h3>التنسيق الأساسي</h3>
    <p>يمكنك جعل النص <strong>عريض</strong> أو <em>مائل</em> أو <u>تحته خط</u>.</p>
    
    <h3>القوائم</h3>
    <ul>
      <li>عنصر أول في القائمة</li>
      <li>عنصر ثاني في القائمة</li>
      <li>عنصر ثالث في القائمة</li>
    </ul>
    
    <ol>
      <li>خطوة أولى</li>
      <li>خطوة ثانية</li>
      <li>خطوة ثالثة</li>
    </ol>
    
    <blockquote>
      <p>يمكنك أيضاً إضافة اقتباسات مميزة مثل هذه</p>
    </blockquote>
  `);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const features = [
    {
      icon: Type,
      title: 'تنسيق النصوص',
      description: 'عريض، مائل، تحته خط، ألوان، أحجام خطوط مختلفة'
    },
    {
      icon: List,
      title: 'القوائم والترقيم',
      description: 'قوائم منقطة ومرقمة، مسافات بادئة'
    },
    {
      icon: Link,
      title: 'الروابط والوسائط',
      description: 'إدراج روابط، صور، فيديوهات'
    },
    {
      icon: BookOpen,
      title: 'العناوين والفقرات',
      description: 'تنظيم المحتوى بعناوين متدرجة ومحاذاة مختلفة'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <BookOpen className="w-5 h-5" />
            دليل استخدام محرر النصوص WYSIWYG
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right">
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 text-right">نصائح للاستخدام:</h4>
            <ul className="text-sm text-blue-800 space-y-1 text-right">
              <li>• استخدم العناوين (H1, H2, H3) لتنظيم المحتوى</li>
              <li>• اضغط Ctrl+B للخط العريض، Ctrl+I للخط المائل</li>
              <li>• يمكنك لصق المحتوى من Word أو مصادر أخرى</li>
              <li>• استخدم زر "تنظيف التنسيق" لإزالة التنسيقات غير المرغوبة</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-end">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 ml-2" />
                  معاينة المحرر
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-right">تجربة محرر النصوص</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <RichTextEditor
                    value={demoContent}
                    onChange={setDemoContent}
                    label="جرب المحرر"
                    placeholder="اكتب نصك هنا..."
                    height="300px"
                  />
                  <div>
                    <h4 className="font-semibold mb-2 text-right">المعاينة:</h4>
                    <div className="border rounded-lg p-4 bg-background">
                      <RichTextPreview content={demoContent} />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};