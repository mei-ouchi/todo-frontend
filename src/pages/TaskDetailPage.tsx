import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask } from '../features/tasks/api/queries';
import type{ TaskUpdateFormInputs } from '../features/tasks/schemas/taskSchemas';
import TaskForm from '../components/organisms/TaskForm';
import PageLayout from '../components/templates/PageLayout';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import Button from '../components/atoms/Button';
import type { AxiosError } from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskUpdateSchema } from '../features/tasks/schemas/taskSchemas';

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

  const methods = useForm<TaskUpdateFormInputs>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
      dueDate: '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (task) {
      const formattedDueDate = task.dueDate ? task.dueDate : '';
      reset(
        {
          title: task.title,
          description: task.description || '',
          status: task.status || 'PENDING',
          dueDate: formattedDueDate,
        },
        { keepErrors: false, keepDirty: false, keepIsSubmitted: false, keepTouched: false }
      );
    }
  }, [task, reset]);

  const handleUpdateTask = async (data: TaskUpdateFormInputs) => {
    if (!taskId) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        task: {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          dueDate: data.dueDate || undefined,
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
        <Typography variant="h5" component="h2" gutterBottom sx={{
            backgroundColor: '#c1f1d7ff',
            color: '#000000',
            padding: '8px 16px',
            borderRadius: '4px',
          }}>
          タスク詳細
        </Typography>
        <FormProvider {...methods}>
          <TaskForm onSubmit={handleUpdateTask} onCancel={() => navigate('/')} initialData={task} />
        </FormProvider>
      </Box>
    </PageLayout>
  );
};

export default TaskDetailPage;