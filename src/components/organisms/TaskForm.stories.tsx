import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm, FormProvider } from 'react-hook-form';
import { fn } from '@storybook/test';
import TaskForm from './TaskForm';
import { taskSchema } from '../../features/tasks/schemas/taskSchemas';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';
import { TasksDtoStatusEnum } from '../../api';
import type { StoryContext } from '@storybook/react-vite';
import { zodResolver } from '@hookform/resolvers/zod';

type TaskFormProps = {
  initialData?: TaskFormInputs & { id: number };
  onSubmit: (data: TaskFormInputs) => void;
  onCancel?: () => void;
};

const FormDecorator = (Story: React.FC<TaskFormProps>, context: StoryContext<TaskFormProps>) => {
  const initialData = context.args?.initialData;

  const defaultValues = initialData ? {
    title: initialData.title,
    description: initialData.description || '',
    status: initialData.status,
    dueDate: initialData.dueDate,
  } : {
    title: '',
    description: '',
    status: TasksDtoStatusEnum.Pending,
    dueDate: '',
  };
  
  const methods = useForm<TaskFormInputs>({
    defaultValues: defaultValues,
    resolver: zodResolver(taskSchema),
  });

  // `useEffect`フックを追加し、コンポーネントがマウントされた後にバリデーションをトリガー
  useEffect(() => {
    methods.trigger();
  }, [methods]);
  
  return (
    <FormProvider {...methods}>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Story />
      </div>
    </FormProvider>
  );
};

const meta: Meta<typeof TaskForm> = {
  title: 'Organisms/TaskForm',
  component: TaskForm,
  tags: ['autodocs'],
  decorators: [FormDecorator],
  argTypes: {
    onSubmit: { action: 'onSubmit' },
    onCancel: { action: 'onCancel' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 新規タスク作成
export const CreateTask: Story = {
  args: {
    initialData: undefined,
    onSubmit: fn(),
    onCancel: fn(),
  },
};

// 既存タスク編集
export const EditTask: Story = {
  args: {
    initialData: {
      id: 1,
      title: '既存のタスク',
      description: '既存の説明',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-09-01',
    },
    onSubmit: fn(),
    onCancel: fn(),
  },
};

// バリデーションエラー
export const ManualValidationError: Story = {
  args: {
    initialData: {
      id: 2,
      title: '長すぎるタイトルaaaaaaaaaaaaaaaaa',
      description: '説明には半角英数字を含めることはできませんaa',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2024-01-01',
    },
    onSubmit: fn(),
    onCancel: fn(),
  },
};