import { QuestEvent } from '../types';

export class QuestEventEmitter<T extends QuestEvent = QuestEvent> {
  private listeners: Map<string, Array<(event: T) => void>> = new Map();

  on(eventType: string, listener: (event: T) => void): void {
    const listeners = this.listeners.get(eventType) || [];
    listeners.push(listener);
    this.listeners.set(eventType, listeners);
  }

  emit(event: T): void {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach(listener => listener(event));
  }
}