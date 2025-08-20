import React from 'react';
import PageLayout from './PageLayout';
import TaskForm from '../organisms/TaskForm';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import Button from '../atoms/Button';
import type { TasksDto } from '../../api';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';

interface TaskDetailTemplateProps {
  task: TasksDto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onUpdateTask: (data: TaskFormInputs) => void;
  onCancelEdit: () => void;
}

const TaskDetailTemplate: React.FC<TaskDetailTemplateProps> = ({
  task,
  isLoading,
  isError,
  error,
  onUpdateTask,
  onCancelEdit,
}) => {
  if (isLoading) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">タスクの読み込みに失敗しました: {error?.message}</Alert>
          <Button label="一覧に戻る" variant="outlined" onClick={onCancelEdit} sx={{ mt: 2 }} />
        </Box>
      </PageLayout>
    );
  }

  if (!task) {
    return (
      <PageLayout>
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">指定されたタスクは見つかりませんでした。</Alert>
          <Button label="一覧に戻る" variant="outlined" onClick={onCancelEdit} sx={{ mt: 2 }} />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{
            backgroundColor: '#c1f1d7ff',
            color: '#000000',
            padding: '8px 16px',
            borderRadius: '4px',
          }}>
          タスク詳細
        </Typography>
        <TaskForm initialData={task} onSubmit={onUpdateTask} onCancel={onCancelEdit} />
      </Box>
    </PageLayout>
  );
};

export default TaskDetailTemplate;