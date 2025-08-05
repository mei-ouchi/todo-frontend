import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask } from '../features/tasks/api/queries';
import type{ TaskFormInputs } from '../features/tasks/schemas/taskSchemas';
import TaskForm from '../components/organisms/TaskForm';
import PageLayout from '../components/templates/PageLayout';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import Button from '../components/atoms/Button';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();

  const { data: task, isLoading, isError, error } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();

  const getErrorMessage = (e: unknown): string => {
    const axiosError = e as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message || axiosError.message || '不明なエラーが発生しました。';
  }

  const handleUpdateTask = async (data: TaskFormInputs) => {
    if (!taskId) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        task: {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : undefined,
        },
      });
      navigate('/');
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの更新に失敗しました:', errorMessage);
      alert(`タスクの更新に失敗しました: ${errorMessage}`);
    }
  };

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
          <Button label="一覧に戻る" variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }} />
        </Box>
      </PageLayout>
    );
  }

  if (!task) {
    return (
      <PageLayout>
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">指定されたタスクは見つかりませんでした。</Alert>
          <Button label="一覧に戻る" variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }} />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          タスク詳細 / 編集
        </Typography>
        <TaskForm initialData={task} onSubmit={handleUpdateTask} onCancel={() => navigate('/')} />
      </Box>
    </PageLayout>
  );
};

export default TaskDetailPage;