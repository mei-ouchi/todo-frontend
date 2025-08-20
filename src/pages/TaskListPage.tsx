import React, { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, } from '../features/tasks/hooks/useTask';
import { TasksDtoStatusEnum } from '../api';
import type { TaskFormInputs } from '../features/tasks/schemas/taskSchemas';
import TaskListTemplate from '../components/templates/TaskListTemplate';
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

  //タスクの新規作成
  const handleCreateTask = async (data: TaskFormInputs) => {
    try {
      await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        dueDate: data.dueDate ? data.dueDate : undefined,
      });
      setIsCreating(false);
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの作成に失敗しました:', errorMessage);
      alert(`タスクの作成に失敗しました: ${errorMessage}`);
    }
  };

  //タスクの完了
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
          dueDate: taskToComplete.dueDate ? taskToComplete.dueDate : undefined,
        },
      });
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの完了に失敗しました:', errorMessage);
      alert(`タスクの完了に失敗しました: ${errorMessage}`);
    }
  };

  //タスクの削除確認
  const handleDeleteTask = (id: number) => {
    setTaskToDeleteId(id);
    setShowDeleteConfirm(true);
  };
  //削除確認で削除
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
  //削除確認でキャンセル
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDeleteId(null);
  };

  //タスクの編集
  const handleEditTask = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <TaskListTemplate
      tasks={tasks}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isCreating={isCreating}
      onOpenCreateForm={() => setIsCreating(true)}
      onCloseCreateForm={() => setIsCreating(false)}
      onCreateTask={handleCreateTask}
      onCompleteTask={handleCompleteTask}
      onDeleteTask={handleDeleteTask}
      onEditTask={handleEditTask}
      showDeleteConfirm={showDeleteConfirm}
      onCancelDelete={handleCancelDelete}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};

export default TaskListPage;