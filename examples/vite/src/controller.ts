import { QuestModel } from './model';
import { GameEvents } from './types';

export class QuestController {
  constructor(private model: QuestModel) {}

  public drinkPotion(): void {
    this.model.emitEvent({
      name: GameEvents.USE_ITEM,
      item: { type: 'health-potion' },
    });
  }

  public getQuests() {
    return this.model.getQuests();
  }
}