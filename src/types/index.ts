export interface Book {
  id: string;
  title: string;
  author?: string;
  content: string;
  chapters: Chapter[];
  concepts: Concept[];
  uploadedAt: Date;
  totalPages?: number;
  category?: string;
  description?: string;
  coverColor?: string;
  estimatedReadTime?: string;
  difficulty?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  summary?: string;
  keyPoints: string[];
  startIndex: number;
  endIndex: number;
  concepts: string[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  occurrences: number;
  relatedConcepts: string[];
  chapterIds: string[];
}

export interface AnalysisProgress {
  stage: 'uploading' | 'extracting' | 'analyzing' | 'summarizing' | 'complete';
  progress: number;
  message: string;
}

export interface BookUploadState {
  file: File | null;
  isDragging: boolean;
  isProcessing: boolean;
  error: string | null;
}

export type FileType = 'pdf' | 'epub' | 'txt' | 'unknown';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Insight {
  id?: string;
  title: string;
  summary: string;
  evidence: string;
  implication: string;
  insight_type?: 'pattern' | 'causal' | 'distinction' | 'counter_intuitive' | 'framework';
  created_at?: string;
  is_ai_generated?: boolean;
}
