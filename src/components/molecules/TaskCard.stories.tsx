import type { Meta, StoryObj } from '@storybook/react-vite';
import TaskCard from './TaskCard';
import { TasksDtoStatusEnum } from '../../api';

//StorybookのMetaデータ
const meta: Meta<typeof TaskCard> = {
  title: 'Molecules/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  argTypes: {
    onComplete: { action: 'onComplete' },
    onDelete: { action: 'onDelete' },
    onEdit: { action: 'onEdit' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

//未完了のタスク
export const PendingTask: Story = {
  args: {
    task: {
      id: 1,
      title: '未完了のタスク',
      description: '未完了のタスクを行う',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-20',
    },
    onComplete: () => alert('完了ボタンがクリックされました'),
    onDelete: () => alert('削除ボタンがクリックされました'),
    onEdit: () => alert('編集ボタンがクリックされました'),
  },
};

//完了済みのタスク
export const CompletedTask: Story = {
  args: {
    task: {
      id: 2,
      title: '完了済みのタスク',
      description: '完了済みのタスクを行う',
      status: TasksDtoStatusEnum.Completed,
      dueDate: '2025-08-10',
    },
    onComplete: () => alert('完了ボタンがクリックされました'),
    onDelete: () => alert('削除ボタンがクリックされました'),
    onEdit: () => alert('編集ボタンがクリックされました'),
  },
};

//期限切れのタスク
export const OverdueTask: Story = {
  args: {
    task: {
      id: 3,
      title: '期限切れのタスク',
      description: '期限切れのタスクを行う',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-14',
    },
    onComplete: () => alert('完了ボタンがクリックされました'),
    onDelete: () => alert('削除ボタンがクリックされました'),
    onEdit: () => alert('編集ボタンがクリックされました'),
  },
};

//説明がないタスク
export const NoDescriptionTask: Story = {
  args: {
    task: {
      id: 4,
      title: '説明のないタスク',
      description: '',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-18',
    },
    onComplete: () => alert('完了ボタンがクリックされました'),
    onDelete: () => alert('削除ボタンがクリックされました'),
    onEdit: () => alert('編集ボタンがクリックされました'),
  },
};