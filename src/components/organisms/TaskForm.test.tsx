import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import TaskForm from './TaskForm';
import { taskSchema } from '../../features/tasks/schemas/taskSchemas';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { TasksDtoStatusEnum } from '../../api';
import type { TasksDto } from '../../api';

interface TestFormProps {
  initialData?: TasksDto;
  children: React.ReactNode;
}

const TestForm = ({ initialData, children }: TestFormProps) => {
  const methods = useForm<TaskFormInputs>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || TasksDtoStatusEnum.Pending,
      dueDate: initialData?.dueDate || '',
    },
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
  });

  const { trigger } = methods;
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

describe('TaskForm', () => {
  it('初期データが渡されたときにフォームに値が正しく設定されること', async () => {
    const initialData: TasksDto = {
      id: 1,
      title: 'テストタスク',
      description: 'テスト説明',
      status: TasksDtoStatusEnum.Completed,
      dueDate: '2025-08-20',
    };
    const onSubmitMock = vi.fn();
    render(
      <TestForm initialData={initialData}>
        <TaskForm onSubmit={onSubmitMock} />
      </TestForm>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('タイトル')).toHaveValue('テストタスク');
      expect(screen.getByLabelText('説明')).toHaveValue('テスト説明');
      expect(screen.getByRole('combobox', { name: '状態' })).toHaveTextContent('完了');
      expect(screen.getByLabelText('期限')).toHaveValue('2025-08-20');
    });
  });

  it('フォームが送信されたときにonSubmitが正しいデータで呼び出されること', async () => {
    const onSubmitMock = vi.fn();
    render(
      <TestForm>
        <TaskForm onSubmit={onSubmitMock} />
      </TestForm>
    );

    // フォームへの入力
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '新しいタスク' } });
    fireEvent.change(screen.getByLabelText('説明'), { target: { value: '新しい説明' } });

    const statusSelect = screen.getByRole('combobox', { name: '状態' });
    fireEvent.mouseDown(statusSelect);
    const completedOption = await screen.findByRole('option', { name: '完了' });
    fireEvent.click(completedOption);

    fireEvent.change(screen.getByLabelText('期限'), { target: { value: '2025-09-01' } });

    // フォームの送信
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '新しいタスク',
          description: '新しい説明',
          status: TasksDtoStatusEnum.Completed,
          dueDate: '2025-09-01',
        }),
        expect.any(Object)
      );
    });
  });

  it('バリデーションエラーが発生したときにエラーメッセージが表示されること', async () => {
    const onSubmitMock = vi.fn();
    render(
      <TestForm>
        <TaskForm onSubmit={onSubmitMock} />
      </TestForm>
    );

    const titleInput = screen.getByLabelText('タイトル');
    fireEvent.change(titleInput, { target: { value: '長すぎるタイトルaaaaaaaaaaaaaaaaa' } });
    fireEvent.blur(titleInput);
    
    await waitFor(() => {
      expect(screen.getByText('タイトルは20文字以内で入力してください。')).toBeInTheDocument();
    });
  });
});