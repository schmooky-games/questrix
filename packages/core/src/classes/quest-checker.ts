import { QuestCheckerChain } from './quest-checker-chain';

export class QuestChecker {
  private context: any;

  constructor(context: any) {
    this.context = context;
  }

  its(path: string): QuestCheckerChain {
    return new QuestCheckerChain(this.context, path);
  }
}