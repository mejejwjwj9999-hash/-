import { z } from 'zod';
import { ProgramId } from '@/domain/academics';

export const paymentFormSchema = z.object({
  student_id: z.string().min(1, 'يرجى اختيار الطالب'),
  program_id: z.string().min(1, 'يرجى اختيار البرنامج'),
  amount: z.string().min(1, 'المبلغ مطلوب').refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    'المبلغ يجب أن يكون أكبر من صفر'
  ),
  payment_type: z.string().min(1, 'يرجى اختيار نوع الدفعة'),
  payment_status: z.string().min(1, 'يرجى اختيار حالة الدفعة'),
  payment_method: z.string().min(1, 'يرجى اختيار طريقة الدفع'),
  payment_date: z.string().min(1, 'تاريخ الدفع مطلوب'),
  due_date: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  description: z.string().optional(),
  invoice_number: z.string().optional(),
  reference_number: z.string().optional(),
  academic_year: z.string().min(1, 'السنة الدراسية مطلوبة'),
  semester: z.string().min(1, 'الفصل مطلوب'),
  currency: z.string().default('YER')
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

export const studentFormSchema = z.object({
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

export type StudentFormData = z.infer<typeof studentFormSchema>;