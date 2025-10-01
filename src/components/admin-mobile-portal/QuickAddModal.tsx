import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickAddModalProps {
  type: 'student' | 'teacher' | 'course' | 'notification';
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const QuickAddModal = ({ type, trigger, onSuccess }: QuickAddModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      
      switch (type) {
        case 'student':
          result = await supabase
            .from('student_profiles')
            .insert({
              first_name: formData.firstName,
              last_name: formData.lastName,
              student_id: formData.studentId,
              email: formData.email,
              phone: formData.phone,
              department: formData.department,
              college: formData.college,
              academic_year: parseInt(formData.academicYear) || 2024,
              semester: formData.semester || 'الفصل الأول',
              admission_date: new Date().toISOString().split('T')[0]
            });
          break;
          
        case 'teacher':
          // Note: This would typically require creating a user first
          toast.info('ستحتاج إلى إنشاء حساب مستخدم أولاً للمعلم');
          return;
          
        case 'course':
          result = await supabase
            .from('courses')
            .insert({
              course_name_ar: formData.courseNameAr,
              course_name_en: formData.courseNameEn,
              course_code: formData.courseCode,
              credit_hours: parseInt(formData.creditHours) || 3,
              description: formData.description,
              department: formData.department || 'قسم عام',
              college: formData.college || 'كلية أيلول الجامعة',
              semester: formData.semester || 'الفصل الأول',
              academic_year: parseInt(formData.academicYear) || 2024
            });
          break;
          
        case 'notification':
          result = await supabase
            .from('notifications')
            .insert({
              title: formData.title,
              message: formData.message,
              priority: formData.priority || 'normal',
              type: formData.type || 'general',
              is_read: false
            });
          break;
      }
      
      if (result?.error) throw result.error;
      
      toast.success('تم الحفظ بنجاح');
      setOpen(false);
      setFormData({});
      onSuccess?.();
      
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'student':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="أدخل الاسم الأول"
                />
              </div>
              <div>
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="أدخل الاسم الأخير"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="studentId">رقم الطالب</Label>
              <Input
                id="studentId"
                value={formData.studentId || ''}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                placeholder="أدخل رقم الطالب"
              />
            </div>
            
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="اختر القسم"
                />
              </div>
              <div>
                <Label htmlFor="college">الكلية</Label>
                <Input
                  id="college"
                  value={formData.college || ''}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  placeholder="اختر الكلية"
                />
              </div>
            </div>
          </div>
        );
        
      case 'teacher':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="أدخل الاسم الأول"
                />
              </div>
              <div>
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="أدخل الاسم الأخير"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="teacherId">رقم المعلم</Label>
              <Input
                id="teacherId"
                value={formData.teacherId || ''}
                onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                placeholder="أدخل رقم المعلم"
              />
            </div>
            
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            
            <div>
              <Label htmlFor="position">المنصب</Label>
              <Select value={formData.position || ''} onValueChange={(value) => setFormData({...formData, position: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أستاذ">أستاذ</SelectItem>
                  <SelectItem value="أستاذ مشارك">أستاذ مشارك</SelectItem>
                  <SelectItem value="أستاذ مساعد">أستاذ مساعد</SelectItem>
                  <SelectItem value="محاضر">محاضر</SelectItem>
                  <SelectItem value="معيد">معيد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="specialization">التخصص</Label>
              <Input
                id="specialization"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                placeholder="أدخل التخصص"
              />
            </div>
          </div>
        );
        
      case 'course':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="courseNameAr">اسم المقرر (عربي)</Label>
              <Input
                id="courseNameAr"
                value={formData.courseNameAr || ''}
                onChange={(e) => setFormData({...formData, courseNameAr: e.target.value})}
                placeholder="أدخل اسم المقرر بالعربية"
              />
            </div>
            
            <div>
              <Label htmlFor="courseNameEn">اسم المقرر (إنجليزي)</Label>
              <Input
                id="courseNameEn"
                value={formData.courseNameEn || ''}
                onChange={(e) => setFormData({...formData, courseNameEn: e.target.value})}
                placeholder="أدخل اسم المقرر بالإنجليزية"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="courseCode">رمز المقرر</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode || ''}
                  onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                  placeholder="مثل: CS101"
                />
              </div>
              <div>
                <Label htmlFor="creditHours">الساعات المعتمدة</Label>
                <Input
                  id="creditHours"
                  type="number"
                  value={formData.creditHours || ''}
                  onChange={(e) => setFormData({...formData, creditHours: e.target.value})}
                  placeholder="3"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">وصف المقرر</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="أدخل وصف المقرر"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="اختر القسم"
                />
              </div>
              <div>
                <Label htmlFor="college">الكلية</Label>
                <Input
                  id="college"
                  value={formData.college || ''}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  placeholder="اختر الكلية"
                />
              </div>
            </div>
          </div>
        );
        
      case 'notification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان الإشعار</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="أدخل عنوان الإشعار"
              />
            </div>
            
            <div>
              <Label htmlFor="message">نص الإشعار</Label>
              <Textarea
                id="message"
                value={formData.message || ''}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="أدخل نص الإشعار"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="priority">الأولوية</Label>
                <Select value={formData.priority || 'normal'} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="normal">عادية</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">نوع الإشعار</Label>
                <Select value={formData.type || 'general'} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="academic">أكاديمي</SelectItem>
                    <SelectItem value="financial">مالي</SelectItem>
                    <SelectItem value="emergency">طارئ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'student': return 'إضافة طالب جديد';
      case 'teacher': return 'إضافة معلم جديد';
      case 'course': return 'إضافة مقرر جديد';
      case 'notification': return 'إضافة إشعار جديد';
      default: return 'إضافة جديد';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              <Save className="h-4 w-4 ml-1" />
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddModal;