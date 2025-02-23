import React from 'react';
import { QuestModel } from './model';
import { QuestController } from './controller';
import { QuestView } from './view';

const model = new QuestModel();
const controller = new QuestController(model);

export const App: React.FC = () => {
  return <QuestView controller={controller} />;
};