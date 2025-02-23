import { QuestTask } from './quest-task';
import { QuestTaskFilter } from './quest-task-filter';

/**
 * Base class for all quests in the game
 * @template E - Event enum type specific to the game
 */
export class BaseQuest<E extends string> {
  /**
   * Unique identifier for the quest
   */
  public readonly slug: string;

  /**
   * Array of tasks required to complete the quest
   */
  public readonly tasks: QuestTask<E>[];

  /**
   * Filter determining which events should be processed by this quest
   */
  private eventFilter: QuestTaskFilter<E>;

  /**
   * @param slug - Unique quest identifier
   * @param eventFilter - Filter for quest-relevant events
   * @param tasks - Array of quest tasks
   */
  constructor(slug: string, eventFilter: QuestTaskFilter<E>, tasks: QuestTask<E>[]) {
    this.slug = slug;
    this.eventFilter = eventFilter;
    this.tasks = tasks;
  }

  /**
   * Process an incoming game event
   * @param event - Game event to process
   * @returns Whether the event was relevant to this quest
   */
  public processEvent(event: GameEvent<E>): boolean {
    if (!this.eventFilter.evaluate(event)) {
      return false;
    }

    this.tasks.forEach(task => task.processEvent(event));
    return true;
  }

  /**
   * Check if quest is completed
   */
  public isCompleted(): boolean {
    return this.tasks.every(task => task.isCompleted());
  }

  /**
   * Generate HTML visualization of the quest structure
   */
  public toHTML(): string {
    return `
      <div class="quest" style="background: #f0f0f0; padding: 10px; margin: 5px;">
        <h3 style="color: #2c3e50;">${this.slug}</h3>
        ${this.eventFilter.toHTML()}
        <div class="tasks" style="margin-left: 20px;">
          ${this.tasks.map(task => task.toHTML()).join('')}
        </div>
      </div>
    `;
  }
}