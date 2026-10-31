export type TabType = 'overview' | 'schemes' | 'create' | 'subscribers' | 'system';

export interface Subscriber {
  id: string;
  contact: string;
  category: string;
  state: string;
  channel: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface PipelineStage {
  stage: string;
  count: number;
  status: string;
  details?: string;
}

