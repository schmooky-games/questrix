import { Module } from '@nestjs/common';
import { QuestrixService } from './questrix.service';
import { QuestrixController } from './questrix.controller';

@Module({
  providers: [QuestrixService],
  controllers: [QuestrixController],
  exports: [QuestrixService],
})
export class QuestrixModule {}

// questrix.service.ts
import { Injectable } from '@nestjs/common';
import { QuestManager } from 'questrix';

@Injectable()
export class QuestrixService {
  private questManager: QuestManager;

  constructor() {
    this.questManager = new QuestManager();
  }

  // Expose QuestManager methods through the service
}

// questrix.controller.ts
import { Controller } from '@nestjs/common';
import { QuestrixService } from './questrix.service';

@Controller('quests')
export class QuestrixController {
  constructor(private readonly questrixService: QuestrixService) {}

  // Define REST endpoints
}