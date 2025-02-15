import { QuestCondition, QuestEvent, QuestInstance, QuestTemplate, TaskProgress } from "../types";
import { QuestEventEmitter } from "./quest-event-emitter";

export class QuestManager {
    private templates: Map<string, QuestTemplate> = new Map();
    private instances: Map<string, QuestInstance> = new Map();
    private eventEmitter: QuestEventEmitter;
  
    constructor(eventEmitter?: QuestEventEmitter) {
      this.eventEmitter = eventEmitter || new QuestEventEmitter();
    }
  
    // Template Management
    registerTemplate(template: QuestTemplate): void {
      this.templates.set(template.id, template);
    }
  
    // Instance Management
    createInstance(templateId: string): QuestInstance {
      const template = this.templates.get(templateId);
      if (!template) throw new Error('Template not found');
  
      const instance: QuestInstance = {
        id: 'cuid-generated', // Use actual cuidv2 here
        templateId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: this.initializeProgress(template),
      };
  
      this.instances.set(instance.id, instance);
      return instance;
    }
  
    // Progress Tracking
    private initializeProgress(template: QuestTemplate): Record<string, TaskProgress> {
      return template.tasks.reduce((acc, task) => {
        acc[task.id] = { ...task.progress };
        return acc;
      }, {} as Record<string, TaskProgress>);
    }
  
    // Event Handling
    handleEvent<T>(event: QuestEvent<T>): void {
      this.instances.forEach(instance => {
        if (this.isInstanceValid(instance)) {
          this.processEvent(instance, event);
        }
      });
    }
  
    private isInstanceValid(instance: QuestInstance): boolean {
      if (!instance.validUntil) return true;
      return instance.validUntil > new Date();
    }
  
    private processEvent<T>(instance: QuestInstance, event: QuestEvent<T>): void {
      const template = this.templates.get(instance.templateId);
      if (!template) return;
  
      // Process reset conditions
      this.processResetConditions(instance, template, event);
  
      // Process task conditions
      this.processTaskConditions(instance, template, event);
    }
  
    private processResetConditions<T>(
      instance: QuestInstance,
      template: QuestTemplate,
      event: QuestEvent<T>
    ): void {
      template.resetConditions.forEach(condition => {
        if (
          condition.event === event.type &&
          condition.checker.its('data').to.be(event.data)
        ) {
          this.resetInstance(instance);
        }
      });
    }
  
    private processTaskConditions<T>(
      instance: QuestInstance,
      template: QuestTemplate,
      event: QuestEvent<T>
    ): void {
      template.tasks.forEach(task => {
        task.conditions.forEach(condition => {
          if (this.checkCondition(condition, event)) {
            this.updateTaskProgress(instance, task.id, event);
          }
        });
      });
    }
  
    private checkCondition<T>(condition: QuestCondition, event: QuestEvent<T>): boolean {
      return condition.checker.its('type').to.be(event.type);
    }
  
    private updateTaskProgress<T>(
      instance: QuestInstance,
      taskId: string,
      event: QuestEvent<T>
    ): void {
      const progress = instance.progress[taskId];
      if (progress.type === 'numeric') {
        progress.current = Math.min(progress.current + 1, progress.max);
      } else {
        progress.completed = true;
      }
      
      instance.updatedAt = new Date();
      this.checkQuestCompletion(instance);
    }
  
    private checkQuestCompletion(instance: QuestInstance): void {
      const allTasksCompleted = Object.values(instance.progress).every(progress => {
        if (progress.type === 'numeric') {
          return progress.current >= progress.max;
        }
        return progress.completed;
      });
  
      if (allTasksCompleted) {
        instance.status = 'completed';
      }
    }
  
    private resetInstance(instance: QuestInstance): void {
      const template = this.templates.get(instance.templateId);
      if (!template) return;
  
      instance.progress = this.initializeProgress(template);
      instance.updatedAt = new Date();
    }
  }