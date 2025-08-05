import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultApi } from './axios';
import type{ TaskRequest, TasksDto } from '../../../api';
import type { AxiosError } from 'axios';

// 全タスク取得のクエリキー
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  details: (id: number) => ['tasks', id] as const,
};

// 全タスク取得
export const useTasks = () => {
  return useQuery<TasksDto[]>({
    queryKey: TASK_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await defaultApi.getAllTasks();
      return response.data;
    },
  });
};

// 特定タスク取得
export const useTask = (id: number | undefined) => {
  return useQuery<TasksDto, Error>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('実行するにはタスクIDが必要です');
      }
      try {
        const response = await defaultApi.getTaskById(id);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          throw new Error('指定されたタスクIDは見つかりませんでした。');
        }
        throw error;
      }
    },
    enabled: id !== undefined,
  });
};

// タスク作成
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<TasksDto, Error, TaskRequest>({
    mutationFn: async (newTask: TaskRequest) => {
      const response = await defaultApi.createTask(newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};

// タスク更新
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<TasksDto, Error, { id: number; task: TaskRequest }>({
    mutationFn: async ({ id, task }) => {
      const response = await defaultApi.updateTask(id, task);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.details(variables.id) });
    },
  });
};

// タスク削除
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await defaultApi.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};