export enum AppStep {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
  SIGNING = 'SIGNING',
  HISTORY = 'HISTORY',
  PRICING = 'PRICING'
}

export interface GeneratedDocument {
  id?: string;
  title: string;
  htmlContent: string;
  createdDate: string;
}

export interface SignatureData {
  dataUrl: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  credits: number;
  plan: 'free' | 'pro';
}