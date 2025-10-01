import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import CourseFilesManagement from '@/components/admin/CourseFilesManagement';
import * as useCourseFilesManagement from '@/hooks/useCourseFilesManagement';

// Mock the hooks
vi.mock('@/hooks/useCourseFilesManagement');
vi.mock('@/hooks/usePrograms');

const mockFiles = [
  {
    id: '1',
    course_id: 'course-1',
    file_name: 'lecture-1.pdf',
    file_path: '/files/lecture-1.pdf',
    file_type: 'application/pdf',
    file_size: 1024000,
    category: 'lecture',
    description: 'First lecture notes',
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    courses: {
      course_name_ar: 'مقدمة في الحاسوب',
      course_name_en: 'Introduction to Computer',
      course_code: 'CS101',
    },
  },
];

const mockStatistics = {
  total: 1,
  byType: { 'application/pdf': 1 },
  byCategory: { lecture: 1 },
  totalSize: 1024000,
  publicFiles: 1,
  privateFiles: 0,
  recentFiles: 1,
};

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

describe('CourseFilesManagement', () => {
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

  it('renders course files management interface', async () => {
    const { getByText } = render(
      <TestWrapper>
        <CourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('ملفات المقررات')).toBeInTheDocument();
    expect(getByText('إجمالي الملفات')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
  });

  it('displays file statistics correctly', async () => {
    const { getByText } = render(
      <TestWrapper>
        <CourseFilesManagement />
      </TestWrapper>
    );

    expect(getByText('1')).toBeInTheDocument(); // Total files
    expect(getByText('1 ميجابايت')).toBeInTheDocument(); // Total size
  });

  it('allows searching files', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <CourseFilesManagement />
      </TestWrapper>
    );

    const searchInput = getByPlaceholderText('البحث في أسماء الملفات والوصف...');
    await user.type(searchInput, 'lecture');

    expect(searchInput).toHaveValue('lecture');
  });

  it('opens upload modal when upload button is clicked', async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <TestWrapper>
        <CourseFilesManagement />
      </TestWrapper>
    );

    const uploadButton = getByText('رفع ملف جديد');
    await user.click(uploadButton);

    expect(getByText('رفع ملفات جديدة')).toBeInTheDocument();
  });
});