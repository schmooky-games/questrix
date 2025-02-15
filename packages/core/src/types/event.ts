export interface QuestEvent<T = unknown> {
    type: string;
    timestamp: Date;
    data: T;
    metadata?: Record<string, unknown>;
  }