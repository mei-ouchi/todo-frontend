import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask } from '../features/tasks/hooks/useTask';
import type { TaskFormInputs } from '../features/tasks/schemas/taskSchemas';
import TaskDetailTemplate from '../components/templates/TaskDetailTemplate';
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
  };

  const handleUpdateTask = async (data: TaskFormInputs) => {
    if (!taskId) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        task: {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          dueDate: data.dueDate ? data.dueDate : undefined,
        },
      });
      navigate('/');
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error('タスクの更新に失敗しました:', errorMessage);
      alert(`タスクの更新に失敗しました: ${errorMessage}`);
    }
  };
  
  const handleCancelEdit = () => {
    navigate('/');
  };

  return (
    <TaskDetailTemplate
      task={task}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onUpdateTask={handleUpdateTask}
      onCancelEdit={handleCancelEdit}
    />
  );
};

export default TaskDetailPage;