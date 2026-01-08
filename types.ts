export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  KAIZEN = 'KAIZEN',
  FIVE_WHYS = 'FIVE_WHYS',
  WASTE_SCANNER = 'WASTE_SCANNER'
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

export interface ChartDataPoint {
  name: string;
  value: number;
}
