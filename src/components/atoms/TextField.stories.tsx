import type { Meta, StoryObj } from '@storybook/react-vite';
import TextField from './TextField';
import type { TextFieldProps } from '@mui/material';

type TextFieldStoryProps = TextFieldProps & {
  label: string;
};

const meta: Meta<TextFieldStoryProps> = {
  title: 'Atoms/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのテキストフィールド
export const Default: Story = {
  args: {
    label: 'タイトル',
    placeholder: 'タスクのタイトルを入力',
  },
};

// 値が入力されたテキストフィールド
export const WithValue: Story = {
  args: {
    label: 'タイトル',
    value: '完了したタスク',
  },
};

// エラー状態のテキストフィールド
export const WithError: Story = {
  args: {
    label: 'タイトル',
    error: true,
    helperText: 'タイトルは必須です。',
  },
};

// 無効化されたテキストフィールド
export const Disabled: Story = {
  args: {
    label: 'タイトル',
    value: '無効なタスク',
    disabled: true,
  },
};