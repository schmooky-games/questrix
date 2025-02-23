import { Module, DynamicModule } from '@nestjs/common';
import { QuestService } from './quest.service';

/**
 * NestJS module for integrating the Questrix quest system
 * @template E - Event enum type specific to the game
 */
@Module({})
export class QuestModule {
  /**
   * Configure the module with game-specific event types
   * @param eventEnum - Enum of possible game events
   * @returns Dynamic module configuration
   */
  static forRoot<E extends string>(eventEnum: Record<string, E>): DynamicModule {
    return {
      module: QuestModule,
      providers: [
        {
          provide: 'EVENT_ENUM',
          useValue: eventEnum,
        },
        QuestService,
      ],
      exports: [QuestService],
    };
  }
}