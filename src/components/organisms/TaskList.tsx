import React from 'react';
import { List, Typography } from '@mui/material';
import TaskCard from '../molecules/TaskCard';
import type{ TasksDto } from '../../api';

interface TaskListProps {
  tasks: TasksDto[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onDelete, onEdit }) => {
  if (!tasks || tasks.length === 0) {
    return <Typography variant="h6">タスクはありません</Typography>;
  }

  return (
    <List>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </List>
  );
};

export default TaskList;