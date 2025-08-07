import React, { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, } from '../features/tasks/api/queries';
import { TasksDtoStatusEnum } from '../api';
import type { TaskFormInputs } from '../features/tasks/schemas/taskSchemas';
import TaskList from '../components/organisms/TaskList';
import TaskForm from '../components/organisms/TaskForm';
import PageLayout from '../components/templates/PageLayout';
import { Box, CircularProgress, Alert, Button as MuiButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: tasks, isLoading, isError, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);
  const getErrorMessage = (e: unknown): string => {
    const axiosError = e as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message || axiosError.message || '不明なエラーが発生しました。';
  };

  // 新規タスク作成
  const handleCreateTask = async (data: TaskFormInputs) => {
    try {
      await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : undefined,
      });
      setIsCreating(false);
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの作成に失敗しました:', errorMessage);
      alert(`タスクの作成に失敗しました: ${errorMessage}`);
    }
  };

  // タスク完了
  const handleCompleteTask = async (id: number) => {
    const taskToComplete = tasks?.find((task) => task.id === id);
    if (!taskToComplete) return;

    try {
      await updateTaskMutation.mutateAsync({
        id,
        task: {
          title: taskToComplete.title,
          description: taskToComplete.description || undefined,
          status: TasksDtoStatusEnum.Completed,
          dueDate: taskToComplete.dueDate ? new Date(taskToComplete.dueDate).toISOString().split('T')[0] : undefined,
        },
      });
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの完了に失敗しました:', errorMessage);
      alert(`タスクの完了に失敗しました: ${errorMessage}`);
    }
  };

  // タスク削除確認の開始
  const handleDeleteTask = (id: number) => {
    setTaskToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // 削除確認で削除
  const handleConfirmDelete = async () => {
    if (taskToDeleteId === null) return;
    try {
      await deleteTaskMutation.mutateAsync(taskToDeleteId);
      setShowDeleteConfirm(false);
      setTaskToDeleteId(null);
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの削除に失敗しました:', errorMessage);
      alert(`タスクの削除に失敗しました: ${errorMessage}`);
    }
  };

  // 削除確認でキャンセル
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDeleteId(null);
  };

  // タスク編集
  const handleEditTask = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <PageLayout>
      <Box sx={{ my: 4 }}>
        {!isCreating && (
          <Typography variant="h5" component="h2" gutterBottom sx={{
            backgroundColor: '#c1f1d7ff',
            color: '#000000',
            padding: '8px 16px',
            borderRadius: '4px',
          }}>
            タスク一覧
          </Typography>
        )}

        {/* ローディング表示 */}
        {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
        {/* エラー表示 */}
        {isError && <Alert severity="error">タスクの読み込みに失敗しました: {error?.message}</Alert>}

        <Box sx={{ mb: 4 }}>

          {/* 新規作成フォーム表示 */}
          {isCreating && (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsCreating(false)}
            />
          )}

          {/* タスクリスト表示（フォーム非表示時かつタスクデータがある場合） */}
          {!isCreating && tasks && tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          )}
          {/* タスクが一つもない場合のメッセージ */}
          {!isCreating && tasks && tasks.length === 0 && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              タスクはありません
            </Typography>
          )}

          {/* 新規タスク追加ボタン（フォーム非表示時のみ） */}
          {!isCreating && (
            <MuiButton variant="contained" onClick={() => setIsCreating(true)} sx={{ mb: 2 }}>
              タスクの追加
            </MuiButton>
          )}
        </Box>
      </Box>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={showDeleteConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">タスクの削除</DialogTitle>
        <DialogContent>
          <Typography>本当にこのタスクを削除してもよろしいですか？</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCancelDelete} color="primary" variant="outlined">
            キャンセル
          </MuiButton>
          <MuiButton onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            削除
          </MuiButton>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default TaskListPage;
