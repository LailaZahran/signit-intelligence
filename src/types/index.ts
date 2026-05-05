// /src/types/index.ts
// Authoritative type definitions for Signit Intelligence Platform.

export type PersonaId = 'legal' | 'procurement' | 'cfo';

export type ContractType =
  | 'saas'
  | 'vendor'
  | 'nda'
  | 'employment'
  | 'lease'
  | 'jv'
  | 'legal'
  | 'cloud'
  | 'marketing';

export type ContractStatus =
  | 'active'
  | 'expiring'
  | 'flagged'
  | 'in_negotiation';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export type Emphasis = 'critical' | 'warning';

export type SignalColor = 'red' | 'amber' | 'green';

export type Currency = 'SAR' | 'USD';

export interface Signal {
  color: SignalColor;
  label: string;
}

export interface PersonaSummary {
  legal: string;
  procurement: string;
  cfo: string;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  riskLevel?: RiskLevel | 'ok';
}

export interface RiskFlag {
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  persona: PersonaId[];
}

export interface ContractSection {
  id: string;
  title: string;
  content: string;
  confidence: number;
  sourceClause: string;
  contractType?: ContractType[];
}

export interface Contract {
  id: string;
  title: string;
  counterparty: string;
  type: ContractType;
  contractNumber: string;
  status: ContractStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  annualValueSAR: number;
  annualValueDisplay: string;
  currency: Currency;
  startDate: string;
  endDate: string;
  nextCriticalDate: string;
  nextCriticalDateLabel: string;
  daysToNextCritical: number;
  noticeRequiredDays: number;
  governingLaw: string;
  signals: Signal[];
  aiSummary: PersonaSummary;
  extractedFields: ExtractedField[];
  riskFlags: RiskFlag[];
  sections: ContractSection[];
  negotiationAngles: string[];
}

export interface BriefingLine {
  text: string;
  navigateTo: string;
  delta?: string;
}

export interface ActionBubble {
  label: string;
  icon: string;
  navigateTo: string;
  isPrimary: boolean;
}

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  initials: string;
  color: string;
  bgColor: string;
  borderColor: string;
  briefingLines: BriefingLine[];
  bubbles: ActionBubble[];
  cmdPlaceholder: string;
  footerNote: string;
  footerStat: string;
}

export interface NarrativeSegment {
  type: 'text' | 'link';
  content: string;
  route?: string;
  emphasis?: Emphasis;
}

export interface PersonaNarrative {
  segments: NarrativeSegment[];
  delta: string;
  urgentAction: string;
}

export interface Contradiction {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  contracts: string[];
  contractLabels: string[];
}

export interface RiskMatrixData {
  vendors: string[];
  riskTypes: string[];
  cells: RiskLevel[][];
  contractIds: string[][];
}

export interface CommandResult {
  label: string;
  sublabel?: string;
  route: string;
  badge?: 'critical' | 'high' | 'medium';
}

export interface CommandAction {
  label: string;
  route: string;
}

export interface CommandResponse {
  id: string;
  keywords: string[];
  persona?: PersonaId[];
  answer: string;
  results: CommandResult[];
  action?: CommandAction;
}

export type UploadStep =
  | 'reading'
  | 'identifying'
  | 'extracting'
  | 'scoring'
  | 'building';

export interface UploadState {
  status: 'idle' | 'processing' | 'preview' | 'success' | 'error';
  activeStep?: UploadStep;
  fileName?: string;
  isScanned?: boolean;
  previewContract?: Partial<Contract>;
  newContradictionDetected?: boolean;
}

export interface MetricCardData {
  label: string;
  value: string;
  sub: string;
  variant: 'default' | 'warning' | 'critical';
}
