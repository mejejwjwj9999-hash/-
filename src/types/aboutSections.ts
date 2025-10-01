export interface AboutSection {
  id: string;
  page_key: string;
  page_name_ar: string;
  page_name_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  elements?: AboutSectionElement[];
}

export interface AboutSectionElement {
  id: string;
  page_id: string;
  element_key: string;
  element_type: 'text' | 'rich_text' | 'image' | 'link' | 'button';
  content_ar?: string;
  content_en?: string;
  metadata?: any;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface AboutSectionStats {
  totalSections: number;
  activeSections: number;
  inactiveSections: number;
  sectionsWithContent: number;
  lastUpdated?: string;
}

export interface BoardMember {
  name_ar: string;
  name_en?: string;
  position_ar: string;
  position_en?: string;
  image?: string;
  bio_ar?: string;
  bio_en?: string;
  order?: number;
}

export interface QualityStatistic {
  label_ar: string;
  label_en?: string;
  value: string;
  icon?: string;
  color?: string;
}

export interface ResearchProject {
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: 'active' | 'completed' | 'planned';
  year: string;
  researchers?: string[];
  publications?: string[];
}

export interface ResearchField {
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  color?: string;
  projectCount: number;
}

export interface Publication {
  title_ar: string;
  title_en?: string;
  authors_ar: string[];
  authors_en?: string[];
  journal_ar: string;
  journal_en?: string;
  year: string;
  category: string;
  downloadUrl?: string;
  abstract_ar?: string;
  abstract_en?: string;
}

export interface ResearchFacility {
  name_ar: string;
  name_en?: string; 
  description_ar?: string;
  description_en?: string;
  equipment_ar: string[];
  equipment_en?: string[];
  image?: string;
  capacity?: string;
}

export type SectionType = 
  | 'about-college'
  | 'about-dean-word' 
  | 'about-vision-mission'
  | 'about-board-members'
  | 'about-quality-assurance'
  | 'about-scientific-research';

export interface SectionFormData {
  [key: string]: any;
}