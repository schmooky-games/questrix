import { QuestIdentifiable } from './identifiable';
import { TaskProgress } from './progress';

export interface QuestInstance extends QuestIdentifiable {
  templateId: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  validUntil?: Date;
  progress: Record<string, TaskProgress>;
  metadata?: Record<string, unknown>;
}