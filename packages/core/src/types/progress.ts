export type NumericProgress = {
    type: 'numeric';
    current: number;
    min: number;
    max: number;
  };
  
  export type BooleanProgress = {
    type: 'boolean';
    completed: boolean;
  };
  
  export type TaskProgress = NumericProgress | BooleanProgress;