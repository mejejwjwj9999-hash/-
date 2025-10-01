export interface FacultyMember {
  id: string;
  // مرجع إلى سجل المعلم في جدول teacher_profiles إن وُجد
  teacher_profile_id?: string;
  name_ar: string;
  name_en?: string;
  position_ar: string;
  position_en?: string;
  qualification_ar: string;
  qualification_en?: string;
  specialization_ar: string;
  specialization_en?: string;
  university_ar?: string;
  university_en?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  bio_ar?: string;
  bio_en?: string;
  research_interests?: string[];
  publications?: string[];
  order: number;
}

export interface CourseSubject {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  credit_hours: number;
  theory_hours: number;
  practical_hours: number;
  prerequisites?: string[];
  description_ar?: string;
  description_en?: string;
  order: number;
}

export interface AcademicSemester {
  id: string;
  semester_number: 1 | 2; // الفصل الأول أو الثاني
  semester_name_ar: string;
  semester_name_en?: string;
  subjects: CourseSubject[];
  total_credit_hours: number;
}

export interface AcademicYear {
  year_number: number;
  year_name_ar: string;
  year_name_en?: string;
  total_credit_hours: number;
  subjects: CourseSubject[]; // للتوافق مع الكود الحالي
  semesters?: AcademicSemester[]; // اختيارية للتوافق
}

export interface AdmissionRequirement {
  id: string;
  type: 'academic' | 'general';
  requirement_ar: string;
  requirement_en?: string;
  is_mandatory: boolean;
  order: number;
}

export interface ProgramStatistic {
  id?: string;
  label_ar: string;
  label_en?: string;
  value: string | number;
  icon?: string;
  icon_name?: string;
  description_ar?: string;
  description_en?: string;
  unit_ar?: string;
  unit_en?: string;
  order: number;
}

export interface CareerOpportunity {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  sector?: string;
  icon_name?: string;
  salary_range_ar?: string;
  salary_range_en?: string;
  job_locations?: string[];
  required_skills?: string[];
  order: number;
}

export interface ProgramFormData {
  program_key: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  summary_ar?: string;
  summary_en?: string;
  program_overview_ar?: string;
  program_overview_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  featured_image?: string;
  gallery: any[];
  duration_years: number;
  credit_hours: number;
  degree_type: string;
  department_ar?: string;
  department_en?: string;
  college_ar?: string;
  college_en?: string;
  admission_requirements_ar?: string;
  admission_requirements_en?: string;
  career_opportunities_ar?: string;
  career_opportunities_en?: string;
  curriculum: any[];
  contact_info: any;
  seo_settings: any;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;  
  has_page: boolean;
  page_template: string;
  metadata: any;
  student_count?: number;
  
  // البيانات الجديدة المهيكلة
  faculty_members: FacultyMember[];
  yearly_curriculum: AcademicYear[];
  academic_semesters?: AcademicSemester[];
  academic_requirements: AdmissionRequirement[];
  general_requirements: AdmissionRequirement[];
  program_statistics: ProgramStatistic[];
  career_opportunities_list: CareerOpportunity[];
  
  // الحقول الجديدة المضافة
  program_vision_ar?: string;
  program_vision_en?: string;
  program_mission_ar?: string;
  program_mission_en?: string;
  program_objectives?: any[];
  graduate_specifications?: any[];
  learning_outcomes?: any[];
  benchmark_programs?: any[];
  program_references?: any[];
  job_opportunities?: any[];
}

export const createInitialFormData = (): ProgramFormData => ({
  program_key: '',
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  summary_ar: '',
  summary_en: '',
  program_overview_ar: '',
  program_overview_en: '',
  icon_name: 'graduation-cap',
  icon_color: '#3b82f6',
  background_color: '#f8fafc',
  featured_image: '',
  gallery: [],
  duration_years: 4,
  credit_hours: 132,
  degree_type: 'bachelor',
  department_ar: '',
  department_en: '',
  college_ar: '',
  college_en: '',
  admission_requirements_ar: '',
  admission_requirements_en: '',
  career_opportunities_ar: '',
  career_opportunities_en: '',
  curriculum: [],
  contact_info: {},
  seo_settings: {},
  display_order: 0,
  is_active: true,
  is_featured: false,
  has_page: true,
  page_template: 'standard', 
  metadata: {},
  student_count: 0,
  faculty_members: [],
  yearly_curriculum: [],
  academic_semesters: [],
  academic_requirements: [],
  general_requirements: [],
  program_statistics: [],
  career_opportunities_list: [],
  program_vision_ar: '',
  program_vision_en: '',
  program_mission_ar: '',
  program_mission_en: '',
  program_objectives: [],
  graduate_specifications: [],
  learning_outcomes: [],
  benchmark_programs: [],
  program_references: [],
  job_opportunities: []
});