
export interface SmokeLog {
  id: number;
  timestamp: number;
}

export interface ChartData {
  name: string;
  count: number;
}

export type GoalType = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  type: GoalType;
  limit: number;
}
