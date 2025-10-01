import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProgramFees, calculateProgramTotalFee } from '@/hooks/useProgramFees';
import { ProgramId } from '@/domain/academics';
import React from 'react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({
                  data: [
                    {
                      id: '1',
                      program_id: 'it',
                      academic_year: 1,
                      semester: 1,
                      base_fee: 150000,
                      registration_fee: 10000,
                      library_fee: 5000,
                      lab_fee: 15000,
                      exam_fee: 8000,
                      is_active: true
                    }
                  ],
                  error: null
                }))
              }))
            }))
          }))
        }))
      }))
    }))
  }
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
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('useProgramFees Hook', () => {
  it('should fetch program fees successfully', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useProgramFees(ProgramId.IT, 1, 1),
      { wrapper }
    );

    expect(result.current).toBeTruthy();
  });

  it('should not fetch when programId is not provided', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useProgramFees(undefined, 1, 1),
      { wrapper }
    );

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe('calculateProgramTotalFee', () => {
  it('should calculate total fee correctly', () => {
    const feeData = {
      base_fee: 150000,
      registration_fee: 10000,
      library_fee: 5000,
      lab_fee: 15000,
      exam_fee: 8000
    };

    const total = calculateProgramTotalFee(feeData);
    expect(total).toBe(188000);
  });

  it('should return 0 for null fee data', () => {
    expect(calculateProgramTotalFee(null)).toBe(0);
    expect(calculateProgramTotalFee(undefined)).toBe(0);
  });

  it('should handle missing fee properties', () => {
    const feeData = {
      base_fee: 100000,
      registration_fee: 5000
      // Missing other fees
    };

    const total = calculateProgramTotalFee(feeData);
    expect(total).toBe(105000); // Only base_fee and registration_fee are provided
  });
});