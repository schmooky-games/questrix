import { QuestTaskFilter } from './quest-task-filter';

/**
 * Individual task within a quest
 * @template E - Event enum type specific to the game
 */
export class QuestTask<E extends string> {
  private currentProgress: number = 0;
  private filter: QuestTaskFilter<E>;

  /**
   * @param maxProgress - Required progress to complete the task
   * @param filter - Filter determining when to increment progress
   */
  constructor(public readonly maxProgress: number, filter: QuestTaskFilter<E>) {
    this.filter = filter;
  }

  /**
   * Process an incoming game event
   */
  public processEvent(event: GameEvent<E>): void {
    if (this.isCompleted() || !this.filter.evaluate(event)) {
      return;
    }
    this.currentProgress++;
  }

  /**
   * Check if task is completed
   */
  public isCompleted(): boolean {
    return this.currentProgress >= this.maxProgress;
  }

  /**
   * Generate HTML visualization of the task
   */
  public toHTML(): string {
    return `
      <div class="task" style="background: #ecf0f1; padding: 5px; margin: 5px;">
        <p>Progress: ${this.currentProgress}/${this.maxProgress}</p>
        ${this.filter.toHTML()}
      </div>
    `;
  }
}