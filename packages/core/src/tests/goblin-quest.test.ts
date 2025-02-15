// goblin-quest.test.ts
import { describe, test, expect, beforeEach } from 'vitest';
import { QuestManager } from '..';
import { goblinSlayerQuest, GOBLIN_TYPES } from './goblin-quest';

describe('Goblin Slayer Quest', () => {
  let questManager: QuestManager;
  let questInstance: any;

  beforeEach(() => {
    questManager = new QuestManager();
    questManager.registerTemplate(goblinSlayerQuest);
    questInstance = questManager.createInstance(goblinSlayerQuest.id);
  });

  test('should create a quest instance with correct initial state', () => {
    expect(questInstance).toBeDefined();
    expect(questInstance.templateId).toBe(goblinSlayerQuest.id);
    expect(questInstance.status).toBe('active');
    
    // Check initial progress
    expect(questInstance.progress['kill-regular-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-elite-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-goblin-boss'].current).toBe(0);
  });

  test('should track regular goblin kills', () => {
    // Kill 3 regular goblins
    for (let i = 0; i < 3; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          enemyType: 'regular',
          level: 1,
          location: { x: 100, y: 100, zone: 'goblin_cave' },
          damage: { amount: 50, type: 'physical' }
        }
      });
    }

    expect(questInstance.progress['kill-regular-goblins'].current).toBe(3);
    expect(questInstance.status).toBe('active'); // Quest shouldn't be complete yet
  });

  test('should track elite goblin kills', () => {
    // Kill 2 elite goblins
    for (let i = 0; i < 2; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          enemyType: 'elite',
          level: 5,
          location: { x: 200, y: 200, zone: 'goblin_stronghold' },
          damage: { amount: 100, type: 'physical' }
        }
      });
    }

    expect(questInstance.progress['kill-elite-goblins'].current).toBe(2);
    expect(questInstance.status).toBe('active');
  });

  test('should track goblin boss kill', () => {
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        enemyType: 'boss',
        level: 10,
        location: { x: 300, y: 300, zone: 'goblin_throne' },
        damage: { amount: 500, type: 'physical' }
      }
    });

    expect(questInstance.progress['kill-goblin-boss'].current).toBe(1);
    expect(questInstance.status).toBe('active');
  });

  test('should complete quest when all objectives are met', () => {
    // Kill required regular goblins
    for (let i = 0; i < 10; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          enemyType: 'regular',
          level: 1,
          location: { x: 100, y: 100, zone: 'goblin_cave' },
          damage: { amount: 50, type: 'physical' }
        }
      });
    }

    // Kill required elite goblins
    for (let i = 0; i < 5; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          enemyType: 'elite',
          level: 5,
          location: { x: 200, y: 200, zone: 'goblin_stronghold' },
          damage: { amount: 100, type: 'physical' }
        }
      });
    }

    // Kill the boss
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        enemyType: 'boss',
        level: 10,
        location: { x: 300, y: 300, zone: 'goblin_throne' },
        damage: { amount: 500, type: 'physical' }
      }
    });

    expect(questInstance.progress['kill-regular-goblins'].current).toBe(10);
    expect(questInstance.progress['kill-elite-goblins'].current).toBe(5);
    expect(questInstance.progress['kill-goblin-boss'].current).toBe(1);
    expect(questInstance.status).toBe('completed');
  });

  test('should reset progress on player death', () => {
    // Kill some goblins first
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        enemyType: 'regular',
        level: 1,
        location: { x: 100, y: 100, zone: 'goblin_cave' },
        damage: { amount: 50, type: 'physical' }
      }
    });

    expect(questInstance.progress['kill-regular-goblins'].current).toBe(1);

    // Player dies
    questManager.handleEvent({
      type: 'player-died',
      timestamp: new Date(),
      data: {
        cause: 'goblin_attack',
        location: { x: 100, y: 100, zone: 'goblin_cave' }
      }
    });

    // Check if progress was reset
    expect(questInstance.progress['kill-regular-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-elite-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-goblin-boss'].current).toBe(0);
  });

  test('should not progress for non-goblin kills', () => {
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        enemyType: 'orc',
        level: 5,
        location: { x: 100, y: 100, zone: 'orc_camp' },
        damage: { amount: 100, type: 'physical' }
      }
    });

    expect(questInstance.progress['kill-regular-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-elite-goblins'].current).toBe(0);
    expect(questInstance.progress['kill-goblin-boss'].current).toBe(0);
  });

  test('should not exceed maximum progress values', () => {
    // Try to kill more than required regular goblins
    for (let i = 0; i < 15; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          enemyType: 'regular',
          level: 1,
          location: { x: 100, y: 100, zone: 'goblin_cave' },
          damage: { amount: 50, type: 'physical' }
        }
      });
    }

    expect(questInstance.progress['kill-regular-goblins'].current).toBe(10); // Should not exceed max
  });
});