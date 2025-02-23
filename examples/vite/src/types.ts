import { GameEvent } from "@questrix/core";

export enum GameEvents {
  USE_ITEM = 'USE_ITEM',
}

export interface PotionEvent extends GameEvent<GameEvents> {
  name: GameEvents.USE_ITEM;
  item: { type: string };
}
