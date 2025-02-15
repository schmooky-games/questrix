import { QuestManager, QuestTemplate, QuestChecker, NumericProgress } from '@questrix/core'; // Adjust import path

describe('Scav Kill Quest', () => {
  let questManager: QuestManager;
  let killScavsQuest: QuestTemplate;

  beforeEach(() => {
    // Setup fresh quest template and manager before each test
    killScavsQuest = {
      id: 'kill-scavs-quest',
      name: 'Scav Hunter',
      description: 'Kill 10 scavs in one raid',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: 'kill-scavs',
          name: 'Kill Scavs',
          description: 'Kill 10 scavs',
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
                    be: (value: any) => path === 'target.type' && value === 'scav',
                  },
                }),
              }),
            },
          ],
        },
      ],
      resetConditions: [
        {
          event: 'raid-ended',
          checker: new QuestChecker({
            its: (path: string) => ({
              to: {
                be: (value: any) => true,
              },
            }),
          }),
        },
      ],
    };

    questManager = new QuestManager();
    questManager.registerTemplate(killScavsQuest);
  });

  test('should register quest template successfully', () => {
    expect(questManager.getTemplate('kill-scavs-quest')).toBeDefined();
    expect(questManager.getTemplate('kill-scavs-quest')).toEqual(killScavsQuest);
  });

  test('should create quest instance correctly', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    expect(instance).toBeDefined();
    expect(instance.id).toBe('kill-scavs-quest');
    expect((instance.progress[0] as NumericProgress).current).toBe(0);
  });

  test('should increment progress when killing a scav', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        target: {
          type: 'scav',
          location: { x: 100, y: 200 },
        },
      },
    });

    expect((instance.progress[0] as NumericProgress).current).toBe(1);
  });

  test('should not increment progress when killing non-scav enemy', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        target: {
          type: 'pmc', // Different enemy type
          location: { x: 100, y: 200 },
        },
      },
    });

    expect((instance.progress[0] as NumericProgress).current).toBe(0);
  });

  test('should complete quest after killing 10 scavs', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    // Simulate killing 10 scavs
    for (let i = 0; i < 10; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          target: {
            type: 'scav',
            location: { x: 100, y: 200 },
          },
        },
      });
    }

    expect((instance.progress[0] as NumericProgress).current).toBe(10);
    expect(instance.status === 'completed').toBe(true);
  });

  test('should reset progress when raid ends', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    // Kill some scavs first
    questManager.handleEvent({
      type: 'enemy-killed',
      timestamp: new Date(),
      data: {
        target: {
          type: 'scav',
          location: { x: 100, y: 200 },
        },
      },
    });

    expect((instance.progress[0] as NumericProgress).current).toBe(1);

    // End the raid
    questManager.handleEvent({
      type: 'raid-ended',
      timestamp: new Date(),
      data: {},
    });

    expect((instance.progress[0] as NumericProgress).current).toBe(0);
  });

  test('should not exceed maximum progress', () => {
    const instance = questManager.createInstance('kill-scavs-quest');
    
    // Simulate killing 12 scavs (more than required)
    for (let i = 0; i < 12; i++) {
      questManager.handleEvent({
        type: 'enemy-killed',
        timestamp: new Date(),
        data: {
          target: {
            type: 'scav',
            location: { x: 100, y: 200 },
          },
        },
      });
    }

    expect((instance.progress[0] as NumericProgress).current).toBe(10);
  });
});