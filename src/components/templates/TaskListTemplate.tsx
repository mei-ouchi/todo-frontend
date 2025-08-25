import React from 'react';
import PageLayout from './PageLayout';
import TaskList from '../organisms/TaskList';
import TaskForm from '../organisms/TaskForm';
import { Box, CircularProgress, Alert, Button as MuiButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { TasksDto } from '../../api';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';

interface TaskListTemplateProps {
  tasks: TasksDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isCreating: boolean;
  onOpenCreateForm: () => void;
  onCloseCreateForm: () => void;
  onCreateTask: (data: TaskFormInputs) => void;
  onCompleteTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number) => void;
  showDeleteConfirm: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

const TaskListTemplate: React.FC<TaskListTemplateProps> = ({
  tasks,
  isLoading,
  isError,
  error,
  isCreating,
  onOpenCreateForm,
  onCloseCreateForm,
  onCreateTask,
  onCompleteTask,
  onDeleteTask,
  onEditTask,
  showDeleteConfirm,
  onCancelDelete,
  onConfirmDelete,
}) => {
  return (
    <PageLayout>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
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

          {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
          {isError && <Alert severity="error">タスクの読み込みに失敗しました: {error?.message}</Alert>}
        </Box>
        <Box>
          <Box sx={{ mb: 4 }}>
            {isCreating && (
              <TaskForm
                onSubmit={onCreateTask}
                onCancel={onCloseCreateForm}
              />
            )}

            {!isCreating && tasks && tasks.length > 0 && (
              <TaskList
                tasks={tasks}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            )}
            {!isCreating && tasks && tasks.length === 0 && (
              <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                タスクはありません
              </Typography>
            )}

            {!isCreating && (
              <MuiButton variant="contained" onClick={onOpenCreateForm} sx={{ mb: 2 }}>
                タスクの追加
              </MuiButton>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={showDeleteConfirm}
        onClose={onCancelDelete}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">タスクの削除</DialogTitle>
        <DialogContent>
          <Typography>本当にこのタスクを削除してもよろしいですか？</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onCancelDelete} color="primary" variant="outlined">
            キャンセル
          </MuiButton>
          <MuiButton onClick={onConfirmDelete} color="error" variant="contained" autoFocus>
            削除
          </MuiButton>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default TaskListTemplate;