export interface HeroElementBase {
  id: string;
  type: 'text' | 'rich_text' | 'image' | 'button' | 'icon' | 'stat' | 'background' | 'layout';
  pageKey: string;
  elementKey: string;
  order: number;
  visible: boolean;
  className?: string;
}

export interface TextElement extends HeroElementBase {
  type: 'text' | 'rich_text';
  content: {
    ar: string;
    en: string;
  };
  styling: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    marginBottom?: string;
    animation: string;
    animationDelay: string;
    animationDuration?: string;
    animationTimingFunction?: string;
    animationIterationCount?: string;
    animationDirection?: string;
  };
}

export interface ImageElement extends HeroElementBase {
  type: 'image';
  src: string;
  alt: {
    ar: string;
    en: string;
  };
  styling: {
    width: string;
    height: string;
    borderRadius: string;
    shadow: string;
    animation: string;
    animationDelay: string;
    animationDuration?: string;
    animationTimingFunction?: string;
    animationIterationCount?: string;
    animationDirection?: string;
  };
}

export interface ButtonElement extends HeroElementBase {
  type: 'button';
  text: {
    ar: string;
    en: string;
  };
  link: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: string;
  styling: {
    size: 'sm' | 'md' | 'lg';
    animation: string;
    animationDelay: string;
    animationDuration?: string;
    animationTimingFunction?: string;
    animationIterationCount?: string;
    animationDirection?: string;
  };
}

export interface IconElement extends HeroElementBase {
  type: 'icon';
  iconName: string;
  styling: {
    size: string;
    color: string;
    backgroundColor: string;
    borderRadius: string;
    padding: string;
    animation: string;
    animationDelay: string;
    animationDuration?: string;
    animationTimingFunction?: string;
    animationIterationCount?: string;
    animationDirection?: string;
  };
}

export interface StatElement extends HeroElementBase {
  type: 'stat';
  value: string;
  label: {
    ar: string;
    en: string;
  };
  icon?: string;
  styling: {
    valueSize: string;
    labelSize: string;
    color: string;
    iconColor: string;
    backgroundColor: string;
    borderRadius: string;
    animation: string;
    animationDelay: string;
    animationDuration?: string;
    animationTimingFunction?: string;
    animationIterationCount?: string;
    animationDirection?: string;
  };
}

export interface BackgroundElement extends HeroElementBase {
  type: 'background';
  backgroundType: 'gradient' | 'image' | 'pattern' | 'solid';
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
  image?: {
    src: string;
    opacity: string;
    overlay: string;
  };
  pattern?: {
    type: string;
    opacity: string;
    color: string;
  };
  solid?: {
    color: string;
  };
}

export interface LayoutElement extends HeroElementBase {
  type: 'layout';
  containerType: 'full' | 'container' | 'narrow';
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignment: 'start' | 'center' | 'end' | 'between' | 'around';
  spacing: string;
  padding: string;
  margin: string;
}

export type HeroElement = 
  | TextElement 
  | ImageElement 
  | ButtonElement 
  | IconElement 
  | StatElement 
  | BackgroundElement 
  | LayoutElement;

export interface HeroSectionConfig {
  id: string;
  name: string;
  elements: HeroElement[];
  settings: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ar' | 'en' | 'both';
    responsive: boolean;
    animations: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HeroTemplate {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  config: HeroSectionConfig;
  thumbnail: string;
  category: string;
}