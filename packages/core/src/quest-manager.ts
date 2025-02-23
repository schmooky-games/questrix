import { BaseQuest } from './base-quest';
import { GameEvent } from './types';

/**
 * Manages all active quests for a single player
 * @template E - Event enum type specific to the game
 */
export class QuestManager<E extends string> {
  private quests: BaseQuest<E>[] = [];

  /**
   * Add a quest to the manager
   */
  public addQuest(quest: BaseQuest<E>): void {
    if (!this.quests.find(q => q.slug === quest.slug)) {
      this.quests.push(quest);
    }
  }

  /**
   * Emit an event to all active quests
   */
  public emit(event: GameEvent<E>): void {
    this.quests.forEach(quest => quest.processEvent(event));
  }

  /**
   * Get all active quests
   */
  public getQuests(): BaseQuest<E>[] {
    return [...this.quests];
  }

  /**
   * Generate HTML visualization of all quests
   */
  public toHTML(): string {
    return this.quests.map(quest => quest.toHTML()).join('');
  }
}