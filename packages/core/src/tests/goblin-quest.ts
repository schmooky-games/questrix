import { QuestTemplate, QuestChecker } from '..';

export const GOBLIN_TYPES = ['regular', 'elite', 'boss'] as const;
type GoblinType = typeof GOBLIN_TYPES[number];

interface GoblinKillEvent {
  type: 'enemy-killed';
  timestamp: Date;
  data: {
    enemyType: string;
    level: number;
    location: {
      x: number;
      y: number;
      zone: string;
    };
    damage: {
      amount: number;
      type: string;
    };
  };
}

export const goblinSlayerQuest: QuestTemplate = {
  id: 'goblin-slayer-quest-001',
  name: 'Goblin Slayer Initiation',
  description: 'Prove yourself worthy of the Goblin Slayer title by eliminating various types of goblins',
  createdAt: new Date(),
  updatedAt: new Date(),
  tasks: [
    {
      id: 'kill-regular-goblins',
      name: 'Regular Goblin Hunt',
      description: 'Kill 10 regular goblins',
      progress: {
        type: 'numeric',
        current: 0,
        min: 0,
        max: 10,
      },
      conditions: [
        {
          type: 'enemy-killed',
          checker: new QuestChecker({
            its: (path: string) => ({
              to: {
                be: (value: any) => 
                  path === 'data.enemyType' && 
                  value === 'regular'
              },
            }),
          }),
        },
      ],
    },
    {
      id: 'kill-elite-goblins',
      name: 'Elite Goblin Hunt',
      description: 'Kill 5 elite goblins',
      progress: {
        type: 'numeric',
        current: 0,
        min: 0,
        max: 5,
      },
      conditions: [
        {
          type: 'enemy-killed',
          checker: new QuestChecker({
            its: (path: string) => ({
              to: {
                be: (value: any) => 
                  path === 'data.enemyType' && 
                  value === 'elite'
              },
            }),
          }),
        },
      ],
    },
    {
      id: 'kill-goblin-boss',
      name: 'Goblin Boss Hunt',
      description: 'Kill 1 goblin boss',
      progress: {
        type: 'numeric',
        current: 0,
        min: 0,
        max: 1,
      },
      conditions: [
        {
          type: 'enemy-killed',
          checker: new QuestChecker({
            its: (path: string) => ({
              to: {
                be: (value: any) => 
                  path === 'data.enemyType' && 
                  value === 'boss'
              },
            }),
          }),
        },
      ],
    },
  ],
  resetConditions: [
    {
      event: 'player-died',
      checker: new QuestChecker({
        its: (path: string) => ({
          to: {
            be: (value: any) => true, // Reset on any player death
          },
        }),
      }),
    },
  ],
};