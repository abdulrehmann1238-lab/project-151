export type Category = 
  | 'dmv'
  | 'unemployment'
  | 'housing'
  | 'credit'
  | 'insurance'
  | 'consumer'
  | 'employment'
  | 'business'
  | 'government';

export type StepStatus = 'pending' | 'current' | 'done' | 'blocked';

export interface KeyDate {
  id: string;
  label: string;
  dateStr: string;
  isOverdue?: boolean;
  isUrgent?: boolean;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  who: 'You' | 'DMV' | 'Court' | 'Agency' | 'Landlord';
  minutes: number;
  why: string;
  instructions: string;
  documents: string[];
  resourceIds: string[];
  fallback: string;
  status: StepStatus;
  deadline?: string;
  isHighlighted?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  agency: string;
  type: 'website' | 'form' | 'office' | 'phone';
  badge: 'official' | 'nonprofit' | 'community';
  lastChecked: string;
  why: string;
  summary?: string;
  contactDetails?: {
    url?: string;
    phone?: string;
    hours?: string;
    address?: string;
    formNumber?: string;
  };
  usedInStepIds?: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  detail?: string;
}

export interface Question {
  id: string;
  question: string;
  helperText?: string;
  options: QuestionOption[];
  allowNotSure?: boolean;
}

export interface Case {
  id: string;
  title: string;
  category: Category;
  situation: string;
  location: string;
  urgency: 'Time-sensitive' | 'Standard' | 'Urgent';
  confidence: 'High' | 'Moderate' | 'Low';
  restatement: string;
  status: 'Not started' | 'In progress' | 'Waiting on agency' | 'Resolved';
  steps: Step[];
  answers: Record<string, string>;
  deadlines: KeyDate[];
  documents: { name: string; checked: boolean }[];
  updatedAt: string;
  isCustom?: boolean;
}

export interface ScenarioDefinition {
  id: string;
  category: Category;
  title: string;
  situation: string;
  location: string;
  urgency: 'Time-sensitive' | 'Standard' | 'Urgent';
  defaultRestatement: string;
  questions: Question[];
  buildSteps: (answers: Record<string, string>) => Step[];
  deadlines: KeyDate[];
  defaultDocuments: string[];
}
