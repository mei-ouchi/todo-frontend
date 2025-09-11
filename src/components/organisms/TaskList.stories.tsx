import type { Meta, StoryObj } from '@storybook/react-vite';
import TaskList from './TaskList';
import { TasksDtoStatusEnum } from '../../api';

const meta: Meta<typeof TaskList> = {
  title: 'Organisms/TaskList',
  component: TaskList,
  tags: ['autodocs'],
  argTypes: {
    onComplete: { action: 'onComplete' },
    onDelete: { action: 'onDelete' },
    onEdit: { action: 'onEdit' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 複数のタスクがある状態
export const WithTasks: Story = {
  args: {
    tasks: [
      {
        id: 1,
        title: '未完了のタスク',
        description: '未完了のタスクを行う',
        status: TasksDtoStatusEnum.Pending,
        dueDate: '2025-08-20',
      },
      {
        id: 2,
        title: '完了済みのタスク',
        description: '完了済みのタスクを行う',
        status: TasksDtoStatusEnum.Completed,
        dueDate: '2025-08-10',
      },
      {
        id: 3,
        title: '期限切れのタスク',
        description: '期限切れのタスクを行う',
        status: TasksDtoStatusEnum.Pending,
        dueDate: '2024-01-01',
      },
    ],
  },
};

// タスクが一つもない状態
export const NoTasks: Story = {
  args: {
    tasks: [],
  },
};