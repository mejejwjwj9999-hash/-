import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedServicesManagement from '@/components/admin/EnhancedServicesManagement';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

// Mock Supabase client
const mockServiceRequests = [
  {
    id: '1',
    student_id: 'student1',
    title: 'طلب كشف درجات',
    description: 'كشف درجات للفصل الأول',
    service_type: 'transcript',
    status: 'pending',
    priority: 'normal',
    created_at: '2024-01-15T10:00:00Z',
    student_profiles: {
      id: 'student1',
      student_id: 'STD001',
      first_name: 'أحمد',
      last_name: 'محمد',
      email: 'ahmed@example.com',
      department: 'قسم الحاسوب',
      department_id: 'tech_science',
      program_id: 'it',
      academic_year: 2,
      semester: 1
    }
  }
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: mockServiceRequests,
          error: null
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
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

describe('EnhancedServicesManagement Component', () => {
  it('should render services management component', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(EnhancedServicesManagement), { wrapper });
    expect(result.container).toBeTruthy();
  });

  it('should display basic functionality', () => {
    const wrapper = createWrapper();
    const result = render(React.createElement(EnhancedServicesManagement), { wrapper });
    expect(result.container.textContent).toBeTruthy();
  });
});