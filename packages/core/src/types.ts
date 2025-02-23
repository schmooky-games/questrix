/**
 * Represents possible event types in the game
 * @template T - Custom event enum provided by the game developer
 */
export type GameEvent<T extends string> = {
    name: T;
    [key: string]: any;
  };
  
  /**
   * Logical operators for filter conditions
   */
  export enum LogicalOperator {
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT'
  }