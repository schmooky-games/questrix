import { QuestIdentifiable } from './identifiable';
import { QuestTask } from './task';
import { QuestResetCondition } from './condition';
import { QuestReward } from './reward';

export interface QuestTemplate extends QuestIdentifiable {
  name: string;
  description: string;
  tasks: QuestTask[];
  resetConditions: QuestResetCondition[];
  rewards?: QuestReward[];
  metadata?: Record<string, unknown>;
}