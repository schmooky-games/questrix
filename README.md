# Questrix

![Questrix Logo](https://via.placeholder.com/150.png?text=Questrix) <!-- Replace with actual logo if available -->
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@questrix/core.svg)](https://www.npmjs.com/package/@questrix/core)
[![Build Status](https://github.com/schmooky-games/questrix/workflows/CI/badge.svg)](https://github.com/schmooky-games/questrix/actions)

**Questrix** is a TypeScript-first, opinionated quest system library designed for RPG games, inspired by the gritty, task-driven quests of *Escape From Tarkov*. It provides a robust, extensible framework for managing quests, tasks, and event-driven progress tracking, with a focus on simplicity, type safety, and developer experience.

Whether you're building a fantasy RPG with goblins and fireballs or a survival game with complex objectives, Questrix empowers game designers to craft immersive quests while keeping the code clean and maintainable.

## Table of Contents
- [Features](#features)
- [Principles](#principles)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Examples](#examples)
- [Visualization](#visualization)
- [Opinionated Design](#opinionated-design)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Type-Safe Events**: Define strict event enums and leverage TypeScript generics for compile-time safety.
- **Flexible Filters**: Chainable task filters with logical operators (AND, OR, NOT) for complex conditions.
- **Visualization**: Built-in HTML flowcharts for quest debugging and design (WIP: Animated React Flow integration in demo).
- **Modular Architecture**: Core logic in `@questrix/core`, with integrations like `@questrix/nestjs` for NestJS apps.
- **Tested**: Comprehensive Vitest suite with fantasy RPG examples (goblins, swords, potions).
- **Extensible**: Easily integrate with any game engine or framework.

## Principles
Questrix is built on a few core principles:
1. **Simplicity Over Flexibility**: We prioritize a clear, predictable API over excessive configurability. Quests should be easy to define and reason about.
2. **Type Safety**: Leverage TypeScript to catch errors at compile time, not runtime.
3. **Game Designer Friendly**: Filters are designed to be intuitive for non-programmers while remaining powerful.
4. **Event-Driven**: Everything revolves around events—kills, item uses, or custom triggers—making it a natural fit for game loops.
5. **Visual Debugging**: See your quests in action with built-in visualization tools.

## Getting Started
### Prerequisites
- Node.js 20+
- TypeScript 5+

### Installation
Install `@questrix/core` from GitHub (npm package coming soon!):
```bash
npm install git+https://github.com/schmooky-games/questrix.git#main#packages/core
```

### Quick Setup
Create a simple quest system:
```typescript
import { BaseQuest, QuestManager, QuestTask, QuestTaskFilter } from '@questrix/core';

enum GameEvents {
  USE_ITEM = 'USE_ITEM',
}

interface PotionEvent {
  name: GameEvents.USE_ITEM;
  item: { type: string };
}

const manager = new QuestManager<GameEvents>();
const potionQuest = new BaseQuest<GameEvents>(
  'use-potion',
  new QuestTaskFilter([GameEvents.USE_ITEM], () => true),
  [
    new QuestTask(
      2,
      new QuestTaskFilter([GameEvents.USE_ITEM], (e) => (e as PotionEvent).item.type === 'health-potion')
    ),
  ]
);

manager.addQuest(potionQuest);
manager.emit({ name: GameEvents.USE_ITEM, item: { type: 'health-potion' } });
console.log(manager.toHTML()); // Visualize quest progress
```

### Usage

#### Defining Quests
Quests are built from BaseQuest, with tasks and filters:
```typescript
const goblinQuest = new BaseQuest<GameEvents>(
  'slay-goblins',
  new QuestTaskFilter([GameEvents.KILL], () => true),
  [
    new QuestTask(
      3,
      new QuestTaskFilter([GameEvents.KILL], (e) => e.target === 'goblin')
    ),
  ]
);
```

#### Emitting Events
Drive progress with game events:
```typescript
manager.emit({ name: GameEvents.KILL, target: 'goblin' });
```

#### Checking Progress
```typescript
console.log(goblinQuest.isCompleted()); // true after 3 goblin kills
```

### Examples
Check out the demo app for a Vite + TypeScript setup with React Flow visualization:

**Quest:** Use 2 health potions
**Interaction:** Click a button to emit an event
**Visualization:** Animated flow showing event propagation and task completion
Run it:
```bash
cd examples/vite-vanilla-ts
npm install
npm run dev
```
The demo app enhances this with React Flow for animated, interactive diagrams.

### Visualization
Questrix includes a simple HTML visualization:
```typescript
console.log(manager.toHTML());
```
Output:

```html
<div class="quest">
  <h3>use-potion</h3>
  <div class="tasks">
    <div class="task">
      <p>Progress: 1/2</p>
      <div class="filter">
        <p>Events: USE_ITEM</p>
      </div>
    </div>
  </div>
</div>
```

### Opinionated Design
Questrix makes deliberate choices:

- **Sequential Event Processing:** Events are processed one quest at a time for predictable outcomes.
- **No Over-Configurability:** We avoid a sprawling API in favor of a focused, intuitive one.
- **Type-Driven:** Generics enforce event type consistency, reducing runtime errors.
- **Built for RPGs:** Inspired by Escape From Tarkov, it’s optimized for task-based progression.
Why this way? We believe quests should be a joy to **design** **and** **debug**, not a source of complexity. By baking in best practices, we free you to focus on gameplay.

### Contributing
We’d love your help! See CONTRIBUTING.md for guidelines.

- Fork the repo
- Create a feature branch (git checkout -b feature/awesome-quest)
- Commit changes (git commit -m "Add awesome quest feature")
- Push (git push origin feature/awesome-quest)
- Open a PR
Run tests:

```bash
cd packages/core
npm install
npm run test
```

### License
Questrix is licensed under the MIT License. Build awesome games with it!
