import { describe, it, expect } from '@jest/globals';
import { 
  DepartmentId, 
  ProgramId, 
  getDepartmentName, 
  getProgramName, 
  getProgramFee,
  getDepartmentByProgram,
  getProgramsByDepartment,
  calculateTotalFee,
  getDefaultFeeStructure
} from '@/domain/academics';

describe('Academics Domain', () => {
  describe('getDepartmentName', () => {
    it('should return Arabic department name by default', () => {
      expect(getDepartmentName(DepartmentId.TECH_SCIENCE)).toBe('قسم العلوم التقنية والحاسوب');
    });

    it('should return English department name when specified', () => {
      expect(getDepartmentName(DepartmentId.TECH_SCIENCE, 'en')).toBe('Technical & Computer Sciences');
    });

    it('should return department id if invalid', () => {
      expect(getDepartmentName('invalid' as DepartmentId)).toBe('invalid');
    });
  });

  describe('getProgramName', () => {
    it('should return Arabic program name by default', () => {
      expect(getProgramName(ProgramId.IT)).toBe('تكنولوجيا المعلومات');
    });

    it('should return English program name when specified', () => {
      expect(getProgramName(ProgramId.IT, 'en')).toBe('Information Technology');
    });

    it('should return program id if invalid', () => {
      expect(getProgramName('invalid' as ProgramId)).toBe('invalid');
    });
  });

  describe('getProgramFee', () => {
    it('should return correct fees for each program', () => {
      expect(getProgramFee(ProgramId.IT)).toBe(150000);
      expect(getProgramFee(ProgramId.BUSINESS)).toBe(120000);
      expect(getProgramFee(ProgramId.NURSING)).toBe(180000);
      expect(getProgramFee(ProgramId.PHARMACY)).toBe(200000);
      expect(getProgramFee(ProgramId.MIDWIFERY)).toBe(160000);
    });

    it('should return 0 for invalid program', () => {
      expect(getProgramFee('invalid' as ProgramId)).toBe(0);
    });
  });

  describe('getDepartmentByProgram', () => {
    it('should return correct department for each program', () => {
      expect(getDepartmentByProgram(ProgramId.IT)).toBe(DepartmentId.TECH_SCIENCE);
      expect(getDepartmentByProgram(ProgramId.BUSINESS)).toBe(DepartmentId.ADMIN_HUMANITIES);
      expect(getDepartmentByProgram(ProgramId.NURSING)).toBe(DepartmentId.MEDICAL);
      expect(getDepartmentByProgram(ProgramId.PHARMACY)).toBe(DepartmentId.MEDICAL);
      expect(getDepartmentByProgram(ProgramId.MIDWIFERY)).toBe(DepartmentId.MEDICAL);
    });

    it('should return null for invalid program', () => {
      expect(getDepartmentByProgram('invalid' as ProgramId)).toBeNull();
    });
  });

  describe('getProgramsByDepartment', () => {
    it('should return correct programs for each department', () => {
      expect(getProgramsByDepartment(DepartmentId.TECH_SCIENCE)).toEqual([ProgramId.IT]);
      expect(getProgramsByDepartment(DepartmentId.ADMIN_HUMANITIES)).toEqual([ProgramId.BUSINESS]);
      expect(getProgramsByDepartment(DepartmentId.MEDICAL)).toEqual([
        ProgramId.NURSING, 
        ProgramId.PHARMACY, 
        ProgramId.MIDWIFERY
      ]);
    });

    it('should return empty array for invalid department', () => {
      expect(getProgramsByDepartment('invalid' as DepartmentId)).toEqual([]);
    });
  });

  describe('Fee calculations', () => {
    it('should calculate total fee correctly', () => {
      const feeStructure = getDefaultFeeStructure(ProgramId.IT, 1, 1);
      const totalFee = calculateTotalFee(feeStructure);
      
      // Base: 150000, Registration: 10000, Library: 5000, Lab: 15000, Exam: 8000
      expect(totalFee).toBe(188000);
    });

    it('should have different lab fees for IT vs other programs', () => {
      const itFees = getDefaultFeeStructure(ProgramId.IT, 1, 1);
      const businessFees = getDefaultFeeStructure(ProgramId.BUSINESS, 1, 1);
      
      expect(itFees.additionalFees.lab).toBe(15000);
      expect(businessFees.additionalFees.lab).toBe(10000);
    });

    it('should return correct fee structure', () => {
      const feeStructure = getDefaultFeeStructure(ProgramId.PHARMACY, 2, 1);
      
      expect(feeStructure).toMatchObject({
        programId: ProgramId.PHARMACY,
        academicYear: 2,
        semester: 1,
        baseFee: 200000,
        additionalFees: {
          registration: 10000,
          library: 5000,
          lab: 10000,
          exam: 8000,
        }
      });
    });
  });
});