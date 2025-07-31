import React from 'react';
import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TasksDtoStatusEnum } from '../../api';
import type{ TasksDto } from '../../api';

interface TaskCardProps {
  task: TasksDto;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onEdit }) => {
  const isCompleted = task.status === TasksDtoStatusEnum.Completed;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate ? dueDate < today && !isCompleted : false;

  return (
    <Card
      sx={{
        marginBottom: '16px',
        backgroundColor: isCompleted ? '#e0e0e0' : (isOverdue ? '#ffe0b2' : 'inherit'),
        opacity: isCompleted ? 0.8 : 1,
        border: isOverdue ? '1px solid orange' : 'none',
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" sx={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {task.description}
          </Typography>
        )}
        {task.dueDate && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            期限: {task.dueDate}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          状態: {task.status === TasksDtoStatusEnum.Pending ? '未完了' : '完了'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {!isCompleted && (
          <IconButton aria-label="complete" onClick={() => onComplete(task.id!)}>
            <CheckIcon />
          </IconButton>
        )}
        <IconButton aria-label="edit" onClick={() => onEdit(task.id!)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(task.id!)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;