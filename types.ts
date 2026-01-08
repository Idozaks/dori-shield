
export interface Trap {
  id: string;
  type: string;
  reason: string;
  location?: string;
  severity: 'high' | 'medium';
}

export interface SimulationField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'password' | 'button' | 'info';
  isTrap: boolean;
  doriWarning?: string;
  safetyReason?: string;
}

export interface SimulationStep {
  id: string;
  title: string;
  subtitle: string;
  siteUrl: string;
  urlIsTrap?: boolean;
  urlDoriWarning?: string;
  urlSafetyReason?: string;
  headerColor: string;
  fields: SimulationField[];
  doriIntro: string;
}

export interface SimulationData {
  brandName: string;
  visualVibePrompt: string;
  steps: SimulationStep[];
}

export interface AnalysisResult {
  isScam: boolean;
  threatLevel: 'safe' | 'warning' | 'danger';
  summary: string;
  traps: Trap[];
  simulationType: 'bank' | 'package' | 'lottery' | 'family' | 'generic';
  simulation: SimulationData;
}

export interface UserPersona {
  ageGroup: string;
  familiarity: 'beginner' | 'intermediate' | 'expert';
}

export type AppState = 'LANDING' | 'ONBOARDING' | 'IDLE' | 'ANALYZING' | 'RESULT' | 'SANDBOX' | 'FINISHED' | 'LIBRARY' | 'REPORT' | 'ABOUT';
