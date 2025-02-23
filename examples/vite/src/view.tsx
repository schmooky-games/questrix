import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Node, Edge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { QuestController } from '../controllers/QuestController';
import { BaseQuest } from '@questrix/core';

interface QuestViewProps {
  controller: QuestController;
}

export const QuestView: React.FC<QuestViewProps> = ({ controller }) => {
  const [quests, setQuests] = useState<BaseQuest<string>[]>(controller.getQuests());

  const handleDrinkPotion = useCallback(() => {
    controller.drinkPotion();
    setQuests([...controller.getQuests()]); // Trigger re-render with updated state
  }, [controller]);

  const nodes: Node[] = useMemo(() => {
    const nodesArray: Node[] = [];
    let yOffset = 0;

    quests.forEach((quest, questIndex) => {
      // Quest Node
      nodesArray.push({
        id: `quest-${quest.slug}`,
        type: 'input',
        data: { label: `Quest: ${quest.slug}` },
        position: { x: 250, y: yOffset },
        style: { backgroundColor: '#6ede87', borderRadius: 5 },
      });

      yOffset += 100;

      // Task Nodes
      quest.tasks.forEach((task, taskIndex) => {
        const isCompleted = task.isCompleted();
        nodesArray.push({
          id: `task-${quest.slug}-${taskIndex}`,
          data: { label: `Task: ${task['currentProgress']}/${task.maxProgress}` },
          position: { x: 400, y: yOffset },
          style: {
            backgroundColor: isCompleted ? '#6ede87' : '#ff0072',
            borderRadius: 5,
            transition: 'background-color 0.5s ease',
          },
        });
        yOffset += 100;
      });

      yOffset += 50;
    });

    return nodesArray;
  }, [quests]);

  const edges: Edge[] = useMemo(() => {
    const edgesArray: Edge[] = [];
    quests.forEach((quest) => {
      quest.tasks.forEach((_, taskIndex) => {
        const sourceId = taskIndex === 0 ? `quest-${quest.slug}` : `task-${quest.slug}-${taskIndex - 1}`;
        const targetId = `task-${quest.slug}-${taskIndex}`;
        edgesArray.push({
          id: `edge-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          animated: true,
          style: { stroke: '#b1b1b7' },
        });
      });
    });
    return edgesArray;
  }, [quests]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={handleDrinkPotion}
        style={{ padding: '10px', margin: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 5 }}
      >
        Drink Health Potion
      </button>
      <div style={{ flex: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};