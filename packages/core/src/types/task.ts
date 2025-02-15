import { TaskProgress } from './progress';
import { TaskCondition } from './condition';

export interface QuestTask {
  id: string;
  name: string;
  description: string;
  progress: TaskProgress;
  conditions: TaskCondition[];
  metadata?: Record<string, unknown>;
}
