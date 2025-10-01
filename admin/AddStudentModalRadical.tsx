
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getProgramsByDepartment } from '@/domain/academics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDateForInput, sanitizeDateForDatabase } from '@/utils/dateUtils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DepartmentId, ProgramId, getAllDepartments, getAllPrograms, getDepartmentName, getProgramName } from '@/domain/academics';

interface AddStudentModalRadicalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudentModalRadical: React.FC<AddStudentModalRadicalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Zod schema for student validation
  const studentSchema = z.object({
    student_id: z.string().min(1, 'رقم الطالب مطلوب').regex(/^[A-Za-z0-9]+$/, 'رقم الطالب يجب أن يحتوي على أرقام وحروف إنجليزية فقط'),
    first_name: z.string().min(1, 'الاسم الأول مطلوب'),
    last_name: z.string().min(1, 'الاسم الأخير مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    phone: z.string().optional().refine(val => !val || /^[0-9+\-\s()]+$/.test(val), 'رقم الهاتف غير صحيح'),
    college: z.string().min(1, 'الكلية مطلوبة'),
    department_id: z.string().min(1, 'القسم مطلوب'),
    program_id: z.string().min(1, 'البرنامج مطلوب'),
    academic_year: z.number().min(1).max(6),
    semester: z.number().min(1).max(3),
    admission_date: z.string().min(1, 'تاريخ القبول مطلوب'),
    status: z.string().default('active')
  });

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      college: '',
      department_id: '',
      program_id: '',
      academic_year: 1,
      semester: 1,
      admission_date: new Date().toISOString().split('T')[0],
      status: 'active'
    }
  });

  // Load departments and programs
  const departments = getAllDepartments();
  const programs = getAllPrograms();
  const selectedDepartmentId = form.watch('department_id');
  
  // Filter programs by selected department
  const availablePrograms = selectedDepartmentId 
    ? programs.filter(program => {
        return departments.some(dept => 
          dept.id === selectedDepartmentId && 
          getProgramsByDepartment(dept.id).includes(program.id as ProgramId)
        );
      })
    : programs;

  const colleges = [
    'كلية الطب',
    'كلية الهندسة', 
    'كلية الحاسوب',
    'كلية إدارة الأعمال',
    'كلية القانون',
    'كلية التربية',
    'كلية الصيدلة',
    'كلية التمريض'
  ];

  const addStudent = useMutation({
    mutationFn: async (data: z.infer<typeof studentSchema>) => {
      console.log('Adding new student:', data);
      
      const sanitizedData = {
        student_id: data.student_id.trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        college: data.college.trim(),
        department: getDepartmentName(data.department_id as DepartmentId),
        department_id: data.department_id,
        program_id: data.program_id,
        academic_year: data.academic_year,
        semester: data.semester,
        admission_date: sanitizeDateForDatabase(data.admission_date),
        status: data.status,
      };

      const { error } = await supabase
        .from('student_profiles')
        .insert([sanitizedData]);

      if (error) {
        console.error('Error adding student:', error);
        if (error.code === '23505') {
          if (error.message.includes('student_id')) {
            throw new Error('رقم الطالب موجود مسبقاً');
          } else if (error.message.includes('email')) {
            throw new Error('البريد الإلكتروني مستخدم مسبقاً');
          }
        }
        throw new Error(error.message || 'فشل في إضافة الطالب');
      }
      
      console.log('Student added successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students-radical'] });
      toast({
        title: 'تمت الإضافة بنجاح ✅',
        description: 'تم إضافة الطالب بنجاح.',
      });
      onSuccess();
      form.reset();
    },
    onError: (error: Error) => {
      console.error('Error adding student:', error);
      toast({
        title: 'خطأ في الإضافة ❌',
        description: error.message || 'فشل في إضافة الطالب.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    addStudent.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            إضافة طالب جديد
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الطالب *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: STD202400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="suspended">معلق</SelectItem>
                        <SelectItem value="graduated">متخرج</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأخير *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 777123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكلية *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الكلية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القسم *</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('program_id', ''); // Reset program when department changes
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name.ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البرنامج الأكاديمي *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDepartmentId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البرنامج" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name.ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السنة الدراسية *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">السنة الأولى</SelectItem>
                        <SelectItem value="2">السنة الثانية</SelectItem>
                        <SelectItem value="3">السنة الثالثة</SelectItem>
                        <SelectItem value="4">السنة الرابعة</SelectItem>
                        <SelectItem value="5">السنة الخامسة</SelectItem>
                        <SelectItem value="6">السنة السادسة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفصل الدراسي *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                        <SelectItem value="3">الفصل الصيفي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="admission_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ القبول *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={addStudent.isPending}>
                {addStudent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  'إضافة الطالب'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModalRadical;
