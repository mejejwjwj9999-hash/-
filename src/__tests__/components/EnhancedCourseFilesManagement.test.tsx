import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import EnhancedCourseFilesManagement from '@/components/admin/EnhancedCourseFilesManagement';
import * as useCourseFilesManagement from '@/hooks/useCourseFilesManagement';

// Mock the hooks
vi.mock('@/hooks/useCourseFilesManagement');

const mockFiles = [
  {
    id: '1',
    file_name: 'lecture1.pdf',
    file_type: 'application/pdf',
    file_size: 1024000,
    file_path: '/files/lecture1.pdf',
    course_id: 'course1',
    category: 'lecture',
    description: 'First lecture',
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    courses: {
      course_name_ar: 'الرياضيات',
      course_name_en: 'Mathematics',
      course_code: 'MATH101'
    }
  }
];

const mockStatistics = {
  total: 1,
  totalSize: 1024000,
  publicFiles: 1,
  privateFiles: 0,
  recentFiles: 1,
  byType: { pdf: 1 }
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('EnhancedCourseFilesManagement', () => {
  beforeEach(() => {
    (useCourseFilesManagement.useAdminCourseFiles as any).mockReturnValue({
      data: mockFiles,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useCourseFilesManagement.useCourseFilesStatistics as any).mockReturnValue({
      data: mockStatistics,
    });

    (useCourseFilesManagement.useDeleteCourseFile as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (useCourseFilesManagement.useDownloadCourseFile as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });
  });

  it('renders enhanced course files management interface', async () => {
    const { getByText } = render(
      <TestWrapper>
        <EnhancedCourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('ملفات المقررات')).toBeInTheDocument();
    expect(getByText('إجمالي الملفات')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
  });

  it('displays file statistics correctly', async () => {
    const { getByText } = render(
      <TestWrapper>
        <EnhancedCourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('1')).toBeInTheDocument(); // Total files
    expect(getByText('1 ميجابايت')).toBeInTheDocument(); // Total size
  });

  it('allows searching files', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <EnhancedCourseFilesManagement />
      </TestWrapper>
    );

    const searchInput = getByPlaceholderText('البحث في أسماء الملفات والوصف...');
    await user.type(searchInput, 'lecture');

    expect(searchInput).toHaveValue('lecture');
  });

  it('renders file upload button', async () => {
    const { getByText } = render(
      <TestWrapper>
        <EnhancedCourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('رفع ملف جديد')).toBeInTheDocument();
  });

  it('displays files in list format', async () => {
    const { getByText } = render(
      <TestWrapper>
        <EnhancedCourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('lecture1.pdf')).toBeInTheDocument();
    expect(getByText('الرياضيات')).toBeInTheDocument();
  });
});