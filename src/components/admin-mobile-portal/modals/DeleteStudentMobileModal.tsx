import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteStudentMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

const DeleteStudentMobileModal: React.FC<DeleteStudentMobileModalProps> = ({ isOpen, onClose, student }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteStudent = useMutation({
    mutationFn: async () => {
      // First delete from student_profiles
      const { error: profileError } = await supabase
        .from('student_profiles')
        .delete()
        .eq('id', student.id);

      if (profileError) throw profileError;

      // Delete user_roles if exists
      if (student.user_id) {
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', student.user_id);

        // Delete auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(
          student.user_id
        );
        if (authError) console.warn('Could not delete auth user:', authError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: '✅ تم حذف الطالب بنجاح',
        description: 'تم حذف جميع بيانات الطالب من النظام',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: '❌ خطأ في حذف الطالب',
        description: error.message || 'حدث خطأ أثناء حذف الطالب',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent.mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-red-50/30" dir="rtl">
        <DialogHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute -left-2 -top-2 h-8 w-8 rounded-full hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-xl font-bold text-red-600 flex items-center justify-center gap-2 pr-8">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            تأكيد حذف الطالب
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-700 mb-2">تحذير!</h3>
              <p className="text-sm text-red-600">
                هذا الإجراء غير قابل للتراجع. سيتم حذف جميع بيانات الطالب نهائياً من النظام.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-right">
              <h4 className="font-semibold text-gray-800 mb-2">بيانات الطالب المراد حذفها:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">الاسم:</span> {student?.first_name} {student?.last_name}</p>
                <p><span className="font-medium">رقم الطالب:</span> {student?.student_id}</p>
                <p><span className="font-medium">البريد الإلكتروني:</span> {student?.email}</p>
                <p><span className="font-medium">الكلية:</span> {student?.college}</p>
                <p><span className="font-medium">القسم:</span> {student?.department}</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium">
                سيتم حذف جميع البيانات المرتبطة بهذا الطالب:
              </p>
              <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                <li>• بيانات التسجيل والملف الشخصي</li>
                <li>• الدرجات والنتائج الأكاديمية</li>
                <li>• طلبات الخدمات والمستندات</li>
                <li>• تاريخ المدفوعات والرسوم</li>
                <li>• حساب المستخدم في النظام</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-red-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Button>
            
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحذف...
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف نهائياً
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentMobileModal;