import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useCreateAnnouncement } from '@/hooks/useTeacherAnnouncements';

interface CreateAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  announcement_type: 'general' | 'assignment' | 'exam' | 'schedule' | 'material';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: 'students' | 'all' | 'specific_course';
  course_id?: string;
  expire_date?: string;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    announcement_type: 'general',
    priority: 'normal',
    target_audience: 'students',
  });

  const { data: teacherProfile } = useTeacherProfile();
  const { data: teacherCourses } = useTeacherCourses();
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherProfile?.id || !formData.title || !formData.content) return;

    const announcementData = {
      teacher_id: teacherProfile.id,
      title: formData.title,
      content: formData.content,
      announcement_type: formData.announcement_type,
      priority: formData.priority,
      target_audience: formData.target_audience,
      course_id: formData.target_audience === 'specific_course' ? formData.course_id : undefined,
      is_published: true,
      publish_date: new Date().toISOString(),
      expire_date: formData.expire_date ? new Date(formData.expire_date).toISOString() : undefined,
    };

    createAnnouncement.mutate(announcementData, {
      onSuccess: () => {
        setFormData({
          title: '',
          content: '',
          announcement_type: 'general',
          priority: 'normal',
          target_audience: 'students',
        });
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء إعلان جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الإعلان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان الإعلان"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>نوع الإعلان</Label>
              <Select 
                value={formData.announcement_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, announcement_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الإعلان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">عام</SelectItem>
                  <SelectItem value="assignment">واجب</SelectItem>
                  <SelectItem value="exam">امتحان</SelectItem>
                  <SelectItem value="schedule">جدولة</SelectItem>
                  <SelectItem value="material">مادة دراسية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الأولوية</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="normal">عادية</SelectItem>
                  <SelectItem value="high">مهمة</SelectItem>
                  <SelectItem value="urgent">عاجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الجمهور المستهدف</Label>
              <Select 
                value={formData.target_audience}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, target_audience: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجمهور المستهدف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">الطلاب</SelectItem>
                  <SelectItem value="all">الجميع</SelectItem>
                  <SelectItem value="specific_course">مقرر محدد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.target_audience === 'specific_course' && (
              <div className="space-y-2">
                <Label>اختر المقرر</Label>
                <Select 
                  value={formData.course_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المقرر" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherCourses?.map((course) => (
                      <SelectItem key={course.id} value={course.course_id}>
                        {course.courses?.course_name_ar} - {course.courses?.course_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>تاريخ انتهاء الصلاحية</Label>
              <Input
                type="datetime-local"
                value={formData.expire_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, expire_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">محتوى الإعلان *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="اكتب محتوى الإعلان هنا..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={createAnnouncement.isPending}>
              {createAnnouncement.isPending ? 'جاري النشر...' : 'نشر الإعلان'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementModal;