import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    },
  },
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.isUploading).toBe(false);
    expect(typeof result.current.uploadFile).toBe('function');
    expect(typeof result.current.cancelUpload).toBe('function');
  });

  it('should upload file successfully', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockUploadResponse = { data: { path: 'test/test.txt' }, error: null };
    const mockPublicUrlResponse = { data: { publicUrl: 'https://example.com/test.txt' } };

    (supabase.storage.from as any).mockReturnValue({
      upload: vi.fn().mockResolvedValue(mockUploadResponse),
      getPublicUrl: vi.fn().mockReturnValue(mockPublicUrlResponse),
    });

    const { result } = renderHook(() => useFileUpload());

    let uploadResult: string;
    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile, 'test');
    });

    expect(uploadResult!).toBe('https://example.com/test.txt');
    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadProgress).toBe(0);
  });

  it('should handle upload error', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockError = new Error('Upload failed');

    (supabase.storage.from as any).mockReturnValue({
      upload: vi.fn().mockRejectedValue(mockError),
    });

    const { result } = renderHook(() => useFileUpload());

    await act(async () => {
      try {
        await result.current.uploadFile(mockFile, 'test');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadProgress).toBe(0);
  });

  it('should upload multiple files', async () => {
    const mockFiles = [
      new File(['test1'], 'test1.txt', { type: 'text/plain' }),
      new File(['test2'], 'test2.txt', { type: 'text/plain' }),
    ];
    
    const mockUploadResponse = { data: { path: 'test.txt' }, error: null };
    const mockPublicUrlResponse = { data: { publicUrl: 'https://example.com/test.txt' } };

    (supabase.storage.from as any).mockReturnValue({
      upload: vi.fn().mockResolvedValue(mockUploadResponse),
      getPublicUrl: vi.fn().mockReturnValue(mockPublicUrlResponse),
    });

    const { result } = renderHook(() => useFileUpload());

    let uploadResults: string[];
    await act(async () => {
      uploadResults = await result.current.uploadMultipleFiles(
        mockFiles,
        (file, index) => `test-${index}`
      );
    });

    expect(uploadResults!).toHaveLength(2);
    expect(uploadResults![0]).toBe('https://example.com/test.txt');
    expect(uploadResults![1]).toBe('https://example.com/test.txt');
  });
});