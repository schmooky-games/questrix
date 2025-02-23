import { Inject, Injectable } from '@nestjs/common';
import { QuestManager, BaseQuest, GameEvent } from '@questrix/core';

/**
 * Service for managing quests in a NestJS application
 * @template E - Event enum type specific to the game
 */
@Injectable()
export class QuestService<E extends string> {
  private questManager: QuestManager<E>;

  constructor(@Inject('EVENT_ENUM') private readonly eventEnum: Record<string, E>) {
    this.questManager = new QuestManager<E>();
  }

  /**
   * Add a quest to the manager
   * @param quest - Quest instance to add
   */
  public addQuest(quest: BaseQuest<E>): void {
    this.questManager.addQuest(quest);
  }

  /**
   * Emit a game event to all active quests
   * @param event - Game event to process
   */
  public emitEvent(event: GameEvent<E>): void {
    this.questManager.emit(event);
  }

  /**
   * Get all active quests
   */
  public getQuests(): BaseQuest<E>[] {
    return this.questManager.getQuests();
  }

  /**
   * Generate HTML visualization of all quests
   */
  public toHTML(): string {
    return this.questManager.toHTML();
  }
}