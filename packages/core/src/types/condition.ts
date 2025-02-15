import { QuestChecker } from '../classes/quest-checker';

export interface TaskCondition {
  type: string;
  checker: QuestChecker;
  metadata?: Record<string, unknown>;
}

export interface QuestResetCondition {
  event: string;
  checker: QuestChecker;
}