import { BaseQuest, QuestManager, QuestTask, QuestTaskFilter, GameEvent } from '@questrix/core';

enum GameEvents {
  USE_ITEM = 'USE_ITEM',
}

interface PotionEvent extends GameEvent<GameEvents> {
  name: GameEvents.USE_ITEM;
  item: { type: string };
}

type QuestEvent = PotionEvent | GameEvent<GameEvents>;

export class QuestModel {
  private questManager: QuestManager<GameEvents>;

  constructor() {
    this.questManager = new QuestManager<GameEvents>();
    this.initializeQuests();
  }

  private initializeQuests() {
    const potionQuest = new BaseQuest<GameEvents>(
      'use-potion',
      new QuestTaskFilter<GameEvents>([GameEvents.USE_ITEM], () => true),
      [
        new QuestTask<GameEvents>(
          2,
          new QuestTaskFilter<GameEvents>(
            [GameEvents.USE_ITEM],
            (event: GameEvent<GameEvents>) => {
              const potionEvent = event as PotionEvent;
              return potionEvent.item?.type === 'health-potion' || false;
            }
          )
        ),
      ]
    );
    this.questManager.addQuest(potionQuest);
  }

  public emitEvent(event: QuestEvent): void {
    this.questManager.emit(event);
  }

  public getQuests(): BaseQuest<GameEvents>[] {
    return this.questManager.getQuests();
  }
}