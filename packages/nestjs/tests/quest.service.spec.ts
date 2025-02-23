import { Test } from '@nestjs/testing';
import { QuestService } from '../src/quest.service';
import { QuestModule } from '../src/quest.module';
import { BaseQuest, QuestTask, QuestTaskFilter } from '@questrix/core';

enum TestEvents {
  KILL = 'KILL',
}

describe('QuestService', () => {
  let questService: QuestService<TestEvents>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [QuestModule.forRoot<TestEvents>(TestEvents)],
    }).compile();

    questService = moduleRef.get(QuestService);
  });

  it('should add and process quests', () => {
    const quest = new BaseQuest<TestEvents>(
      'test-quest',
      new QuestTaskFilter<TestEvents>([TestEvents.KILL], () => true),
      [new QuestTask<TestEvents>(1, new QuestTaskFilter<TestEvents>([TestEvents.KILL], () => true))],
    );

    questService.addQuest(quest);
    expect(questService.getQuests()).toHaveLength(1);

    questService.emitEvent({ name: TestEvents.KILL });
    expect(questService.getQuests()[0].isCompleted()).toBe(true);
  });
});