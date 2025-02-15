import { QuestTemplate, QuestInstance, TaskProgress, TaskCondition } from '@questrix/core';

describe('GoblinSlayerQuest', () => {
  let questTemplate: QuestTemplate;
  let questInstance: QuestInstance;
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  beforeEach(() => {
    // Create quest template object implementing QuestTemplate
    questTemplate = {
      id: 'goblin-slayer-quest',
      name: 'Goblin Slayer',
      description: 'Kill 3 normal goblins and 1 elite goblin',
      tasks: [
        {
          id: 'kill-normal-goblins',
          name: 'Kill Normal Goblins',
          description: 'Kill 3 normal goblins',
          progress: {
            type: 'numeric',
            min: 0,
            max: 3,
            current: 0
          },
          conditions: [
            {
              type: 'enemy.killed',
              checker: (event)=>{event.its('target.type').to.be('goblin') && event.its('target.rank').to.be('normal')}
            }
          ]
        },
        {
          id: 'kill-elite-goblin',
          name: 'Kill Elite Goblin',
          description: 'Kill 1 elite goblin',
          progress: {
            type: 'numeric',
            minValue: 0,
            maxValue: 1,
            currentValue: 0
          },
          conditions: [
            {
              event: 'enemy.killed',
              check: "event.its('target.type').to.be('goblin') && event.its('target.rank').to.be('elite')"
            }
          ]
        }
      ]
    };
  });
});