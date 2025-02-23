// tests/quest-system.test.ts
import { describe, it, expect } from 'vitest';
import { BaseQuest, QuestManager, QuestTask, QuestTaskFilter, LogicalOperator } from '../src';

// Example game-specific types and enums
enum FantasyEvents {
  KILL = 'KILL',
  USE_ITEM = 'USE_ITEM',
  CAST_SPELL = 'CAST_SPELL'
}

enum Race {
  HUMAN = 'HUMAN',
  GOBLIN = 'GOBLIN',
  ELF = 'ELF'
}

enum WeaponType {
  SWORD = 'SWORD',
  BOW = 'BOW',
  STAFF = 'STAFF'
}

enum SpellType {
  FIREBALL = 'FIREBALL',
  HEAL = 'HEAL'
}

interface FantasyEvent {
  name: FantasyEvents;
  target?: { race: Race };
  weapon?: { type: WeaponType };
  spell?: { type: SpellType };
  item?: { type: string };
}

describe('Quest System', () => {
  it('handles goblin slayer quest', () => {
    // Game designer wants a quest to kill 3 goblins with a sword
    const goblinFilter = new QuestTaskFilter<FantasyEvents>(
      [FantasyEvents.KILL],
      (event) => event.target?.race === Race.GOBLIN && event.weapon?.type === WeaponType.SWORD
    );

    const quest = new BaseQuest<FantasyEvents>(
      'slay-goblins',
      new QuestTaskFilter<FantasyEvents>([FantasyEvents.KILL], () => true), // Quest-level filter
      [new QuestTask<FantasyEvents>(3, goblinFilter)]
    );

    const manager = new QuestManager<FantasyEvents>();
    manager.addQuest(quest);

    // Simulate events
    manager.emit({ name: FantasyEvents.KILL, target: { race: Race.GOBLIN }, weapon: { type: WeaponType.SWORD } });
    manager.emit({ name: FantasyEvents.KILL, target: { race: Race.ELF }, weapon: { type: WeaponType.SWORD } }); // Should not count
    manager.emit({ name: FantasyEvents.KILL, target: { race: Race.GOBLIN }, weapon: { type: WeaponType.SWORD } });

    expect(quest.tasks[0].isCompleted()).toBe(false);
    manager.emit({ name: FantasyEvents.KILL, target: { race: Race.GOBLIN }, weapon: { type: WeaponType.SWORD } });
    expect(quest.isCompleted()).toBe(true);
  });

  it('handles complex fireball quest with AND conditions', () => {
    // Game designer wants a quest to cast 2 fireballs on goblins
    const fireballFilter = new QuestTaskFilter<FantasyEvents>(
      [FantasyEvents.CAST_SPELL],
      (event) => event.spell?.type === SpellType.FIREBALL,
      [
        new QuestTaskFilter<FantasyEvents>(
          [FantasyEvents.CAST_SPELL],
          (event) => event.target?.race === Race.GOBLIN
        )
      ],
      LogicalOperator.AND
    );

    const quest = new BaseQuest<FantasyEvents>(
      'fireball-goblins',
      new QuestTaskFilter<FantasyEvents>([FantasyEvents.CAST_SPELL], () => true),
      [new QuestTask<FantasyEvents>(2, fireballFilter)]
    );

    const manager = new QuestManager<FantasyEvents>();
    manager.addQuest(quest);

    manager.emit({ name: FantasyEvents.CAST_SPELL, spell: { type: SpellType.FIREBALL }, target: { race: Race.ELF } }); // Wrong target
    manager.emit({ name: FantasyEvents.CAST_SPELL, spell: { type: SpellType.FIREBALL }, target: { race: Race.GOBLIN } });
    expect(quest.tasks[0].isCompleted()).toBe(false);
    manager.emit({ name: FantasyEvents.CAST_SPELL, spell: { type: SpellType.FIREBALL }, target: { race: Race.GOBLIN } });
    expect(quest.isCompleted()).toBe(true);
  });

  it('handles item use quest with OR conditions', () => {
    // Game designer wants a quest to use either healing potion or mana potion 2 times
    const itemFilter = new QuestTaskFilter<FantasyEvents>(
      [FantasyEvents.USE_ITEM],
      (event) => event.item?.type === 'healing-potion',
      [
        new QuestTaskFilter<FantasyEvents>(
          [FantasyEvents.USE_ITEM],
          (event) => event.item?.type === 'mana-potion'
        )
      ],
      LogicalOperator.OR
    );

    const quest = new BaseQuest<FantasyEvents>(
      'use-potions',
      new QuestTaskFilter<FantasyEvents>([FantasyEvents.USE_ITEM], () => true),
      [new QuestTask<FantasyEvents>(2, itemFilter)]
    );

    const manager = new QuestManager<FantasyEvents>();
    manager.addQuest(quest);

    manager.emit({ name: FantasyEvents.USE_ITEM, item: { type: 'healing-potion' } });
    manager.emit({ name: FantasyEvents.USE_ITEM, item: { type: 'mana-potion' } });
    expect(quest.isCompleted()).toBe(true);
  });
});