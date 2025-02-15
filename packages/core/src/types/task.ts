import { TaskProgress } from './progress';
import { QuestCondition } from './condition';

export interface QuestTask {
  id: string;
  name: string;
  description: string;
  progress: TaskProgress;
  conditions: QuestCondition[];
  metadata?: Record<string, unknown>;
}
