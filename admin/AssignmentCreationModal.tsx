import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AssignmentCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    course_id: string;
    title: string;
    description?: string;
    instructions?: string;
    due_date: string;
    max_grade?: number;
    submission_type?: string;
  }) => void;
}

const AssignmentCreationModal: React.FC<AssignmentCreationModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    instructions: '',
    due_date: new Date(),
    max_grade: 100,
    submission_type: 'file'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب المقررات المتاحة
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses-for-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_code, course_name_ar, course_name_en')
        .order('course_code');

      if (error) throw error;
      return data || [];
    },
  });

  const resetForm = () => {
    setFormData({
      course_id: '',
      title: '',
      description: '',
      instructions: '',
      due_date: new Date(),
      max_grade: 100,
      submission_type: 'file'
    });
  };

  useEffect(() => {
    if (!open) {
      resetForm();
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course_id || !formData.title) {
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        course_id: formData.course_id,
        title: formData.title,
        description: formData.description || undefined,
        instructions: formData.instructions || undefined,
        due_date: formData.due_date.toISOString(),
        max_grade: formData.max_grade,
        submission_type: formData.submission_type
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء واجب جديد</DialogTitle>
          <DialogDescription>
            قم بملء التفاصيل التالية لإنشاء واجب جديد للطلاب
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اختيار المقرر */}
          <div className="space-y-2">
            <Label htmlFor="course">المقرر الدراسي *</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
              disabled={coursesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={coursesLoading ? "جاري تحميل المقررات..." : "اختر المقرر"} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course_code} - {course.course_name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* عنوان الواجب */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الواجب *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="أدخل عنوان الواجب"
              required
            />
          </div>

          {/* وصف الواجب */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف الواجب</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر للواجب"
              rows={3}
            />
          </div>

          {/* تعليمات الواجب */}
          <div className="space-y-2">
            <Label htmlFor="instructions">تعليمات التسليم</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="تعليمات مفصلة حول كيفية أداء وتسليم الواجب"
              rows={4}
            />
          </div>

          {/* تاريخ التسليم */}
          <div className="space-y-2">
            <Label>تاريخ التسليم *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.due_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date ? (
                    format(formData.due_date, "PPP", { locale: ar })
                  ) : (
                    <span>اختر تاريخ التسليم</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, due_date: date }))}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الدرجة الكاملة */}
            <div className="space-y-2">
              <Label htmlFor="max_grade">الدرجة الكاملة</Label>
              <Input
                id="max_grade"
                type="number"
                min="1"
                max="1000"
                value={formData.max_grade}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  max_grade: parseInt(e.target.value) || 100 
                }))}
              />
            </div>

            {/* نوع التسليم */}
            <div className="space-y-2">
              <Label htmlFor="submission_type">نوع التسليم</Label>
              <Select
                value={formData.submission_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, submission_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">رفع ملف</SelectItem>
                  <SelectItem value="text">نص مكتوب</SelectItem>
                  <SelectItem value="both">ملف ونص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.course_id || !formData.title}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              إنشاء الواجب
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentCreationModal;