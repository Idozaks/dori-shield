
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
  safetyReason?: string; // New: Explains why this specific element is safe
}

export interface SimulationStep {
  id: string;
  title: string;
  subtitle: string;
  siteUrl: string;
  urlIsTrap?: boolean;
  urlDoriWarning?: string;
  urlSafetyReason?: string; // New: Explains why the URL is safe
  headerColor: string;
  fields: SimulationField[];
  doriIntro: string;
}

export interface SimulationData {
  brandName: string;
  visualVibePrompt: string; // Used for gemini-2.5-flash-image
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

export type AppState = 'IDLE' | 'ANALYZING' | 'RESULT' | 'SANDBOX' | 'FINISHED' | 'LIBRARY' | 'REPORT';
