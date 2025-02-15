export class QuestCheckerChain {
    private value: any;
  
    constructor(context: any, path: string) {
      this.value = this.getValueByPath(context, path);
    }
  
    private getValueByPath(obj: any, path: string): any {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
  
    to = {
      be: (expected: any) => this.value === expected,
      equal: (expected: any) => this.value === expected,
      greaterThan: (expected: number) => this.value > expected,
      lessThan: (expected: number) => this.value < expected,
    };
  }
  