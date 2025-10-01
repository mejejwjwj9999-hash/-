import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentsManagementRadical from '@/components/admin/PaymentsManagementRadical';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

// Mock Supabase client
const mockPayments = [
  {
    id: '1',
    student_id: 'student1',
    program_id: 'it',
    amount: 188000,
    payment_type: 'tuition',
    payment_status: 'pending',
    payment_method: 'cash',
    payment_date: '2024-01-15',
    due_date: '2024-02-15',
    description: 'رسوم الفصل الأول',
    invoice_number: 'INV-2024-001',
    reference_number: 'REF-001',
    academic_year: '2024',
    semester: '1',
    currency: 'YER',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    student_profiles: {
      id: 'student1',
      student_id: 'STD001',
      first_name: 'أحمد',
      last_name: 'محمد',
      program_id: 'it'
    }
  },
  {
    id: '2',
    student_id: 'student2',
    program_id: 'business',
    amount: 158000,
    payment_type: 'registration',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    payment_date: '2024-01-10',
    due_date: '2024-02-10',
    description: 'رسوم التسجيل',
    invoice_number: 'INV-2024-002',
    reference_number: 'REF-002',
    academic_year: '2024',
    semester: '1',
    currency: 'YER',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    student_profiles: {
      id: 'student2',
      student_id: 'STD002',
      first_name: 'فاطمة',
      last_name: 'علي',
      program_id: 'business'
    }
  }
];

const mockStudents = [
  {
    id: 'student1',
    student_id: 'STD001',
    first_name: 'أحمد',
    last_name: 'محمد',
    program_id: 'it',
    academic_year: 2,
    semester: 1
  },
  {
    id: 'student2',
    student_id: 'STD002',
    first_name: 'فاطمة',
    last_name: 'علي',
    program_id: 'business',
    academic_year: 1,
    semester: 1
  }
];

const mockPrograms = [
  {
    id: 'it',
    name: { ar: 'تكنولوجيا المعلومات', en: 'Information Technology' },
    defaultFee: 150000
  },
  {
    id: 'business',
    name: { ar: 'إدارة الأعمال', en: 'Business Administration' },
    defaultFee: 120000
  }
];

const mockProgramFee = {
  id: '1',
  program_id: 'it',
  academic_year: 2,
  semester: 1,
  base_fee: 150000,
  registration_fee: 10000,
  library_fee: 5000,
  lab_fee: 15000,
  exam_fee: 8000,
  is_active: true
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === 'payments') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: mockPayments,
              error: null
            }))
          })),
          insert: vi.fn(() => Promise.resolve({ error: null })),
          update: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null }))
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null }))
          }))
        };
      }
      if (table === 'student_profiles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({
                data: mockStudents,
                error: null
              }))
            }))
          }))
        };
      }
      if (table === 'program_fees') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({
                      data: mockProgramFee,
                      error: null
                    }))
                  }))
                }))
              }))
            }))
          }))
        };
      }
      return {
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      };
    })
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/hooks/usePrograms', () => ({
  usePrograms: () => ({
    data: mockPrograms,
    isLoading: false
  })
}));

vi.mock('@/hooks/useDepartments', () => ({
  useDepartments: () => ({
    data: [],
    isLoading: false
  })
}));

vi.mock('@/hooks/useProgramFees', () => ({
  useProgramFee: vi.fn(() => ({
    data: mockProgramFee,
    isLoading: false
  }))
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, 
      React.createElement('div', {}, 
        children,
        React.createElement(Toaster, {})
      )
    )
  );
};

describe('PaymentsManagementRadical Component', () => {
  it('should render payments management component', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('إدارة المدفوعات');
  });

  it('should display statistics cards', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('المجموع');
    expect(result.container.textContent).toContain('القيمة الإجمالية');
    expect(result.container.textContent).toContain('معلق');
    expect(result.container.textContent).toContain('مدفوع');
    expect(result.container.textContent).toContain('متأخر');
  });

  it('should display search and filter controls', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('البحث والفلترة');
    expect(result.container.querySelector('input[placeholder*="البحث"]')).toBeTruthy();
  });

  it('should display payments table headers', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('رقم الطالب');
    expect(result.container.textContent).toContain('اسم الطالب');
    expect(result.container.textContent).toContain('المبلغ');
    expect(result.container.textContent).toContain('النوع');
    expect(result.container.textContent).toContain('الحالة');
  });

  it('should have add payment button', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('إضافة مدفوعة');
  });

  it('should display enhanced badge', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(PaymentsManagementRadical), { wrapper });
    
    expect(result.container.textContent).toContain('محسنة');
  });
});