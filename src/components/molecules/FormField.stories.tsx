import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm, FormProvider } from 'react-hook-form';
import FormField from './FormField';
import type { FormFieldProps } from './FormField';
import { taskSchema } from '../../features/tasks/schemas/taskSchemas';
import type { TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';

const FormDecorator = (Story: () => React.ReactElement) => {
  const methods = useForm<TaskFormInputs>({
    defaultValues: { title: '', description: '', status: 'PENDING', dueDate: '' },
    resolver: (values) => {
      const result = taskSchema.safeParse(values);
      return { values: result.success ? result.data : {}, errors: result.success ? {} : result.error.issues };
    },
  });
  return (
    <FormProvider {...methods}>
      <form style={{ padding: '16px' }}>
        <Story />
      </form>
    </FormProvider>
  );
};

const meta: Meta<FormFieldProps> = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  decorators: [FormDecorator],
  argTypes: {
    name: { control: 'select', options: ['title', 'description', 'status', 'dueDate'] },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// タイトル入力フィールド
export const TitleField: Story = {
  args: {
    name: 'title',
    label: 'タイトル',
  },
};

// 説明入力フィールド
export const DescriptionField: Story = {
  args: {
    name: 'description',
    label: '説明',
    multiline: true,
    rows: 4,
  },
};

// 日付入力フィールド
export const DueDateField: Story = {
  args: {
    name: 'dueDate',
    label: '期限',
    type: 'date',
  },
};