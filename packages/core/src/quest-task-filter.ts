import { GameEvent, LogicalOperator } from './types';

/**
 * Filter condition for quests and tasks
 * @template E - Event enum type specific to the game
 */
export class QuestTaskFilter<E extends string> {
  /**
   * @param eventNames - Array of event names this filter applies to
   * @param condition - Function evaluating the event
   * @param subFilters - Optional sub-filters for complex conditions
   * @param operator - Logical operator for combining sub-filters
   */
  constructor(
    private eventNames: E[],
    private condition: (event: GameEvent<E>) => boolean,
    private subFilters: QuestTaskFilter<E>[] = [],
    private operator: LogicalOperator = LogicalOperator.AND
  ) {}

  /**
   * Evaluate if an event passes this filter
   */
  public evaluate(event: GameEvent<E>): boolean {
    if (!this.eventNames.includes(event.name)) {
      return false;
    }

    let baseResult = this.condition(event);

    if (this.subFilters.length === 0) {
      return baseResult;
    }

    switch (this.operator) {
      case LogicalOperator.AND:
        return baseResult && this.subFilters.every(filter => filter.evaluate(event));
      case LogicalOperator.OR:
        return baseResult || this.subFilters.some(filter => filter.evaluate(event));
      case LogicalOperator.NOT:
        return !baseResult;
      default:
        return baseResult;
    }
  }

  /**
   * Generate HTML visualization of the filter
   */
  public toHTML(): string {
    const subFiltersHTML = this.subFilters.length > 0
      ? `<div class="sub-filters" style="margin-left: 20px;">
          <p>${this.operator}</p>
          ${this.subFilters.map(f => f.toHTML()).join('')}
        </div>`
      : '';

    return `
      <div class="filter" style="background: #dfe6e9; padding: 5px;">
        <p>Events: ${this.eventNames.join(', ')}</p>
        ${subFiltersHTML}
      </div>
    `;
  }
}