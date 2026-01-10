export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  KAIZEN = 'KAIZEN',
  FIVE_WHYS = 'FIVE_WHYS',
  WASTE_SCANNER = 'WASTE_SCANNER',
  GEMBA_WALK = 'GEMBA_WALK',
  A3_SOLVER = 'A3_SOLVER',
  EIGHT_WASTES = 'EIGHT_WASTES',
  ISHIKAWA = 'ISHIKAWA',
  PDCA = 'PDCA'
}

export interface KaizenSuggestion {
  title: string;
  problemStatement: string;
  rootCause: string;
  countermeasure: string;
  expectedBenefit: string;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface WasteAnalysis {
  detectedWastes: Array<{
    type: string; // e.g., Inventory, Motion, Defects
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    recommendation: string;
  }>;
  overallScore: number; // 0-100
  summary: string;
}

export interface GembaChecklist {
  areaName: string;
  focusArea: string;
  categories: Array<{
    categoryName: string; // e.g., Safety, Flow, Standard Work
    items: string[];
  }>;
}

export interface A3Report {
  theme: string;
  background: string;
  currentCondition: string;
  goal: string;
  rootCauseAnalysis: string;
  countermeasures: string;
  implementationPlan: string[];
  followUp: string;
}

export interface EightWastesReport {
  executiveSummary: string;
  wasteBreakdown: Array<{
    wasteType: string;
    analysis: string;
    actionItems: string[];
    priority: 'High' | 'Medium' | 'Low';
  }>;
  overallHealthScore: number;
}

export interface IshikawaDiagram {
  problem: string;
  categories: Array<{
    category: string; // Man, Machine, Material, Method, Measurement, Environment
    causes: string[];
  }>;
}

export interface PDCAPlan {
  title: string;
  plan: {
    objective: string;
    steps: string[];
  };
  do: {
    actions: string[];
    resources: string[];
  };
  check: {
    kpis: string[];
    reviewDate: string;
  };
  act: {
    standardization: string;
    futureImprovements: string;
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
}