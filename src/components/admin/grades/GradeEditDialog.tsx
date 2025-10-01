import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GradeEditDialogProps {
  grade?: any;
  onSuccess?: () => void;
}

export const GradeEditDialog: React.FC<GradeEditDialogProps> = ({
  grade,
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    coursework_grade: grade?.coursework_grade?.toString() || '',
    midterm_grade: grade?.midterm_grade?.toString() || '',
    final_grade: grade?.final_grade?.toString() || '',
    notes: grade?.notes || ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // تحديث الدرجة
  const updateGradeMutation = useMutation({
    mutationFn: async (updates: any) => {
      const coursework = parseFloat(updates.coursework_grade) || 0;
      const midterm = parseFloat(updates.midterm_grade) || 0;
      const final = parseFloat(updates.final_grade) || 0;
      
      const totalGrade = coursework + midterm + final;
      
      // تحديد التقدير والنقاط
      let letterGrade = 'F';
      let gpaPoints = 0;
      
      if (totalGrade >= 95) { letterGrade = 'A+'; gpaPoints = 4.0; }
      else if (totalGrade >= 90) { letterGrade = 'A'; gpaPoints = 3.7; }
      else if (totalGrade >= 85) { letterGrade = 'B+'; gpaPoints = 3.3; }
      else if (totalGrade >= 80) { letterGrade = 'B'; gpaPoints = 3.0; }
      else if (totalGrade >= 75) { letterGrade = 'C+'; gpaPoints = 2.7; }
      else if (totalGrade >= 70) { letterGrade = 'C'; gpaPoints = 2.3; }
      else if (totalGrade >= 65) { letterGrade = 'D+'; gpaPoints = 2.0; }
      else if (totalGrade >= 60) { letterGrade = 'D'; gpaPoints = 1.7; }

      const { data, error } = await supabase
        .from('grades')
        .update({
          coursework_grade: coursework,
          midterm_grade: midterm,
          final_grade: final,
          total_grade: totalGrade,
          letter_grade: letterGrade,
          gpa_points: gpaPoints,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', grade.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['admin-mobile-quick-stats'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث الدرجة بنجاح",
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('خطأ في تحديث الدرجة:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الدرجة",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    const coursework = parseFloat(formData.coursework_grade) || 0;
    const midterm = parseFloat(formData.midterm_grade) || 0;
    const final = parseFloat(formData.final_grade) || 0;

    if (coursework < 0 || coursework > 40) {
      toast({
        title: "خطأ في البيانات",
        description: "أعمال السنة يجب أن تكون بين 0 و 40",
        variant: "destructive",
      });
      return;
    }

    if (midterm < 0 || midterm > 20) {
      toast({
        title: "خطأ في البيانات",
        description: "درجة النصفي يجب أن تكون بين 0 و 20",
        variant: "destructive",
      });
      return;
    }

    if (final < 0 || final > 40) {
      toast({
        title: "خطأ في البيانات",
        description: "درجة النهائي يجب أن تكون بين 0 و 40",
        variant: "destructive",
      });
      return;
    }

    updateGradeMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          تحرير
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-university-blue" />
            تحرير الدرجة
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* أعمال السنة */}
            <div className="space-y-2">
              <Label htmlFor="coursework">أعمال السنة (40)</Label>
              <Input
                id="coursework"
                type="number"
                min="0"
                max="40"
                step="0.5"
                placeholder="0-40"
                value={formData.coursework_grade}
                onChange={(e) => setFormData({...formData, coursework_grade: e.target.value})}
                className="text-lg font-medium"
              />
            </div>

            {/* النصفي */}
            <div className="space-y-2">
              <Label htmlFor="midterm">النصفي (20)</Label>
              <Input
                id="midterm"
                type="number"
                min="0"
                max="20"
                step="0.5"
                placeholder="0-20"
                value={formData.midterm_grade}
                onChange={(e) => setFormData({...formData, midterm_grade: e.target.value})}
                className="text-lg font-medium"
              />
            </div>

            {/* النهائي */}
            <div className="space-y-2">
              <Label htmlFor="final">النهائي (40)</Label>
              <Input
                id="final"
                type="number"
                min="0"
                max="40"
                step="0.5"
                placeholder="0-40"
                value={formData.final_grade}
                onChange={(e) => setFormData({...formData, final_grade: e.target.value})}
                className="text-lg font-medium"
              />
            </div>
          </div>

          {/* الدرجة الإجمالية (للعرض فقط) */}
          <div className="space-y-2">
            <Label>الدرجة الإجمالية</Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <span className="text-lg font-bold text-university-blue">
                {((parseFloat(formData.coursework_grade) || 0) + 
                  (parseFloat(formData.midterm_grade) || 0) + 
                  (parseFloat(formData.final_grade) || 0)).toFixed(1)} / 100
              </span>
            </div>
          </div>

          {/* ملاحظات */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={updateGradeMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateGradeMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={updateGradeMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};