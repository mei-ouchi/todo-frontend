import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import FormField from './FormField';
import { taskSchema } from '../../features/tasks/schemas/taskSchemas';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { TasksDtoStatusEnum } from '../../api';
interface TestFormProps {
  initialData?: Partial<TaskFormInputs>;
  children: React.ReactNode;
}

// テスト用のコンポーネントを定義
const TestForm = ({ initialData, children }: TestFormProps) => {
  const methods = useForm<TaskFormInputs>({
    defaultValues: initialData as TaskFormInputs,
    resolver: zodResolver(taskSchema),
    mode: 'onSubmit',
  });
  
  const { trigger } = methods;
  useEffect(() => {
    trigger();
  }, [trigger]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FormField', () => {
  it('ラベルが正しくレンダリングされること', () => {
    render(
      <TestForm>
        <FormField name="title" label="タスクのタイトル" />
      </TestForm>
    );

    expect(screen.getByLabelText('タスクのタイトル')).toBeInTheDocument();
  });

  it('バリデーションエラーが発生したときにヘルパーテキストが表示されること', async () => {
    const initialData = {
      title: '長すぎるタイトルaaaaaaaaaaaaaaaaa',
      description: '',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '',
    };

    render(
      <TestForm initialData={initialData}>
        <FormField name="title" label="タスクのタイトル" />
      </TestForm>
    );

    await waitFor(() => {
      expect(screen.getByText('タイトルは20文字以内で入力してください。')).toBeInTheDocument();
    });
  });

  it('値を入力できること', async () => {
    render(
      <TestForm>
        <FormField name="description" label="タスクの説明" />
      </TestForm>
    );
    const inputElement = screen.getByLabelText('タスクの説明');
    
    // 値を入力
    fireEvent.change(inputElement, { target: { value: '新しい説明' } });
    
    // 入力した値がフォームの状態に反映されていることを確認
    await waitFor(() => {
      expect(inputElement).toHaveValue('新しい説明');
    });
  });
});