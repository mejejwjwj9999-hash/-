export enum DepartmentId {
  TECH_SCIENCE = "tech_science",
  ADMIN_HUMANITIES = "admin_humanities", 
  MEDICAL = "medical",
}

export enum ProgramId {
  IT = "it",
  BUSINESS = "business",
  NURSING = "nursing",
  PHARMACY = "pharmacy",
  MIDWIFERY = "midwifery",
}

export interface Department {
  name: {
    ar: string;
    en: string;
  };
  programs: ProgramId[];
}

export interface Program {
  name: {
    ar: string;
    en: string;
  };
  defaultFee: number;
  duration: number; // بالسنوات
  description?: {
    ar: string;
    en: string;
  };
}

export const Departments: Record<DepartmentId, Department> = {
  [DepartmentId.TECH_SCIENCE]: {
    name: { ar: "قسم العلوم التقنية والحاسوب", en: "Technical & Computer Sciences" },
    programs: [ProgramId.IT],
  },
  [DepartmentId.ADMIN_HUMANITIES]: {
    name: { ar: "قسم العلوم الإدارية والإنسانية", en: "Administrative & Humanities" },
    programs: [ProgramId.BUSINESS],
  },
  [DepartmentId.MEDICAL]: {
    name: { ar: "قسم العلوم الطبية", en: "Medical Sciences" },
    programs: [ProgramId.NURSING, ProgramId.PHARMACY, ProgramId.MIDWIFERY],
  },
};

export const Programs: Record<ProgramId, Program> = {
  [ProgramId.IT]: { 
    name: { ar: "تكنولوجيا المعلومات", en: "Information Technology" }, 
    defaultFee: 150000, 
    duration: 4,
    description: { 
      ar: "برنامج شامل في تقنية المعلومات والحاسوب", 
      en: "Comprehensive Information Technology program" 
    }
  },
  [ProgramId.BUSINESS]: { 
    name: { ar: "إدارة الأعمال", en: "Business Administration" }, 
    defaultFee: 120000, 
    duration: 4,
    description: { 
      ar: "برنامج إدارة الأعمال والعلوم الإدارية", 
      en: "Business Administration and Management Sciences program" 
    }
  },
  [ProgramId.NURSING]: { 
    name: { ar: "التمريض", en: "Nursing" }, 
    defaultFee: 180000, 
    duration: 4,
    description: { 
      ar: "برنامج التمريض والرعاية الصحية", 
      en: "Nursing and Healthcare program" 
    }
  },
  [ProgramId.PHARMACY]: { 
    name: { ar: "الصيدلة", en: "Pharmacy" }, 
    defaultFee: 200000, 
    duration: 5,
    description: { 
      ar: "برنامج الصيدلة والعلوم الصيدلانية", 
      en: "Pharmacy and Pharmaceutical Sciences program" 
    }
  },
  [ProgramId.MIDWIFERY]: { 
    name: { ar: "القبالة", en: "Midwifery" }, 
    defaultFee: 160000, 
    duration: 4,
    description: { 
      ar: "برنامج القبالة وصحة الأم والطفل", 
      en: "Midwifery and Maternal-Child Health program" 
    }
  },
};

// Helper functions
export const getDepartmentName = (departmentId: DepartmentId, language: 'ar' | 'en' = 'ar'): string => {
  return Departments[departmentId]?.name[language] || departmentId;
};

export const getProgramName = (programId: ProgramId, language: 'ar' | 'en' = 'ar'): string => {
  return Programs[programId]?.name[language] || programId;
};

export const getProgramsByDepartment = (departmentId: DepartmentId): ProgramId[] => {
  return Departments[departmentId]?.programs || [];
};

export const getDepartmentByProgram = (programId: ProgramId): DepartmentId | null => {
  for (const [deptId, department] of Object.entries(Departments)) {
    if (department.programs.includes(programId)) {
      return deptId as DepartmentId;
    }
  }
  return null;
};

export const getProgramFee = (programId: ProgramId): number => {
  return Programs[programId]?.defaultFee || 0;
};

export const getAllDepartments = (): Array<{ id: DepartmentId; name: { ar: string; en: string } }> => {
  return Object.entries(Departments).map(([id, dept]) => ({
    id: id as DepartmentId,
    name: dept.name
  }));
};

export const getAllPrograms = (): Array<{ id: ProgramId; name: { ar: string; en: string }; defaultFee: number }> => {
  return Object.entries(Programs).map(([id, program]) => ({
    id: id as ProgramId,
    name: program.name,
    defaultFee: program.defaultFee
  }));
};

// Fee calculation utilities
export interface FeeStructure {
  programId: ProgramId;
  academicYear: number;
  semester: number;
  baseFee: number;
  additionalFees: {
    registration: number;
    library: number;
    lab: number;
    exam: number;
  };
}

export const calculateTotalFee = (feeStructure: FeeStructure): number => {
  const { baseFee, additionalFees } = feeStructure;
  return baseFee + additionalFees.registration + additionalFees.library + 
         additionalFees.lab + additionalFees.exam;
};

export const getDefaultFeeStructure = (programId: ProgramId, academicYear: number, semester: number): FeeStructure => {
  const baseFee = getProgramFee(programId);
  return {
    programId,
    academicYear,
    semester,
    baseFee,
    additionalFees: {
      registration: 10000,
      library: 5000,
      lab: programId === ProgramId.IT ? 15000 : 10000,
      exam: 8000,
    }
  };
};